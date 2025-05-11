import { htmlTemplate } from '@/constant/rollup'
import { swcrc } from '@/constant/swc'
import { isClient } from '@mc/shared'
// import rollupPluginBrowserResolve from "@/packages/rollup/browser-resolve";
import rollupPluginCommonJS from '@/packages/rollup/commonjs'
import rollupPluginHtml from '@/packages/rollup/html'
import rollupPluginJsx from '@/packages/rollup/jsx'
import rollupPluginNodeResolve from '@/packages/rollup/node-resolve'
import {
  defineConfig,
  LogLevel,
  OutputAsset,
  OutputOptions,
  rollup,
  RollupLog,
  RollupOptions,
  RollupOutput
} from '@rollup/browser'
import initSwc, {
  Config,
  EsParserConfig,
  parseSync,
  printSync,
  Program,
  transformSync
} from '@swc/wasm-web'
import { createStore } from 'zustand'

const logs: [LogLevel, RollupLog][] = []

export type BuilderState = {
  swcInitialized: boolean;
  swcConfig: Config;

  rollup?: typeof rollup;
  rollupOptionsWithoutInputAndPlugin: RollupOptions;
};

/*
  const bundle = () => {
    rollup({
      input: "main.js",
      plugins: [
        {
          name: "loader",
          resolveId(source) {
            if (modules.hasOwnProperty(source)) {
              return source;
            }
          },
          load(id) {
            if (modules.hasOwnProperty(id)) {
              return modules[id as keyof typeof modules];
            }
          },
        },
      ],
    })
      .then((bundle) => {
        console.log(bundle);
        return bundle.generate({ format: "es" });
      })
      .then(({ output }) => {
        console.log(output[0].code);
      });
  };
*/

export type BuilderActions = {
  parseSync: (code: string) => ReturnType<typeof parseSync>;
  printSync: (filename: string, ast: Program) => ReturnType<typeof printSync>;
  transformSync: (
    filename: string,
    code: string,
  ) => ReturnType<typeof transformSync>;

  build: (input: string | string[]) => Promise<string>;
};

export type BuilderStore = BuilderState & BuilderActions;

export const defaultInitState: BuilderState = {
  swcInitialized: false,
  swcConfig: swcrc,

  // rollup,
  rollupOptionsWithoutInputAndPlugin: {
    onLog (level, log) {
      logs.push([level, log])
      console.log(level, log)
    },
    output: {
      format: 'es',
      freeze: true,
      inlineDynamicImports: true
    },
    treeshake: true
  }
}

export const initBuilderState = async (): Promise<
  Pick<BuilderState, 'swcInitialized'>
> => {
  if (!isClient()) return defaultInitState

  await initSwc()

  return { swcInitialized: true }
}

const store = createStore<BuilderStore>((_setState, getState) => ({
  ...defaultInitState,

  parseSync: (code) => {
    const { swcConfig } = getState()
    return parseSync(code, {
      ...(swcConfig!.jsc!.parser as EsParserConfig),
      target: swcConfig!.jsc!.target
    })
  },
  printSync: (filename, ast) => {
    const { swcConfig } = getState()
    return printSync(ast, { ...swcConfig, filename })
  },
  transformSync: (filename, code) => {
    const { swcConfig } = getState()
    return transformSync(code, { ...swcConfig, filename })
  },
  build: async (input) => {
    // const { projectPath } = projectStore.getState();

    const config = defineConfig({
      ...getState().rollupOptionsWithoutInputAndPlugin,
      input,
      plugins: [
        /* rollupPluginBrowserResolve({
          rootDir: projectPath,
        }), */
        rollupPluginNodeResolve({}),
        rollupPluginCommonJS({ strictRequires: 'debug' }),
        rollupPluginJsx(),
        rollupPluginHtml({ template: htmlTemplate })
      ]
    })

    const bundle = await rollup(config)

    console.log('%crollup:', 'font-weight: bold; color: green', bundle)

    let output: RollupOutput | undefined

    try {
      output = await bundle?.generate((config.output as OutputOptions) || {})
    } catch (error) {
      console.warn(error)
    } finally {
      if (bundle) bundle.close()
    }

    console.log('%coutput:', 'font-weight: bold; color: green', output)

    const outputAsset = output?.output?.findLast(
      ({ fileName }) => fileName === 'index.html'
    ) as OutputAsset
    return outputAsset?.source as string
  }
}))

initBuilderState().then(store.setState)

export default store

export const getSwcConfig = () => {
  return new Promise<Config>((resolve) => {
    const { swcInitialized, swcConfig } = store.getState()
    if (swcInitialized) {
      return resolve(swcConfig!)
    }

    const unsubscribe = store.subscribe((state) => {
      if (state.swcInitialized) {
        resolve(state.swcConfig)
        unsubscribe()
      }
    })
  })
}
