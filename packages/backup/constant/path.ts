import { join } from "@zenfs/core/emulation/path.js";

export const TMP_PATH = "/tmp";
export const STORE_PATH = "/.store";
export const STORE_CACHE_DIRECTORY_PATH = join(STORE_PATH, "cache");
export const REGISTRY_FILE_NAME = "registry.json";
export const MODULES_DIR_NAME = "node_modules";
export const PACKAGE_JSON_FILE_NAME = "package.json";
export const CAS_NAME = ".mcpm";
export const MODULES_FILE_NAME = ".modules.json";
export const CAS_MODULES_SYMLINKS_PROPERTY_NAME = "symlinks";

export const HOME = "/root";
