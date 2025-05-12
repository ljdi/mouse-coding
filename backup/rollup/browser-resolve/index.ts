import { MODULES_DIR_NAME } from "@/constant/path";
import { readFileWithUtf8Encoding } from "@mc/shared/fs";
import {
  Exports,
  getPackageJson,
  PackageJson,
} from "@/packages/mcpm/packageJson";
import projectStore from "@/stores/project-store";
import type { Plugin } from "@rollup/browser";
import { isAbsolute, join } from "@zenfs/core/path";
import { getPackageName, getPackageSubPath } from "./util";

export interface BrowserResolveOptions {
  browser?: boolean;
  moduleDirectories?: string[];
  rootDir: string;
}

const resolveExports = (exports?: Exports, subPath?: string): string | null => {
  if (!exports) return null;
  let subPathList: string[] = [];
  if (subPath) {
    subPathList = subPath.split("/");
  }

  if (typeof exports === "string") {
    if (!subPathList.length) return exports;
    throw new Error(`Can't resolve subpath: ${subPath}`);
  } else if (typeof exports === "object") {
    // 没有子路径
    if (!subPathList.length) {
      const result = exports["."] || exports["./"];
      if (typeof result === "string") return result;
      if (typeof result === "object") {
        const resolvedResult =
          result["browser"] ?? result["import"] ?? result["default"];
        if (typeof resolvedResult === "string") {
          return resolvedResult;
        }
        return resolveExports(result);
      }
    } else {
      // 有子路径
      const subPathItem = subPathList.shift();
      if (subPathItem) {
        let result = exports[`./${subPathItem}`];

        if (typeof result === "string") return result;
        if (typeof result === "object") {
          return resolveExports(result, subPathList.join("/"));
        }

        if (!result) {
          result = exports["."] || exports["./"];
        }
        return resolveExports(
          result,
          [subPathItem].concat(subPathList).join("/"),
        );
      }
    }
  }

  return null;
};
const resolvePackage = async (
  packagePath: string,
  id: string,
): Promise<string | null> => {
  const packageJson = await getPackageJson(packagePath);

  const mainFields = [
    "browser",
    "exports",
    "module",
    "main",
  ] as (keyof PackageJson)[];

  for (const mainField of mainFields) {
    if (mainField in packageJson) {
      if (!packageJson[mainField]) continue;
      const subPath = getPackageSubPath(id);
      const exportPath = resolveExports(packageJson[mainField], subPath);
      if (exportPath) return join(packagePath, exportPath);
    }
  }

  return null;
};

export default function createBrowserResolve({
  rootDir,
}: BrowserResolveOptions): Plugin {
  return {
    name: "browser-resolve",

    async resolveId(importee, importer) {
      const { mcpm } = projectStore.getState();
      const symlinks = await mcpm.getSymlinks();

      const packageName = getPackageName(importee);
      console.log("resolveId", importee, importer);
      if (packageName) {
        const packagePath = symlinks[packageName];
        return await resolvePackage(
          join(rootDir, MODULES_DIR_NAME, packagePath),
          importee,
        );
      }

      return isAbsolute(importee) ? importee : join(rootDir, importee);
    },
    load: readFileWithUtf8Encoding,

    moduleParsed(info) {
      console.log("moduleParsed", info);
    },
  };
}
