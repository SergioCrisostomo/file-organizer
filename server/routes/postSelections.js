const iterator = require("../utils/getFilesRecursively");

const getFilesFromSelection = (arr, types = []) =>
  arr.reduce((promises, entry) => {
    const typesPromises = types.map((type) => iterator(entry, type));
    return [...promises, ...typesPromises];
  }, []);

module.exports = (req, res) => {
  console.log("Processing...", req.body);

  const { files, folders } = req.body;
  const promises = getFilesFromSelection([...files, ...folders], [".jpg"]);


  Promise.all(promises)
    .then((allFiles) => {
      const files = allFiles.flat
      res.send(allFiles.flat())
    })
    .catch((err) => {
      console.log("ERR", err);
      res.send(err);
    });
};
