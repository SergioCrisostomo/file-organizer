const fs = require("fs").promises;
const extractMetaData = require("../../lib/extractMetaData");

module.exports = async (req, res) => {
  const file = req.query.file;
  const stats = await fs.stat(file);
  const metadata = await extractMetaData(file);
  res.send({ stats, metadata });
};
