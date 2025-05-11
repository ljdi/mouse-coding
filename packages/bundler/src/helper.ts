import * as pathInBrowser from "@zenfs/core/emulation/path.js";
import {
  readFile as readFileInBrowser,
  writeFile as writeFileInBrowser,
  exists as existsInBrowser,
} from "@zenfs/core/promises";
import {
  readFile as readFileInNode,
  writeFile as writeFileInNode,
  access as accessInNode,
} from "fs/promises";
import pathInNode from "path";

async function existsInNode(filePath: string) {
  try {
    await accessInNode(filePath);
    return true;
  } catch (e) {
if((e as Error).code ==='ENOENT') return false;
    throw e;
  }
}

export const isInBrowser = typeof window !== "undefined";

export const readFile = isInBrowser ? readFileInBrowser : readFileInNode;
export const writeFile = isInBrowser ? writeFileInBrowser : writeFileInNode;
export const exists = isInBrowser ? existsInBrowser : existsInNode;

export const path = isInBrowser ? pathInBrowser : pathInNode;

export const readFileContent = (filePath: string) =>
  readFile(filePath, "utf-8");
