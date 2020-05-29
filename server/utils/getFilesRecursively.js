const fs = require("fs").promises;
const nodePath = require("path");

// interface IteratorArguments {
//   (rootPath: string, type: string): Promise<string[]>;
// }

const iterator /*: IteratorArguments*/ = async (rootPath, type = "") => {
  const regex = type ? new RegExp(`\\${type}$`, "i") : "";

  const stat = await fs.lstat(rootPath);
  if (stat.isFile()) {
    if (rootPath.match(regex)) return [rootPath];
    else return [];
  }

  const entriesInDirectory = await fs.readdir(rootPath);
  return await entriesInDirectory.reduce(async (_allFiles, file) => {
    const allFiles = await _allFiles;
    const name = nodePath.join(rootPath, file);
    const stat = await fs.lstat(name);

    if (stat.isDirectory()) {
      const nodeModulesFolder = nodePath.sep + "node_modules" + nodePath.sep;
      if (name.includes(nodeModulesFolder)) {
        return allFiles;
      }

      const nestedFiles = await iterator(name, type);
      allFiles.push(...nestedFiles);
    } else if (file.match(regex)) {
      allFiles.push(name);
    }

    return allFiles;
  }, Promise.resolve([]));
};

module.exports = iterator;
