import { Config as SwcWasmConfig } from "@swc/wasm-web";

export interface Config {
  input: string;
  output: string;
  swc: SwcWasmConfig;
}

export const defineConfig = (config: Config) => {
  return config;
};
