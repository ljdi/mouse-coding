// returns the imported package name for bare module imports
export function getPackageName(id: string) {
  if (id.startsWith(".") || id.startsWith("/")) {
    return null;
  }

  const split = id.split("/");

  // @my-scope/my-package/foo.js -> @my-scope/my-package
  // @my-scope/my-package -> @my-scope/my-package
  if (split[0][0] === "@") {
    return `${split[0]}/${split[1]}`;
  }

  // my-package/foo.js -> my-package
  // my-package -> my-package
  return split[0];
}

export const getPackageSubPath = (id: string) => {
  const split = id.split("/");
  // @my-scope/my-package/foo.js -> foo.js
  // @my-scope/my-package -> ''
  if (split[0][0] === "@") {
    return split.slice(2).join("/");
  }

  // my-package/foo.js -> foo.js
  // my-package -> ''
  return split.slice(1).join("/");
};
