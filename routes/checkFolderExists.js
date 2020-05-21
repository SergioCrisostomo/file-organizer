const fs = require("fs");

module.exports = (req, res) => {
  const path = req.body.path;
  res.send(fs.existsSync(path));
};
