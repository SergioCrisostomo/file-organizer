// import fs form 'fs';
// import exif from 'exif-parser';
// import readFolder from './readFolder';

const fs = require("fs");
const exif = require("jpeg-exif");

const findPossibleDuplicates = require("./findPossibleDuplicates");

function extractMetaData(filePath) {
  return new Promise((res, rej) => {
    exif.parse(filePath, (err, data) => {
      if (err) rej(err);
      else res(data);
    });
  }).catch((err) =>
    console.log("Error extracting metadata from ", filePath, "\n", err, "\n")
  );
}

function getFileStats(file) {
  return new Promise(function (resolve, reject) {
    fs.stat(file, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function getFileContent(file) {
  return new Promise(function (resolve, reject) {
    fs.readFile(file, "utf8", (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function groupData(path, stats, raw, metadata) {
  return { path, stats, raw, metadata };
}

async function processFile(file) {
  const verbose = false;

  const stats = await getFileStats(file);
  if (verbose) console.log("Read file stats info...");

  const data = await getFileContent(file);
  if (verbose) console.log("Loaded file content...");

  const metadata = await extractMetaData(file);
  if (verbose) console.log("Extracted metadata...");

  const groupedData = groupData(file, stats, data, metadata);

  if (verbose) console.log("Grouped file data...");
  return groupedData;
}

function analyseDuplicates(groupedData) {
  const verbose = false;
  const possibleDuplicates = findPossibleDuplicates(groupedData);
  if (verbose) console.log("Processed duplicates...");

  return possibleDuplicates;
}

module.exports = async (files) => {
  const groupedData = await Promise.all(files.map(processFile));
  const report = analyseDuplicates(groupedData);

  return report;
};

// Report example:

/*
{
  path: '/Users/sergiocrisostomo/github/file-organizer/server/__tests__/images/folder_b/bairro_alto-elevador_da_bica0.jpg',
  stats: Stats {
    dev: 16777220,
    mode: 33188,
    nlink: 1,
    uid: 501,
    gid: 20,
    rdev: 0,
    blksize: 4096,
    ino: 12896680910,
    size: 372781,
    blocks: 736,
    atimeMs: 1590515981977.7903,
    mtimeMs: 1590023840000,
    ctimeMs: 1590221355499.3672,
    birthtimeMs: 1590023840000,
    atime: 2020-05-26T17:59:41.978Z,
    mtime: 2020-05-21T01:17:20.000Z,
    ctime: 2020-05-23T08:09:15.499Z,
    birthtime: 2020-05-21T01:17:20.000Z
  },
  metadata: {
    Make: 'Canon',
    Model: 'Canon EOS 1000D',
    Orientation: 1,
    XResolution: [ 72 ],
    YResolution: [ 72 ],
    ResolutionUnit: 2,
    DateTime: '2017:01:24 18:49:24',
    YCbCrPositioning: 2,
    ExifIFDPointer: 196,
    SubExif: {
      ExposureTime: [Array],
      FNumber: [Array],
      ExposureProgram: 2,
      PhotographicSensitivity: 200,
      ExifVersion: '0221',
      DateTimeOriginal: '2017:01:24 18:49:24',
      DateTimeDigitized: '2017:01:24 18:49:24',
      ComponentsConfiguration: '0x01020300',
      ShutterSpeedValue: 8.375,
      ApertureValue: [Array],
      ExposureBiasValue: 0,
      MeteringMode: 5,
      Flash: 16,
      FocalLength: [Array],
      MakerNote: '0x2000010003002f0000001c04000002',
      UserComment: '0x000000000000000000000000000000',
      SubSecTime: '53',
      SubSecTimeOriginal: '53',
      SubSecTimeDigitized: '53',
      FlashpixVersion: '0x30313030',
      ColorSpace: 1,
      PixelXDimension: 3888,
      PixelYDimension: 2592,
      InteroperabilityIFDPointer: 9478,
      FocalPlaneXResolution: [Array],
      FocalPlaneYResolution: [Array],
      FocalPlaneResolutionUnit: 2,
      CustomRendered: 0,
      ExposureMode: 0,
      WhiteBalance: 0,
      SceneCaptureType: 0
    }
  }
}

*/
