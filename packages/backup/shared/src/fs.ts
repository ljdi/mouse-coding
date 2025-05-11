import {
  exists,
  mkdir,
  readFile,
  rm,
  rename,
  writeFile,
} from "@zenfs/core/promises";

type WriteFileData = Parameters<typeof writeFile>[1];

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
  if (!(await exists(path))) {
    return mkdirWithRecursive(path);
  }
};
export const mkdirWithRecursive = (path: string) => {
  return mkdir(path, { recursive: true });
};

/**
 * readFile 免传编码参数
 * @param filePath 文件路径
 * @returns 文件内容
 */
export const readFileWithUtf8Encoding = (filePath: string) =>
  readFile(filePath, "utf8");

/**
 *  判断文件存在则读取内容, 否则返回 `null`
 * @param filePath 文件路径
 * @returns 文件内容
 */
export const readFileIFItExist = async (filePath: string) =>
  (await exists(filePath)) ? readFileWithUtf8Encoding(filePath) : null;

/**
 * 重写文件
 * @param filePath 文件路径
 * @param data 数据
 */
export const overwriteFile = async (filePath: string, data: WriteFileData) => {
  // if (await exists(filePath)) await rm(filePath as string, { force: true });

  return writeFile(filePath, data);
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
  const isExists = await exists(filePath);
  const backupFilePath = filePath + ".backup";
  if (isExists) await rename(filePath, backupFilePath);
  await writeFile(filePath, data);
  if (isExists) await rm(backupFilePath, { force: true });
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
  if (!(await exists(filePath))) return writeFile(filePath, data);
};
