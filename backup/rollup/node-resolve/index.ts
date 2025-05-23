import {
  CustomPluginOptions,
  Plugin,
  PluginContext,
  RollupOptions,
} from "@rollup/browser";
import deepMerge from "deepmerge";
import isCoreModule from "is-core-module";
import isModule from "is-module";
import { dirname, normalize, resolve, sep } from "path";
import { isDirCached, isFileCached, readCachedFile } from "./cache";
import handleDeprecatedOptions from "./deprecated-options";
import { fileExists, readFile, realpath } from "./fs";
import resolveImportSpecifiers from "./resolveImportSpecifiers";
import { getMainFields, getPackageName, normalizeInput } from "./util";

const ES6_BROWSER_EMPTY = "\0node-resolve:empty.js";
const deepFreeze = (object: object) => {
  Object.freeze(object);

  for (const value of Object.values(object)) {
    if (typeof value === "object" && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  }

  return object;
};

const baseConditions = ["default", "module"];
const baseConditionsEsm = [...baseConditions, "import"];
const baseConditionsCjs = [...baseConditions, "require"];
const defaults = {
  dedupe: [],
  // It's important that .mjs is listed before .js so that Rollup will interpret npm modules
  // which deploy both ESM .mjs and CommonJS .js files as ESM.
  extensions: [".mjs", ".js", ".json", ".node"],
  resolveOnly: [],
  moduleDirectories: ["node_modules"],
  modulePaths: [],
  ignoreSideEffectsForRoot: false,
  // TODO: set to false in next major release or remove
  allowExportsFolderMapping: true,
};

export const DEFAULTS = deepFreeze(deepMerge({}, defaults));

export interface Options {
  exportConditions?: string[]; // []
  browser?: boolean; // false
  moduleDirectories?: string[];
  modulePaths?: string[];
  dedupe?: string[];
  extensions?: string[];
  jail?: string; // '/'
  mainFields?: string[]; // ['module', 'main']. Valid values: ['browser', 'module', 'main']
  preferBuiltins?: boolean | ((module: string) => boolean); // true
  modulesOnly?: boolean; // false
  resolveOnly?: (string | RegExp)[] | ((module: string) => boolean);
  rootDir?: string; // process.cwd()
  ignoreSideEffectsForRoot?: boolean;
  allowExportsFolderMapping?: boolean;
}

export default function nodeResolve(opts = {}): Plugin {
  const { warnings } = handleDeprecatedOptions(opts);

  const options: Options & Required<Pick<Options, keyof typeof defaults>> = {
    ...defaults,
    ...opts,
  };
  const {
    extensions,
    jail,
    moduleDirectories,
    modulePaths,
    ignoreSideEffectsForRoot,
  } = options;
  const conditionsEsm = [
    ...baseConditionsEsm,
    ...(options.exportConditions || []),
  ];
  const conditionsCjs = [
    ...baseConditionsCjs,
    ...(options.exportConditions || []),
  ];
  const packageInfoCache = new Map();
  const idToPackageInfo = new Map();
  const mainFields = getMainFields(options);
  const useBrowserOverrides = mainFields.indexOf("browser") !== -1;
  const isPreferBuiltinsSet = Object.prototype.hasOwnProperty.call(
    options,
    "preferBuiltins",
  );
  const preferBuiltins = isPreferBuiltinsSet ? options.preferBuiltins : true;
  const rootDir = resolve(options.rootDir || process.cwd());
  let {
    dedupe,
  }: { dedupe: Options["dedupe"] | ((importee: string) => boolean) } = options;
  let rollupOptions: RollupOptions;

  if (moduleDirectories.some((name) => name.includes("/"))) {
    throw new Error(
      "`moduleDirectories` option must only contain directory names. If you want to load modules from somewhere not supported by the default module resolution algorithm, see `modulePaths`.",
    );
  }

  if (typeof dedupe !== "function") {
    dedupe = (importee: string) =>
      options.dedupe.includes(importee) ||
      options.dedupe.includes(getPackageName(importee));
  }

  // creates a function from the patterns to test if a particular module should be bundled.
  const allowPatterns = (patterns: (string | RegExp)[]) => {
    const regexPatterns = patterns.map((pattern) => {
      if (pattern instanceof RegExp) {
        return pattern;
      }
      const normalized = pattern.replace(/[\\^$*+?.()|[\]{}]/g, "\\$&");
      return new RegExp(`^${normalized}$`);
    });
    return (id: string) =>
      !regexPatterns.length ||
      regexPatterns.some((pattern) => pattern.test(id));
  };

  const resolveOnly =
    typeof options.resolveOnly === "function"
      ? options.resolveOnly
      : allowPatterns(options.resolveOnly);

  const browserMapCache = new Map();
  let preserveSymlinks: boolean;

  const resolveLikeNode = async (
    context: PluginContext,
    importee: string,
    importer: string | undefined,
    custom: CustomPluginOptions,
  ): Promise<{ id: string } | null | false> => {
    // strip query params from import
    const [importPath, params] = importee.split("?");
    const importSuffix = `${params ? `?${params}` : ""}`;
    importee = importPath;

    const baseDir = !importer || dedupe(importee) ? rootDir : dirname(importer);

    // https://github.com/defunctzombie/package-browser-field-spec
    const browser = browserMapCache.get(importer);
    if (useBrowserOverrides && browser) {
      const resolvedImportee = resolve(baseDir, importee);
      if (browser[importee] === false || browser[resolvedImportee] === false) {
        return { id: ES6_BROWSER_EMPTY };
      }
      const browserImportee =
        (importee[0] !== "." && browser[importee]) ||
        browser[resolvedImportee] ||
        browser[`${resolvedImportee}.js`] ||
        browser[`${resolvedImportee}.json`];
      if (browserImportee) {
        importee = browserImportee;
      }
    }

    const parts = importee.split(/[/\\]/);
    let id = parts.shift();
    let isRelativeImport = false;

    if (id?.[0] === "@" && parts.length > 0) {
      // scoped packages
      id += `/${parts.shift()}`;
    } else if (id?.[0] === ".") {
      // an import relative to the parent dir of the importer
      id = resolve(baseDir, importee);
      isRelativeImport = true;
    }

    // if it's not a relative import, and it's not requested, reject it.
    if (!isRelativeImport && id && !resolveOnly(id)) {
      if (normalizeInput(rollupOptions.input).includes(importee)) {
        return null;
      }
      return false;
    }

    const importSpecifierList = [importee];

    if (importer === undefined && !importee[0].match(/^\.?\.?\//)) {
      // For module graph roots (i.e. when importer is undefined), we
      // need to handle 'path fragments` like `foo/bar` that are commonly
      // found in rollup config files. If importee doesn't look like a
      // relative or absolute path, we make it relative and attempt to
      // resolve it.
      importSpecifierList.push(`./${importee}`);
    }

    // TypeScript files may import '.mjs' or '.cjs' to refer to either '.mts' or '.cts'.
    // They may also import .js to refer to either .ts or .tsx, and .jsx to refer to .tsx.
    if (importer && /\.(ts|mts|cts|tsx)$/.test(importer)) {
      for (const [importeeExt, resolvedExt] of [
        [".js", ".ts"],
        [".js", ".tsx"],
        [".jsx", ".tsx"],
        [".mjs", ".mts"],
        [".cjs", ".cts"],
      ]) {
        if (
          importee.endsWith(importeeExt) &&
          extensions.includes(resolvedExt)
        ) {
          importSpecifierList.push(
            importee.slice(0, -importeeExt.length) + resolvedExt,
          );
        }
      }
    }

    const { warn } = context;
    const isRequire =
      custom && custom["node-resolve"] && custom["node-resolve"].isRequire;
    const exportConditions = isRequire ? conditionsCjs : conditionsEsm;

    if (useBrowserOverrides && !exportConditions.includes("browser"))
      exportConditions.push("browser");

    const resolvedWithoutBuiltins = await resolveImportSpecifiers({
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
      allowExportsFolderMapping: options.allowExportsFolderMapping,
    });

    const importeeIsBuiltin = isCoreModule(importee);
    const preferImporteeIsBuiltin =
      typeof preferBuiltins === "function"
        ? preferBuiltins(importee)
        : preferBuiltins;
    const resolved =
      importeeIsBuiltin && preferImporteeIsBuiltin
        ? {
            packageInfo: undefined,
            hasModuleSideEffects: () => null,
            hasPackageEntry: true,
            packageBrowserField: false,
          }
        : resolvedWithoutBuiltins;
    if (!resolved) {
      return null;
    }

    const {
      packageInfo,
      hasModuleSideEffects,
      hasPackageEntry,
      packageBrowserField,
    } = resolved;
    let { location } =
      "location" in resolved ? resolved : {};
    if (packageBrowserField) {
      if (
        location &&
        Object.prototype.hasOwnProperty.call(packageBrowserField, location)
      ) {
        if (!packageBrowserField[location]) {
          browserMapCache.set(location, packageBrowserField);
          return { id: ES6_BROWSER_EMPTY };
        }
        location = packageBrowserField[location];
      }
      browserMapCache.set(location, packageBrowserField);
    }

    if (hasPackageEntry && !preserveSymlinks) {
      const exists = await fileExists(location);
      if (exists) {
        location = await realpath(location);
      }
    }

    idToPackageInfo.set(location, packageInfo);

    if (hasPackageEntry) {
      if (importeeIsBuiltin && preferImporteeIsBuiltin) {
        if (
          !isPreferBuiltinsSet &&
          resolvedWithoutBuiltins &&
          resolved !== importee
        ) {
          context.warn({
            message:
              `preferring built-in module '${importee}' over local alternative at '${resolvedWithoutBuiltins.location}', pass 'preferBuiltins: false' to disable this behavior or 'preferBuiltins: true' to disable this warning.` +
              `or passing a function to 'preferBuiltins' to provide more fine-grained control over which built-in modules to prefer.`,
            pluginCode: "PREFER_BUILTINS",
          });
        }
        return false;
      } else if (jail && location.indexOf(normalize(jail.trim(sep))) !== 0) {
        return null;
      }
    }

    if (options.modulesOnly && (await fileExists(location))) {
      const code = await readFile(location, "utf-8");
      if (isModule(code)) {
        return {
          id: `${location}${importSuffix}`,
          moduleSideEffects: hasModuleSideEffects(location),
        };
      }
      return null;
    }
    return {
      id: `${location}${importSuffix}`,
      moduleSideEffects: hasModuleSideEffects(location),
    };
  };

  return {
    name: "node-resolve",

    buildStart(buildOptions) {
      rollupOptions = buildOptions;

      for (const warning of warnings) {
        this.warn(warning);
      }

      ({ preserveSymlinks } = buildOptions);
    },

    generateBundle() {
      readCachedFile.clear();
      isFileCached.clear();
      isDirCached.clear();
    },

    resolveId: {
      order: "post",
      async handler(importee, importer, resolveOptions) {
        if (importee === ES6_BROWSER_EMPTY) {
          return importee;
        }
        // ignore IDs with null character, these belong to other plugins
        if (/\0/.test(importee)) return null;

        const { custom = {} } = resolveOptions;
        const { "node-resolve": { resolved: alreadyResolved } = {} } = custom;
        if (alreadyResolved) {
          return alreadyResolved;
        }

        if (/\0/.test(importer)) {
          importer = undefined;
        }

        const resolved = await resolveLikeNode(
          this,
          importee,
          importer,
          custom,
        );
        if (resolved) {
          // This way, plugins may attach additional meta information to the
          // resolved id or make it external. We do not skip node-resolve here
          // because another plugin might again use `this.resolve` in its
          // `resolveId` hook, in which case we want to add the correct
          // `moduleSideEffects` information.
          const resolvedResolved = await this.resolve(resolved.id, importer, {
            ...resolveOptions,
            skipSelf: false,
            custom: {
              ...custom,
              "node-resolve": { ...custom["node-resolve"], resolved, importee },
            },
          });
          if (resolvedResolved) {
            // Handle plugins that manually make the result external
            if (resolvedResolved.external) {
              return false;
            }
            // Allow other plugins to take over resolution. Rollup core will not
            // change the id if it corresponds to an existing file
            if (resolvedResolved.id !== resolved.id) {
              return resolvedResolved;
            }
            // Pass on meta information added by other plugins
            return { ...resolved, meta: resolvedResolved.meta };
          }
        }
        return resolved;
      },
    },

    load(importee) {
      if (importee === ES6_BROWSER_EMPTY) {
        return "export default {};";
      }
      return null;
    },

    getPackageInfoForId(id) {
      return idToPackageInfo.get(id);
    },
  };
}
