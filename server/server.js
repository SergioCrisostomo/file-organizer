"use strict";

const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
/*
const organizer = require("./routes/organizer");
*/
const folderSelector = require("./routes/folderSelector");
const checkFolderExists = require("./routes/checkFolderExists");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/localhost"));
app.use((req, res, next) => {
  console.log(req.originalUrl);
  next();
})

app.post("/check-path", checkFolderExists);
app.get("/folder-selector", folderSelector);

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
