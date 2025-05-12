import { isObject, overwriteFile, readFileIFItExist } from "@repo/ui/lib/utils";
import * as path from "@zenfs/core/path";
import type { PackageJson } from "type-fest";

export const getPackageJson = async (
  basePath: string,
): Promise<PackageJson> => {
  const packageJsonPath = path.join(basePath, "package.json");

  const packageJsonContent = await readFileIFItExist(packageJsonPath);

  if (!packageJsonContent) throw new Error(`${packageJsonPath} not found`);

  return JSON.parse(packageJsonContent);
};

export const writePackageJson = async (basePath: string, data: PackageJson) => {
  return overwriteFile(
    path.join(basePath, "package.json"),
    JSON.stringify(data),
  );
};

const resolveExports = (exports: PackageJson.Exports): string => {
  if (typeof exports === "string") return exports;

  if (exports && !Array.isArray(exports)) {
    for (const key of ["browser", "import", "default"] as const) {
      if (isObject(exports[key])) {
        return resolveExports(exports[key]);
      }
    }
  }

  throw new Error("导出第三方包逻辑没实现");
};

export const resolvePackageEntryPath = (
  id: string,
  moduleName: string,
  { exports, module, main }: PackageJson,
): string => {
  if (module) {
    // 存在 module 字段
    return module;
  } else if (exports && isObject(exports)) {
    // TODO: 下面使用递归匹配,防止 `module/a` 匹配到 `{".":{"./a":"..."},"./a":{...}}`, 优先匹配长文本. 可能会有边界问题
    const sortedKeys = Object.keys(exports).sort((a, b) => b.length - a.length);
    for (const key of sortedKeys) {
      const value = (exports as PackageJson.ExportConditions)[key];
      // 文件导出
      if (key.startsWith(".")) {
        if (/\*+/.test(key)) {
          console.log(key);
        }
        /**
         * 解析 id
         * TODO: exports glob 匹配
         */
        const resolvedId = path.resolve(moduleName, key);
        console.log("resolvedId", resolvedId);

        if (resolvedId === id) {
          return resolveExports(value);
        } else if (id.startsWith(resolvedId)) {
          // return resolvePackageEntryPath(id, resolvedId, {
          //   exports: value,
          // });
        }
        // 默认导出或第三方
      } else {
        return resolveExports(value);
      }
    }
  } else if (main) {
    return main;
  }
  throw Error("Not found module entry");
};
