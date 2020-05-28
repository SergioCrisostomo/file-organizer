const getFilesFromSelection = require("../utils/getFilesFromSelection");
const filesAnalyser = require("../../lib/index");
const findDuplicateFolders = require('../utils/findDuplicateFolders');


module.exports = (req, res) => {
  console.log("Processing...", req.body);

  const { files, folders } = req.body;
  const promises = getFilesFromSelection([...files, ...folders], [".jpg"]);

  Promise.all(promises)
    .then(async (allFiles) => {
      const matchedFiles = allFiles.flat();
      const duplicates = await filesAnalyser(matchedFiles);
      const duplicateFolders = await findDuplicateFolders(duplicates);
      
      res.send({
        filesAnalysed: matchedFiles.length,
        duplicates,
        duplicateFolders
      });
    })
    .catch((err) => {
      console.log("ERR", err);
      res.send(err);
    });
};
