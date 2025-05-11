import { isObject } from "@mc/shared";
import { overwriteFile, readFileIFItExist } from "@mc/shared/fs";
import { join, resolve } from "@zenfs/core/emulation/path.js";

export type Exports<Path extends string = string> =
  | Path
  | {
      import?: Path | Exports;
      require?: Path | Exports;
      // node: Path | Exports;
      browser?: Path | Exports;
      dynamic?: Path | Exports;
      default?: Path | Exports;
      [path: string]: undefined | Path | Exports;
    };

export interface PackageJson {
  name: string;
  main?: string;
  browser?: Exports;
  module?: string;
  exports?: Exports;
  dependencies?: {
    [packageName: string]: string; //Semver;
  };
}
export const getPackageJson = async (base: string): Promise<PackageJson> => {
  const packageJsonPath = join(base, "package.json");

  const packageJsonStr = await readFileIFItExist(packageJsonPath);

  if (!packageJsonStr) throw new Error(`${packageJsonPath} not found`);

  return JSON.parse(packageJsonStr);
};

export const writePackageJson = async (base: string, data: PackageJson) => {
  // return writeFileWithBackupFirst(
  //   join(base, "package.json"),
  //   JSON.stringify(data),
  // );
  return overwriteFile(join(base, "package.json"), JSON.stringify(data));
};

const resolveExports = (exports: Exports) => {
  if (typeof exports === "string") return exports;
  if (isObject(exports.browser)) {
    return resolveExports(exports.browser);
  } else if (isObject(exports.import)) {
    return resolveExports(exports.import);
  } else if (isObject(exports.default)) {
    return resolveExports(exports.default);
  } else {
    throw Error("导出第三方包逻辑没实现");
  }
};

export const resolvePackageEntryPath = (
  id: string,
  moduleName: string,
  { exports, module, main }: Partial<PackageJson>,
): string => {
  if (module) {
    // 存在 module 字段
    return module;
  } else if (exports) {
    // 下面使用递归匹配,防止 `module/a` 匹配到 `{".":{"./a":"..."},"./a":{...}}`, 优先匹配长文本
    const sortedKeys = Object.keys(exports).sort((a, b) => b.length - a.length);
    for (const key of sortedKeys) {
      const value = exports[key];
      // 文件导出
      if (key.startsWith(".")) {
        if (/\*+/.test(key)) {
        }
        /**
         * 解析 id
         * TODO: exports glob 匹配
         */
        const resolvedId = resolve(moduleName, key);
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

/////////////////////////////////////////

/* type Semver<
  Letter extends string =
    | "A"
    | "B"
    | "C"
    | "D"
    | "E"
    | "F"
    | "G"
    | "H"
    | "I"
    | "J"
    | "K"
    | "L"
    | "M"
    | "N"
    | "O"
    | "P"
    | "Q"
    | "R"
    | "S"
    | "T"
    | "U"
    | "V"
    | "W"
    | "X"
    | "Y"
    | "Z"
    | "a"
    | "b"
    | "c"
    | "d"
    | "e"
    | "f"
    | "g"
    | "h"
    | "i"
    | "j"
    | "k"
    | "l"
    | "m"
    | "n"
    | "o"
    | "p"
    | "q"
    | "r"
    | "s"
    | "t"
    | "u"
    | "v"
    | "w"
    | "x"
    | "y"
    | "z",
  Positive_Digit extends string =
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9",
  Digit extends string = "0" | Positive_Digit,
  Digits extends string = Digit | `${Digit}${Digit}`,
  NonDigit extends string = Letter | "-",
  Identifier_Character extends string = Digit | NonDigit,
  Identifier_Characters extends string =
    | Identifier_Character
    | BuildIterativeLiteralType<Identifier_Character, 10>, // 预估 10 个字符
  Numeric_Identifier extends string =
    | "0"
    | Positive_Digit
    | `${Positive_Digit}${Digits}`,
  Alphanumeric_Identifier extends string =
    | NonDigit
    | `${NonDigit}${Identifier_Characters}`
    | `${Identifier_Characters}${NonDigit}`
    | `${Identifier_Characters}${NonDigit}${Identifier_Characters}`,
  Build_Identifier extends string = Alphanumeric_Identifier | Digits,
  PreRelease_Identifier extends string =
    | Alphanumeric_Identifier
    | Numeric_Identifier,
  DotSeparated_Build_Identifiers extends string =
    | Build_Identifier
    | `${Build_Identifier}${StringWithRepeatedChar<`.${Build_Identifier}`, 5>}`, // 预估五次重复
  Build extends string = DotSeparated_Build_Identifiers,
  DotSeparated_PreRelease_Identifiers extends string =
    | PreRelease_Identifier
    | `${PreRelease_Identifier}.${StringWithRepeatedChar<`.${PreRelease_Identifier}`, 5>}`, // 预估五次重复
  PreRelease extends string = DotSeparated_PreRelease_Identifiers,
  Patch extends number = number,
  Minor extends number = number,
  Major extends number = number,
  Version_Core extends string = `${Major}.${Minor}.${Patch}`,
> =
  | Version_Core
  | `${Version_Core}-${PreRelease}`
  | `${Version_Core}+${Build}`
  | `${Version_Core}-${PreRelease}+${Build}`;
 */
