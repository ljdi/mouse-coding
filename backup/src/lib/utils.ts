import { promises as fs } from "@zenfs/core";
import * as path from "@zenfs/core/path";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isClient = () => typeof window === "object";
export const isObject = (obj?: unknown) =>
  obj ? typeof obj === "object" : false;
export const { isArray } = Array;
export const ensureArray = <T>(
  thing: readonly T[] | T | undefined | null,
): readonly T[] => {
  if (isArray(thing)) return thing;
  if (thing == null) return [];
  return [thing] as readonly T[];
};
export const ensureObject = (
  o: Record<string, unknown> = {},
): Record<string, unknown> => (isObject(o) ? o : {});

export const hash = async (message: string) => {
  const data = new TextEncoder().encode(message);
  const hashBuffer = await window.crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

export const promisify =
  <T>(fn: (...args: unknown[]) => void) =>
  (...args: unknown[]) =>
    new Promise<T>((resolve, reject) => {
      fn(...args, (err: unknown, result: T) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

export async function syncDirectory(
  sourcePath: string,
  targetPath: string,
): Promise<void> {
  const [sourceEntries, targetEntries] = await Promise.all([
    fs.readdir(sourcePath, { withFileTypes: true }),
    fs.readdir(targetPath, { withFileTypes: true }),
  ]);
  const targetMap = new Map(targetEntries.map((entry) => [entry.name, entry]));

  for (const entry of sourceEntries) {
    const sourceEntryPath = path.join(sourcePath, entry.name);
    const targetEntryPath = path.join(targetPath, entry.name);
    if (entry.isDirectory()) {
      await syncDirectory(sourceEntryPath, targetEntryPath);
    } else if (entry.isFile()) {
      await fs.copyFile(sourceEntryPath, targetEntryPath);
    }
    targetMap.delete(entry.name);
  }

  // Remove extra entries in target that do not exist in source
  for (const [name, entry] of targetMap) {
    const targetEntryPath = path.join(targetPath, name);
    if (entry.isSymbolicLink()) {
      await fs.unlink(targetEntryPath);
    } else {
      if (entry.isDirectory()) {
        await fs.rm(targetEntryPath, { recursive: true, force: true });
      } else {
        await fs.unlink(targetEntryPath);
      }
    }
  }
}

export async function copyDirectory(
  sourcePath: string,
  targetPath: string,
): Promise<void> {
  await fs.mkdir(targetPath, { recursive: true });
  const entries = await fs.readdir(sourcePath, { withFileTypes: true });

  for (const entry of entries) {
    const sourceEntryPath = path.join(sourcePath, entry.name);
    const targetEntryPath = path.join(targetPath, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(sourceEntryPath, targetEntryPath);
    } else if (entry.isFile()) {
      await fs.copyFile(sourceEntryPath, targetEntryPath);
    }
  }
}

export interface FsCommand {
  action: "create" | "modify" | "rename" | "delete";
  type: "file" | "directory";
  // For non-rename actions, target is a string representing the relative path from the base directory.
  // For the rename action, target is an object with { from, to } properties.
  target: string | { from: string; to: string };
  // For create/modify file: content to write
  content?: string;
}

export async function executeFsCommand(
  basePath: string,
  command: FsCommand,
): Promise<void> {
  if (command.action === "rename") {
    if (typeof command.target !== "object") {
      throw new Error(
        'For rename action, target must be an object with "from" and "to" properties.',
      );
    }
    const fullPath = path.join(basePath, command.target.from);
    const newFullPath = path.join(basePath, command.target.to);
    await fs.rename(fullPath, newFullPath);
  } else {
    if (typeof command.target !== "string") {
      throw new Error("For non-rename actions, target must be a string.");
    }
    const fullPath = path.join(basePath, command.target);
    switch (command.action) {
      case "create":
        if (command.type === "directory") {
          await fs.mkdir(fullPath, { recursive: true });
        } else {
          await fs.mkdir(path.dirname(fullPath), { recursive: true });
          await fs.writeFile(fullPath, command.content ?? "");
        }
        break;
      case "modify":
        if (command.type === "file") {
          await fs.writeFile(fullPath, command.content ?? "");
        } else {
          throw new Error("Modification is supported only for files.");
        }
        break;
      case "delete":
        if (command.type === "directory") {
          await fs.rm(fullPath, { recursive: true, force: true });
        } else {
          await fs.unlink(fullPath);
        }
        break;
      default:
        throw new Error("Unsupported action.");
    }
  }
}

type WriteFileData = Parameters<typeof fs.writeFile>[1];

export const getFileExtension = (id: string) => {
  const lastDotIndex = id.lastIndexOf(".");
  if (lastDotIndex >= 0) {
    return id.substring(lastDotIndex);
  }
  return "";
};

/**
 * 判断目录不存在则执行 mkdir
 * @param path 文件路径
 * @param options mkdir 选项参数
 */
export const mkdirIfNotExits = async (path: string) => {
  if (!(await fs.exists(path))) {
    return mkdirWithRecursive(path);
  }
};
export const mkdirWithRecursive = (path: string) => {
  return fs.mkdir(path, { recursive: true });
};

/**
 * readFile 免传编码参数
 * @param filePath 文件路径
 * @returns 文件内容
 */
export const readFileWithUtf8Encoding = (filePath: string) =>
  fs.readFile(filePath, "utf8");

/**
 *  判断文件存在则读取内容, 否则返回 `null`
 * @param filePath 文件路径
 * @returns 文件内容
 */
export const readFileIFItExist = async (filePath: string) =>
  (await fs.exists(filePath)) ? readFileWithUtf8Encoding(filePath) : null;

/**
 * 重写文件
 * @param filePath 文件路径
 * @param data 数据
 */
export const overwriteFile = async (filePath: string, data: WriteFileData) => {
  // if (await exists(filePath)) await rm(filePath as string, { force: true });

  return fs.writeFile(filePath, data);
};

/**
 * 备份文件后写入
 * @param filePath 文件路径
 * @param data 文件内容
 */
export const writeFileWithBackupFirst = async (
  filePath: string,
  data: WriteFileData,
) => {
  const isExists = await fs.exists(filePath);
  const backupFilePath = filePath + ".backup";
  if (isExists) await fs.rename(filePath, backupFilePath);
  await fs.writeFile(filePath, data);
  if (isExists) await fs.rm(backupFilePath, { force: true });
};

/**
 * 写入文件如果文件不存在
 * @param filePath 文件路径
 * @param data 文件内容
 */
export const writeFileIfItNotExist = async (
  filePath: string,
  data: WriteFileData,
) => {
  if (!(await fs.exists(filePath))) return fs.writeFile(filePath, data);
};
