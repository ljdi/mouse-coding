import { getSwcConfig } from "@/stores/builder-store";
import { getFileExtension } from "@mc/shared/fs";
import { Plugin } from "@rollup/browser";
import { transformSync } from "@swc/wasm-web";

export default function Jsx(): Plugin {
  return {
    name: "jsx",
    async transform(code: string, id: string) {
      if (![".jsx"].includes(getFileExtension(id))) return null;

      const swcConfig = await getSwcConfig();
      return transformSync(code, { ...swcConfig, filename: id });
    },
  };
}
