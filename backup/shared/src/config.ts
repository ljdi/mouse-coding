import typescript from '@rollup/plugin-typescript';
import { builtinModules } from "module";
import { defineConfig, Plugin } from "rollup";
import type { PackageJson } from "type-fest";
import { ensureArray, ensureObject } from "./utils";

export const createRollupConfig = (packageJson: PackageJson, external?: (string | RegExp)[] | string | RegExp) => {
  return defineConfig({
    input: "src/index.ts",
    external: [
      ...Object.keys(ensureObject(packageJson.dependencies)),
      ...Object.keys(ensureObject(packageJson.peerDependencies)),
      ...builtinModules,
      ...ensureArray(external??[]).filter((ext): ext is string | RegExp => typeof ext === 'string' || ext instanceof RegExp)
    ],
    onwarn: (warning) => {
      throw Object.assign(new Error(), warning);
    },
    strictDeprecations: true,
    output: [
      {
        format: 'es',
        file: packageJson.module,
        plugins: [emitModulePackageFile()],
        sourcemap: true
      }
    ],
    plugins: [typescript({ sourceMap: true })]
  });
};

export function emitModulePackageFile(): Plugin {
  return {
    name: 'emit-module-package-file',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'package.json',
        source: `{"type":"module"}`
      });
    }
  };
}