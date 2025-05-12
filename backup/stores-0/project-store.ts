import { PROJECTS_PATH, SYNC_PROJECTS_PATH, TMP_PATH } from "@/constant/path";
import PackageManager from "@/lib/package-manager";
import {
  copyDirectory,
  mkdirIfNotExits,
  mkdirWithRecursive,
  syncDirectory,
} from "@repo/ui/lib/utils";
import { configure, promises as fs, InMemory, writeFile } from "@zenfs/core";
import * as path from "@zenfs/core/path";
import { IndexedDB, WebAccess } from "@zenfs/dom";
import { createStore } from "zustand";

export type ProjectState = {
  syncDirectoryHandle?: FileSystemDirectoryHandle;
  activeProjectName?: string;
  packageManager?: PackageManager;
};

export type ProjectAction = {
  init(): Promise<void>;
  initSyncProject(
    basedir: string,
    directoryHandle: FileSystemDirectoryHandle,
  ): Promise<void>;
  loadProject(name: string): void;
  getActiveProjectName(): string;
  getActiveProjectPath(): string;
  getPackageManager(): PackageManager;
  syncProject(): Promise<void>;
  packageManagerInit(): Promise<void>;
  createDirectory(dirPath: string): Promise<void>;
  createFile(dirPath: string, filename: string, data?: string): Promise<void>;
  addDependency(name: string, version?: string): Promise<void>;
  rmDependency(name: string): Promise<void>;
  listDependencies(): Promise<void>;
};

export type ProjectStore = ProjectState & ProjectAction;

export default createStore<ProjectStore>((set, get) => {
  return {
    syncDirectoryHandle: undefined,
    activeProjectName: undefined,
    packageManager: undefined,

    init: async () => {
      // 获取 FileSystemDirectoryHandle
      const syncDirectoryHandle = await window.showDirectoryPicker({
        mode: "readwrite",
      });

      set({ syncDirectoryHandle });

      // 初始化 ZenFS
      await configure({
        mounts: {
          "/": IndexedDB,
          [SYNC_PROJECTS_PATH]: {
            backend: WebAccess,
            handle: syncDirectoryHandle,
          },
          [TMP_PATH]: InMemory,
        },
        // cacheStats: true,
        // cachePaths: true,
        disableAccessChecks: true,
        disableUpdateOnRead: true,
        onlySyncOnClose: true,
        // disableAsyncCache: true
      });

      // 创建项目目录
      await fs.mkdir(PROJECTS_PATH, { recursive: true });
      // get().initSyncProject(join(SYNC_PROJECTS_PATH, syncDirectoryHandle.name), syncDirectoryHandle)
    },
    initSyncProject: async (basedir, directoryHandle) => {
      for await (const [name, handle] of directoryHandle.entries()) {
        if (handle instanceof FileSystemDirectoryHandle) {
          await get().initSyncProject(path.join(basedir, name), handle);
        } else if (handle instanceof FileSystemFileHandle) {
          const file = await handle.getFile();
          const content = await file.text();
          await mkdirIfNotExits(basedir);
          await writeFile(path.join(basedir, name), content);
        }
      }
    },
    loadProject: async (name) => {
      const activeProjectPath = path.join(PROJECTS_PATH, name);
      const packageManager = new PackageManager(activeProjectPath);

      set({ activeProjectName: name, packageManager });

      await copyDirectory(
        path.join(SYNC_PROJECTS_PATH, name),
        activeProjectPath,
      );
    },
    getActiveProjectName: () => {
      const { activeProjectName } = get();
      if (!activeProjectName)
        throw new Error("activeProjectName is not defined");
      return activeProjectName;
    },
    getActiveProjectPath: () => {
      const { getActiveProjectName } = get();

      const activeProjectPath = path.join(
        PROJECTS_PATH,
        getActiveProjectName(),
      );
      return activeProjectPath;
    },
    getPackageManager: () => {
      const { packageManager } = get();
      if (!packageManager) throw new Error("packageManager is not defined");
      return packageManager;
    },
    syncProject: async () => {
      const { getActiveProjectPath, getActiveProjectName } = get();
      const activeProjectPath = getActiveProjectPath();
      const syncProjectPath = path.join(
        SYNC_PROJECTS_PATH,
        getActiveProjectName(),
      );

      await syncDirectory(activeProjectPath, syncProjectPath);
    },
    packageManagerInit: async () => {
      const { getPackageManager } = get();
      getPackageManager().init();
    },
    createDirectory: async (dirPath: string) => {
      await mkdirWithRecursive(dirPath);
    },
    createFile: async (dirPath, filename, data = "") => {
      const { createDirectory, getActiveProjectPath } = get();

      const filePath = path.join(getActiveProjectPath(), dirPath, filename);

      await createDirectory(path.dirname(filePath));
      await fs.writeFile(filePath, data);
    },

    addDependency: async (name, version) => {
      const { getPackageManager } = get();
      await getPackageManager().add(name, version);
    },
    listDependencies: async () => {
      const { getPackageManager } = get();
      await getPackageManager().list();
    },
    rmDependency: async (name: string) => {
      const { getPackageManager } = get();
      await getPackageManager().remove(name);
    },
  };
});
