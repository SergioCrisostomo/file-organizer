const getFilesFromSelection = require("../utils/getFilesFromSelection");
const filesAnalyser = require("../../lib/index");

module.exports = (req, res) => {
  console.log("Processing...", req.body);

  const { files, folders } = req.body;
  const promises = getFilesFromSelection([...files, ...folders], [".jpg"]);

  Promise.all(promises)
    .then(async (allFiles) => {
      const matchedFiles = allFiles.flat();
      const analyseReport = await filesAnalyser(matchedFiles);

      res.send({
        filesAnalysed: matchedFiles.length,
        duplicates: analyseReport
      });
    })
    .catch((err) => {
      console.log("ERR", err);
      res.send(err);
    });
};
