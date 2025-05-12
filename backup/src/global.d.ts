declare module "*.swcrc" {
  import { Config } from "@swc/wasm-web";
  const value: Config;
  export default value;
}
