const getFilesFromSelection = require("../utils/getFilesFromSelection");

module.exports = (req, res) => {
  console.log("Processing...", req.body);

  const { files, folders } = req.body;
  const promises = getFilesFromSelection([...files, ...folders], [".jpg"]);

  Promise.all(promises)
    .then((allFiles) => {
      const matchedFiles = allFiles.flat();
      console.log("Found", matchedFiles.length, "files");

      res.send({
        found: matchedFiles.length,
      });
    })
    .catch((err) => {
      console.log("ERR", err);
      res.send(err);
    });
};
