const exif = require("jpeg-exif");

module.exports = function extractMetaData(filePath) {
  return new Promise((res, rej) => {
    exif.parse(filePath, (err, data) => {
      if (err) rej(err);
      else res(data);
    });
  }).catch((err) =>
    console.log("Error extracting metadata from ", filePath, "\n", err, "\n")
  );
};
