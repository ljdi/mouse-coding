import {
  CAS_MODULES_SYMLINKS_PROPERTY_NAME,
  CAS_NAME,
  MODULES_DIR_NAME,
  MODULES_FILE_NAME,
  PACKAGE_JSON_FILE_NAME,
  REGISTRY_FILE_NAME,
  STORE_PATH,
} from "@/constant/path";
import { Archive, TarEntry } from "@obsidize/tar-browserify";
import {
  mkdirIfNotExits,
  readFileWithUtf8Encoding,
  writeFileIfItNotExist,
} from "@repo/ui/lib/utils";
import { promises as fs } from "@zenfs/core";
import * as path from "@zenfs/core/path";
import { ungzip } from "pako";
import semver from "semver";
import { getPackageJson, writePackageJson } from "./packageJson";

interface PackageRegistry {
  name: string;
  "dist-tags": Record<"latest" | string, string>;
  versions: Record<
    string,
    { dist: { tarball: string }; dependencies: Record<string, string> }
  >;
}

export enum UpdatePackageJsonAction {
  // eslint-disable-next-line
  add,
  remove,
}

export enum UpdateSymlinkMapAction {
  // eslint-disable-next-line
  add,
  remove,
}

export interface CasModules {
  [CAS_MODULES_SYMLINKS_PROPERTY_NAME]?: Record<string, string>;
}

export type Modules<
  ModuleName extends string = string,
  FileName extends string = string,
  FileContent extends string = string,
> = Record<ModuleName, Record<FileName, FileContent>>;

// 判断是否过期 默认一天

export default class Mcpm {
  private storePath = STORE_PATH;
  private registry = "https://registry.npmmirror.com";

  private modulesDirPath: string;
  private casPath: string;
  private modulesFilePath: string;

  constructor(private projectPath: string) {
    this.modulesDirPath = path.join(projectPath, MODULES_DIR_NAME);
    this.casPath = path.join(this.modulesDirPath, CAS_NAME);
    this.modulesFilePath = path.join(this.modulesDirPath, MODULES_FILE_NAME);
  }

  async init() {
    if (this.projectPath) {
      if (!(await fs.exists(this.modulesDirPath))) {
        // 创建 package.json
        await writeFileIfItNotExist(
          path.join(this.projectPath, PACKAGE_JSON_FILE_NAME),
          JSON.stringify({
            name: path.basename(this.projectPath),
            private: true,
          }),
        );
      } else {
        throw new Error("Project already init");
      }
    }
  }

  /**
   * 新增包
   * @param packageName 包名
   * @param version 版本
   */
  async add(packageName: string, versionRange?: string) {
    if (!this.projectPath) throw new Error("Project not init");

    // mkdirIfNotExits(this.modulesPath);

    // 包注册表
    const { versions, "dist-tags": distTags } =
      await this.fetchPackageRegistry(packageName);

    // 获取版本
    let version = versionRange ?? distTags.latest;

    // 处理 version
    version = this.getMatchingLatestVersion(Object.keys(versions), version);

    const packageFullName = `${packageName}@${version}`;

    // 写入包文件到 mousecoding_modules/.mcpm
    const modulePathInCas = path.join(
      packageFullName,
      MODULES_DIR_NAME,
      packageName,
    );
    const moduleAbsolutePathInCas = path.join(this.casPath, modulePathInCas);
    if (!(await fs.exists(moduleAbsolutePathInCas))) {
      const tarball = versions[version].dist.tarball;
      if (!tarball) {
        throw Error("tarballUrl is undefined");
      }
      const data = await this.fetchPackage(versions[version].dist.tarball);
      // 写入 mousecoding_modules/.mcpm
      await this.writePackage2Cas(moduleAbsolutePathInCas, data);
    }

    // 软链接到 mousecoding_modules
    await this.symlink(UpdateSymlinkMapAction.add, packageFullName);

    // 安装依赖的依赖
    await this.addDep2Dep(versions[version]?.dependencies, packageFullName);

    // 更新 package.json
    this.updateDependencies(UpdatePackageJsonAction.add, packageName, version);
  }

  async remove(packageName: string) {
    console.log("remove", packageName);
  }

  async list() {
    return await fs.readdir(this.modulesDirPath);
  }

  async getCasModules() {
    let casModules: CasModules;

    if (await fs.exists(this.modulesFilePath)) {
      const casModulesContent = await readFileWithUtf8Encoding(
        this.modulesFilePath,
      );
      casModules = JSON.parse(casModulesContent);
    } else {
      casModules = {};
    }

    return casModules;
  }

  async getSymlinks() {
    const casModules = await this.getCasModules();
    return casModules[CAS_MODULES_SYMLINKS_PROPERTY_NAME] ?? {};
  }

  private async addDep2Dep(
    dependencies: PackageRegistry["versions"][string]["dependencies"] = {},
    dependencyPackageFullName: string,
  ) {
    await Promise.all(
      Object.entries(dependencies).map(async ([name, versionRange]) => {
        const { versions } = await this.fetchPackageRegistry(name);

        // 获取最新版本
        const version = this.getMatchingLatestVersion(
          Object.keys(versions),
          versionRange,
        );

        const {
          dependencies,
          dist: { tarball },
        } = versions[version];

        const packageFullName = `${name}@${version}`;

        // 写入包文件到 mousecoding_modules/.mcpm
        const modulePathInCas = path.join(
          packageFullName,
          MODULES_DIR_NAME,
          name,
        );
        const moduleAbsolutePathInCas = path.join(
          this.casPath,
          modulePathInCas,
        );

        if (!(await fs.exists(modulePathInCas))) {
          const data = await this.fetchPackage(tarball);

          await this.writePackage2Cas(moduleAbsolutePathInCas, data);
        }

        await this.symlink(
          UpdateSymlinkMapAction.add,
          packageFullName,
          dependencyPackageFullName,
        );

        if (dependencies) {
          await this.addDep2Dep(dependencies, packageFullName);
        }
      }),
    );
  }

  private async symlink<Action extends UpdateSymlinkMapAction>(
    action: Action,
    packageFullName: string,
    dependencyPackageFullName?: string,
  ) {
    const packageName = packageFullName.substring(
      0,
      packageFullName.lastIndexOf("@"),
    );

    const symlinkToPath = dependencyPackageFullName
      ? path.join(
          this.casPath,
          dependencyPackageFullName,
          MODULES_DIR_NAME,
          packageName,
        )
      : path.join(this.modulesDirPath, packageName);

    const symlinkFrom = path.relative(
      path.dirname(symlinkToPath),
      path.join(this.casPath, packageFullName, MODULES_DIR_NAME, packageName),
    );
    if (!(await fs.exists(symlinkToPath))) {
      await fs.symlink(symlinkFrom, symlinkToPath);
    }

    // update node_modules/.modules.json
    const casModules = await this.getCasModules();
    const symlinkMap = new Map(
      Object.entries(casModules[CAS_MODULES_SYMLINKS_PROPERTY_NAME] ?? {}),
    );

    switch (action) {
      case UpdateSymlinkMapAction.add:
        symlinkMap.set(packageName, symlinkFrom);
        break;
      case UpdateSymlinkMapAction.remove:
        symlinkMap.delete(packageName);
        break;
    }
    // 写入 .modules.json
    await fs.writeFile(
      this.modulesFilePath,
      JSON.stringify({
        ...casModules,
        [CAS_MODULES_SYMLINKS_PROPERTY_NAME]: Object.fromEntries(symlinkMap),
      }),
    );
  }

  /**
   * 写入 package
   * @param packagePath 写入路径
   * @param entries 写入的文件
   */
  private async writePackage2Cas(packagePath: string, entries: TarEntry[]) {
    // 循环写入
    for (const entry of entries) {
      if (entry.content) {
        // TODO: 不确定是否所有的包内都有一层 package 目录包裹
        const packageFilePath = path.join(
          packagePath,
          entry.fileName.replace(/^package/, ""),
        );

        // 包文件父级目录不存在则创建
        await mkdirIfNotExits(path.dirname(packageFilePath));

        await fs.writeFile(packageFilePath, entry.content);
      }
    }
  }

  private async fetchPackage(tarballUrl: string) {
    const tarball = await fetch(tarballUrl).then((res) => res.arrayBuffer());
    // TODO: 校验完整性
    // 先解压 `gzip`, 再解压 tar
    const { entries } = await Archive.extract(ungzip(new Uint8Array(tarball)));
    if (!entries.length) throw new Error("The downloaded content is empty");

    return entries;
  }

  private async fetchPackageRegistry(name: string) {
    const registryJson = await fetch(
      `${this.registry}/${name}`,
    ).then<PackageRegistry>((res) => res.json());

    return registryJson;
  }

  getMatchingLatestVersion(versions: string[], versionRange: string) {
    // 过滤出符合版本范围的版本号
    const matchingVersions = versions.filter((version) =>
      semver.satisfies(version, versionRange),
    );

    // 找到最大的版本号
    const latestVersion = semver.maxSatisfying(matchingVersions, versionRange);

    return latestVersion || versionRange;
  }

  /**
   *
   * @param action 操作类型
   * @param packageName 包名
   * @param version 版本
   */
  private async updateDependencies<
    Action extends UpdatePackageJsonAction,
    Version = Action extends UpdatePackageJsonAction.add ? string : undefined,
  >(action: Action, packageName: string, version?: Version) {
    const packageJsonObj = await getPackageJson(this.projectPath);
    switch (action) {
      case UpdatePackageJsonAction.add: {
        packageJsonObj.dependencies = {
          ...packageJsonObj.dependencies,
          [packageName]: `^${version}`,
        };
        break;
      }
      case UpdatePackageJsonAction.remove: {
        const { [packageName]: _, ...restDependencies } =
          packageJsonObj.dependencies || {};
        packageJsonObj.dependencies = restDependencies;
        break;
      }
      default:
        break;
    }
    await writePackageJson(this.projectPath, packageJsonObj);
  }

  createCacheRegistryPath(packageName: string) {
    return path.join(this.storePath, packageName, REGISTRY_FILE_NAME);
  }

  getModulePackageJsonPath(packageName: string) {
    return path.join(
      this.casPath,
      packageName,
      MODULES_DIR_NAME,
      "package.json",
    );
  }
}
