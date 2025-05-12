import { HOME, STORE_PATH, TMP_PATH } from "@/constant/path";
import { mkdirIfNotExits, mkdirWithRecursive } from "@mc/shared/fs";
import Mcpm from "@/packages/mcpm";
import { configure, InMemory } from "@zenfs/core";
import { dirname, join } from "@zenfs/core/emulation/path.js";
import { readdir, writeFile } from "@zenfs/core/promises";
import { IndexedDB, WebAccess } from "@zenfs/dom";
import { createStore } from "zustand";

export type ProjectState = {
  projectPath: string;
  mcpm: Mcpm;
};

export type ProjectAction = {
  loadProject: () => Promise<void>;
  initProject: () => Promise<void>;
  changeProject: (path: string) => void;
  createFile: (
    dirPath: string,
    filename: string,
    data: Parameters<typeof writeFile>[1],
  ) => Promise<void>;
  createDirectory: typeof mkdirWithRecursive;
  addDependency: (name: string, version?: string) => Promise<void>;
  listDependencies: () => Promise<string[]>;
};

const defaultProjectPath = `${HOME}/app`;

const defaultInitState: ProjectState = {
  projectPath: defaultProjectPath,
  mcpm: new Mcpm(defaultProjectPath),
};

export type ProjectStore = ProjectState & ProjectAction;

export default createStore<ProjectStore>((set, get) => {
  return {
    ...defaultInitState,

    loadProject: async () => {
      // 获取 FileSystemDirectoryHandle
      const directoryHandle = await window.showDirectoryPicker({
        mode: "readwrite",
      });

      // 拼接项目目录
      const projectPath = `${HOME}/${directoryHandle.name}`;

      // 初始化 ZenFS
      await configure({
        mounts: {
          [projectPath]: {
            backend: WebAccess,
            handle: directoryHandle,
          },
          [STORE_PATH]: IndexedDB,
          [TMP_PATH]: InMemory,
        },
        // cacheStats: true,
        cachePaths: true,
        disableAccessChecks: true,
        disableUpdateOnRead: true,
        onlySyncOnClose: true,
        // disableAsyncCache: true,
      });

      await restoreProject(projectPath, directoryHandle);
      console.log(await readdir(projectPath));

      const mcpm = new Mcpm(projectPath);

      set({ projectPath, mcpm });

      await mkdirIfNotExits(projectPath);
    },
    initProject: async () => {
      const { mcpm } = get();
      mcpm.init();
    },
    createDirectory: mkdirWithRecursive,
    createFile: async (dirPath, filename, data = "") => {
      const { createDirectory, projectPath } = get();

      const filePath = join(projectPath, dirPath, filename);

      await createDirectory(dirname(filePath));
      await writeFile(filePath, data);
    },

    addDependency: (name, version) => {
      return get().mcpm.add(name, version);
    },
    listDependencies: async () => await get().mcpm.list(),

    changeProject: (path: string) => {
      set({ projectPath: path });
      // TODO: 读取切换项目的  package.json
    },
  };
});

const restoreProject = async (
  basedir: string,
  directoryHandle: FileSystemDirectoryHandle,
) => {
  for await (const [name, handle] of directoryHandle.entries()) {
    if (handle instanceof FileSystemDirectoryHandle) {
      await restoreProject(join(basedir, name), handle);
    } else if (handle instanceof FileSystemFileHandle) {
      const file = await handle.getFile();
      const content = await file.text();
      await mkdirIfNotExits(basedir);
      await writeFile(join(basedir, name), content);
    }
  }
};
