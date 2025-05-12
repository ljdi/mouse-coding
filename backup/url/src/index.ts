import { resolve } from "@zenfs/core/emulation/path.js";

export const pathToFileURL = (path: string): URL =>
   new URL(`file://${resolve(path)}`)
;
