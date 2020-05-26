const fs = require("fs");
const path = require("path");

module.exports = (req, res) => {
  const selections = req.body;

  res.send(selections);
};
