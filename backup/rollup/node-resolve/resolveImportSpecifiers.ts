import { PackageJson } from "@/packages/mcpm/packageJson";
import resolve from "@/packages/resolve";
import { dirname } from "@zenfs/core/emulation/path.js";
import { readFile } from "@zenfs/core/promises";
import { fileURLToPath, pathToFileURL } from "url";
import { isDirCached, isFileCached, readCachedFile } from "./cache";
import { resolveSymlink } from "./fs";
import resolvePackageExports from "./package/resolvePackageExports";
import resolvePackageImports from "./package/resolvePackageImports";
import { findPackageJson, ResolveError } from "./package/utils";
import { getPackageInfo, getPackageName } from "./util";

const resolveImportPath = resolve;

async function getPackageJson(
  importer,
  pkgName,
  resolveOptions,
  moduleDirectories,
) {
  if (importer) {
    const selfPackageJsonResult = await findPackageJson(
      importer,
      moduleDirectories,
    );
    if (
      selfPackageJsonResult &&
      selfPackageJsonResult.pkgJson.name === pkgName
    ) {
      // the referenced package name is the current package
      return selfPackageJsonResult;
    }
  }

  try {
    const pkgJsonPath = await resolveImportPath(
      `${pkgName}/package.json`,
      resolveOptions,
    );
    const pkgJson = JSON.parse(await readFile(pkgJsonPath, "utf-8"));
    return { pkgJsonPath, pkgJson, pkgPath: dirname(pkgJsonPath) };
  } catch (_) {
    return null;
  }
}

async function resolveIdClassic({
  importSpecifier,
  packageInfoCache,
  extensions,
  mainFields,
  preserveSymlinks,
  useBrowserOverrides,
  baseDir,
  moduleDirectories,
  modulePaths,
  rootDir,
  ignoreSideEffectsForRoot,
}: {
  importSpecifier: string;
  packageInfoCache: Map<string, unknown>;
  extensions: string[];
  mainFields: string[];
  preserveSymlinks: boolean;
  useBrowserOverrides: boolean;
  baseDir: string;
  moduleDirectories: string[];
  modulePaths: string[];
  rootDir: string;
  ignoreSideEffectsForRoot: boolean;
}) {
  let hasModuleSideEffects = () => null;
  let hasPackageEntry = true;
  let packageBrowserField = false;
  let packageInfo;

  const filter = (pkg: PackageJson, pkgPath: string) => {
    const info = getPackageInfo({
      cache: packageInfoCache,
      extensions,
      pkg,
      pkgPath,
      mainFields,
      preserveSymlinks,
      useBrowserOverrides,
      rootDir,
      ignoreSideEffectsForRoot,
    });

    ({
      packageInfo,
      hasModuleSideEffects,
      hasPackageEntry,
      packageBrowserField,
    } = info);

    return info.cachedPkg;
  };

  const resolveOptions = {
    basedir: baseDir,
    readFile: readCachedFile,
    isFile: isFileCached,
    isDirectory: isDirCached,
    extensions,
    includeCoreModules: false,
    moduleDirectory: moduleDirectories,
    paths: modulePaths,
    preserveSymlinks,
    packageFilter: filter,
  };

  let location: string;
  try {
    location = await resolveImportPath(importSpecifier, resolveOptions);
  } catch (error) {
    if (error.code !== "MODULE_NOT_FOUND") {
      throw error;
    }
    return null;
  }

  return {
    location: preserveSymlinks ? location : await resolveSymlink(location),
    hasModuleSideEffects,
    hasPackageEntry,
    packageBrowserField,
    packageInfo,
  };
}

async function resolveWithExportMap({
  importer,
  importSpecifier,
  exportConditions,
  packageInfoCache,
  extensions,
  mainFields,
  preserveSymlinks,
  useBrowserOverrides,
  baseDir,
  moduleDirectories,
  modulePaths,
  rootDir,
  ignoreSideEffectsForRoot,
  allowExportsFolderMapping,
}) {
  if (importSpecifier.startsWith("#")) {
    // this is a package internal import, resolve using package imports field
    const resolveResult = await resolvePackageImports({
      importSpecifier,
      importer,
      moduleDirs: moduleDirectories,
      conditions: exportConditions,
      resolveId(id /* , parent*/) {
        return resolveIdClassic({
          importSpecifier: id,
          packageInfoCache,
          extensions,
          mainFields,
          preserveSymlinks,
          useBrowserOverrides,
          baseDir,
          moduleDirectories,
          modulePaths,
        });
      },
    });

    const location = fileURLToPath(resolveResult);
    return {
      location: preserveSymlinks ? location : await resolveSymlink(location),
      hasModuleSideEffects: () => null,
      hasPackageEntry: true,
      packageBrowserField: false,
      // eslint-disable-next-line no-undefined
      packageInfo: undefined,
    };
  }

  const pkgName = getPackageName(importSpecifier);
  if (pkgName) {
    // it's a bare import, find the package.json and resolve using package exports if available
    let hasModuleSideEffects = () => null;
    let hasPackageEntry = true;
    let packageBrowserField = false;
    let packageInfo;

    const filter = (pkg, pkgPath) => {
      const info = getPackageInfo({
        cache: packageInfoCache,
        extensions,
        pkg,
        pkgPath,
        mainFields,
        preserveSymlinks,
        useBrowserOverrides,
        rootDir,
        ignoreSideEffectsForRoot,
      });

      ({
        packageInfo,
        hasModuleSideEffects,
        hasPackageEntry,
        packageBrowserField,
      } = info);

      return info.cachedPkg;
    };

    const resolveOptions = {
      basedir: baseDir,
      readFile: readCachedFile,
      isFile: isFileCached,
      isDirectory: isDirCached,
      extensions,
      includeCoreModules: false,
      moduleDirectory: moduleDirectories,
      paths: modulePaths,
      preserveSymlinks,
      packageFilter: filter,
    };

    const result = await getPackageJson(
      importer,
      pkgName,
      resolveOptions,
      moduleDirectories,
    );

    if (result && result.pkgJson.exports) {
      const { pkgJson, pkgJsonPath } = result;
      const subpath =
        pkgName === importSpecifier
          ? "."
          : `.${importSpecifier.substring(pkgName.length)}`;
      const pkgDr = pkgJsonPath.replace("package.json", "");
      const pkgURL = pathToFileURL(pkgDr);

      const context = {
        importer,
        importSpecifier,
        moduleDirs: moduleDirectories,
        pkgURL,
        pkgJsonPath,
        allowExportsFolderMapping,
        conditions: exportConditions,
      };
      const resolvedPackageExport = await resolvePackageExports(
        context,
        subpath,
        pkgJson.exports,
      );
      const location = fileURLToPath(resolvedPackageExport);
      if (location) {
        return {
          location: preserveSymlinks
            ? location
            : await resolveSymlink(location),
          hasModuleSideEffects,
          hasPackageEntry,
          packageBrowserField,
          packageInfo,
        };
      }
    }
  }

  return null;
}

async function resolveWithClassic({
  importer,
  importSpecifierList,
  exportConditions,
  warn,
  packageInfoCache,
  extensions,
  mainFields,
  preserveSymlinks,
  useBrowserOverrides,
  baseDir,
  moduleDirectories,
  modulePaths,
  rootDir,
  ignoreSideEffectsForRoot,
}) {
  for (let i = 0; i < importSpecifierList.length; i++) {
    // eslint-disable-next-line no-await-in-loop
    const result = await resolveIdClassic({
      importer,
      importSpecifier: importSpecifierList[i],
      exportConditions,
      warn,
      packageInfoCache,
      extensions,
      mainFields,
      preserveSymlinks,
      useBrowserOverrides,
      baseDir,
      moduleDirectories,
      modulePaths,
      rootDir,
      ignoreSideEffectsForRoot,
    });

    if (result) {
      return result;
    }
  }

  return null;
}

// Resolves to the module if found or `null`.
// The first import specifier will first be attempted with the exports algorithm.
// If this is unsuccessful because export maps are not being used, then all of `importSpecifierList`
// will be tried with the classic resolution algorithm
export default async function resolveImportSpecifiers({
  importer,
  importSpecifierList,
  exportConditions,
  warn,
  packageInfoCache,
  extensions,
  mainFields,
  preserveSymlinks,
  useBrowserOverrides,
  baseDir,
  moduleDirectories,
  modulePaths,
  rootDir,
  ignoreSideEffectsForRoot,
  allowExportsFolderMapping,
}) {
  try {
    const exportMapRes = await resolveWithExportMap({
      importer,
      importSpecifier: importSpecifierList[0],
      exportConditions,
      packageInfoCache,
      extensions,
      mainFields,
      preserveSymlinks,
      useBrowserOverrides,
      baseDir,
      moduleDirectories,
      modulePaths,
      rootDir,
      ignoreSideEffectsForRoot,
      allowExportsFolderMapping,
    });
    if (exportMapRes) return exportMapRes;
  } catch (error) {
    if (error instanceof ResolveError) {
      warn(error);
      return null;
    }
    throw error;
  }

  // package has no imports or exports, use classic node resolve
  return resolveWithClassic({
    importer,
    importSpecifierList,
    exportConditions,
    warn,
    packageInfoCache,
    extensions,
    mainFields,
    preserveSymlinks,
    useBrowserOverrides,
    baseDir,
    moduleDirectories,
    modulePaths,
    rootDir,
    ignoreSideEffectsForRoot,
  });
}
