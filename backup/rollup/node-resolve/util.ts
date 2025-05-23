import { PackageJson } from "@/packages/mcpm/packageJson";
import { createFilter } from "@/packages/rollup/pluginutils";
import { dirname, extname, resolve } from "@zenfs/core/emulation/path.js";
import { Options } from ".";
import { realpathSync } from "./fs";

// returns the imported package name for bare module imports
export function getPackageName(id: string) {
  if (id.startsWith(".") || id.startsWith("/")) {
    return "";
  }

  const split = id.split("/");

  // @my-scope/my-package/foo.js -> @my-scope/my-package
  // @my-scope/my-package -> @my-scope/my-package
  if (split[0][0] === "@") {
    return `${split[0]}/${split[1]}`;
  }

  // my-package/foo.js -> my-package
  // my-package -> my-package
  return split[0];
}

export function getMainFields(options: Options) {
  let mainFields: string[];
  if (options.mainFields) {
    ({ mainFields } = options);
  } else {
    mainFields = ["module", "main"];
  }
  if (options.browser && mainFields.indexOf("browser") === -1) {
    return ["browser"].concat(mainFields);
  }
  if (!mainFields.length) {
    throw new Error(
      "Please ensure at least one `mainFields` value is specified",
    );
  }
  return mainFields;
}

export function getPackageInfo(options: {
  cache: Map<string, unknown>;
  extensions: string[];
  pkg: PackageJson;
  pkgPath: string;
  mainFields: string[];
  preserveSymlinks: boolean;
  useBrowserOverrides: boolean;
  rootDir: string;
  ignoreSideEffectsForRoot: boolean;
}) {
  const {
    cache,
    extensions,
    pkg,
    mainFields,
    preserveSymlinks,
    useBrowserOverrides,
    rootDir,
    ignoreSideEffectsForRoot,
  } = options;
  let { pkgPath } = options;

  if (cache.has(pkgPath)) {
    return cache.get(pkgPath);
  }

  // browserify/resolve doesn't realpath paths returned in its packageFilter callback
  if (!preserveSymlinks) {
    pkgPath = realpathSync(pkgPath);
  }

  const pkgRoot = dirname(pkgPath);

  const packageInfo = {
    // copy as we are about to munge the `main` field of `pkg`.
    packageJson: { ...pkg },

    // path to package.json file
    packageJsonPath: pkgPath,

    // directory containing the package.json
    root: pkgRoot,

    // which main field was used during resolution of this module (main, module, or browser)
    resolvedMainField: "main",

    // whether the browser map was used to resolve the entry point to this module
    browserMappedMain: false,

    // the entry point of the module with respect to the selected main field and any
    // relevant browser mappings.
    resolvedEntryPoint: "",
  };

  let overriddenMain = false;
  for (let i = 0; i < mainFields.length; i++) {
    const field = mainFields[i];
    if (typeof pkg[field as keyof typeof pkg] === "string") {
      pkg.main = pkg[field as keyof typeof pkg] as string;
      packageInfo.resolvedMainField = field;
      overriddenMain = true;
      break;
    }
  }

  const internalPackageInfo = {
    cachedPkg: pkg,
    hasModuleSideEffects: () => null,
    hasPackageEntry:
      overriddenMain !== false || mainFields.indexOf("main") !== -1,
    packageBrowserField:
      useBrowserOverrides &&
      typeof pkg.browser === "object" &&
      Object.keys(pkg.browser).reduce(
        (browser, key) => {
          let resolved = pkg.browser[key];
          if (resolved && resolved[0] === ".") {
            resolved = resolve(pkgRoot, resolved);
          }
          /* eslint-disable no-param-reassign */
          browser[key] = resolved;
          if (key[0] === ".") {
            const absoluteKey = resolve(pkgRoot, key);
            browser[absoluteKey] = resolved;
            if (!extname(key)) {
              extensions.reduce((subBrowser, ext) => {
                subBrowser[absoluteKey + ext] = subBrowser[key];
                return subBrowser;
              }, browser);
            }
          }
          return browser;
        },
        {} as Record<string, string>,
      ),
    packageInfo,
  };

  const browserMap = internalPackageInfo.packageBrowserField;
  if (
    useBrowserOverrides &&
    typeof pkg.browser === "object" &&
    // eslint-disable-next-line no-prototype-builtins
    browserMap.hasOwnProperty(pkg.main)
  ) {
    packageInfo.resolvedEntryPoint = browserMap[pkg.main];
    packageInfo.browserMappedMain = true;
  } else {
    // index.node is technically a valid default entrypoint as well...
    packageInfo.resolvedEntryPoint = resolve(pkgRoot, pkg.main || "index.js");
    packageInfo.browserMappedMain = false;
  }

  if (!ignoreSideEffectsForRoot || rootDir !== pkgRoot) {
    const packageSideEffects = pkg.sideEffects;
    if (typeof packageSideEffects === "boolean") {
      internalPackageInfo.hasModuleSideEffects = () => packageSideEffects;
    } else if (Array.isArray(packageSideEffects)) {
      const finalPackageSideEffects = packageSideEffects.map((sideEffect) => {
        /*
         * The array accepts simple glob patterns to the relevant files... Patterns like .css, which do not include a /, will be treated like **\/.css.
         * https://webpack.js.org/guides/tree-shaking/
         */
        if (sideEffect.includes("/")) {
          return sideEffect;
        }
        return `**/${sideEffect}`;
      });
      internalPackageInfo.hasModuleSideEffects = createFilter(
        finalPackageSideEffects,
        null,
        {
          resolve: pkgRoot,
        },
      );
    }
  }

  cache.set(pkgPath, internalPackageInfo);
  return internalPackageInfo;
}

export function normalizeInput(input) {
  if (Array.isArray(input)) {
    return input;
  } else if (typeof input === "object") {
    return Object.values(input);
  }

  // otherwise it's a string
  return [input];
}
