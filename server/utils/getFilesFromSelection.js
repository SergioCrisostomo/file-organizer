const iterator = require("./getFilesRecursively");

const getFilesFromSelection = (arr, types = []) =>
  arr.reduce((promises, entry) => {
    const typesPromises = types.map((type) => iterator(entry, type));
    return [...promises, ...typesPromises];
  }, []);

module.exports = getFilesFromSelection;
