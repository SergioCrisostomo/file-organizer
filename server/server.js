"use strict";

const express = require("express");
const cors = require("cors");
const folderSelector = require("./routes/folderSelector");
const postSelections = require("./routes/postSelections");
const getFileStats = require("./routes/getFileStats");

const app = express();

app.use(cors());
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.static(__dirname + "/localhost"));
app.use((req, res, next) => {
  console.log(req.originalUrl);
  next();
});

app.get("/folder-selector", folderSelector);
app.get("/file-stats", getFileStats);
app.post("/process-selections", postSelections);

/*
app.post("/organizer", organizer);
*/

app.use(function (err, req, res, next) {
  const status = err.status || 500;
  res.status(status);
  res.send(err);
});

const server = app.listen(process.env.PORT || 8080, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log("App listening at http://%s:%s", host, port);
});
