import { path, readFileContent } from "./helper";

export interface Options {
  input: string;
  output: string;
}
interface DependencyTree {
  path: string;
  code: string;
  dependencies: string[];
}

const parseModuleDependencies = (code: string) => {
  const dependencies: string[] = [];
  const importRegex = /import\s+['"](.+)['"]\s*;/g;
  let match;
  while ((match = importRegex.exec(code)) !== null) {
    dependencies.push(match[1]);
  }
  return dependencies;
};

const buildDependencyTree = async (entryFilePath: string) => {
  const tree: DependencyTree = {
    path: entryFilePath,
    code: await readFileContent(entryFilePath),
    dependencies: [],
  };
  const dependencies = parseModuleDependencies(tree.code);

  const subDepTrees = await Promise.all(
    dependencies.map(async (dep) => {
      const depPath = path.join(path.dirname(entryFilePath), dep);
      return await buildDependencyTree(depPath);
    })
  );
  tree.dependencies.push(...subDepTrees.map((tree) => tree.path));
  return tree;
};

const resolveId = async (id: string, importer: string) => {

}
