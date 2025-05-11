export { realpathSync } from "@zenfs/core";
export { access, readFile } from "@zenfs/core/promises";
import { realpath, stat } from "@zenfs/core/promises";

export { realpath, stat };

export async function fileExists(filePath: string) {
  try {
    const res = await stat(filePath);
    return res.isFile();
  } catch {
    return false;
  }
}

export async function resolveSymlink(path: string) {
  return (await fileExists(path)) ? realpath(path) : path;
}
