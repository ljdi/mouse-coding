import type { Config } from "@swc/wasm-web";

export const defineConfig: (config: Config) => Config = (config) =>
  Object.assign(
    {
      jsc: {
        parser: {
          syntax: "ecmascript",
          jsx: true,
          dynamicImport: false,
          privateMethod: false,
          functionBind: false,
          exportDefaultFrom: false,
          exportNamespaceFrom: false,
          decorators: false,
          decoratorsBeforeExport: false,
          topLevelAwait: false,
          importMeta: false,
          // preserveAllComments: false,
        },
        transform: {
          legacyDecorator: true,
          decoratorMetadata: true,
          react: {
            // pragma: "React.createElement",
            // pragmaFrag: "React.Fragment",
            // throwIfNamespace: true,
            // development: false,
            useBuiltins: true,
            // refresh: true,
            runtime: "automatic",
          },
          optimizer: {
            globals: {
              vars: {
                // __DEBUG__: "true",
              },
            },
          },
        },
        target: "es5",
        loose: false,

        externalHelpers: false,
        // Requires v1.2.50 or upper and requires target to be es2016 or upper.
        keepClassNames: false,
      },
      sourceMaps: true,
    },
    config,
  );
