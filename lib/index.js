// import fs form 'fs';
// import exif from 'exif-parser';
// import readFolder from './readFolder';

const fs = require("fs");
const exif = require("exif-parser");
const findPossibleDuplicates = require("./findPossibleDuplicates");

function extractMetaData(data) {
  let metadata, error;
  try {
    metaData = exif.create(data).parse();
  } catch (e) {
    error = e;
    metadata = null;
  }
  return {
    metaData,
    error,
  };
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
    fs.readFile(file, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function groupData(path, stats, buffer, metadata) {
  // const string = buffer.toString("utf8");
  return { path, stats, /*string,*/ metadata };
}

async function processFile(file) {
  const verbose = true;

  const stats = await getFileStats(file);
  if (verbose) console.log("Read file stats info...");

  const data = await getFileContent(file);
  if (verbose) console.log("Loaded file content...");

  const { metadata, error } = extractMetaData(data);
  if (error) console.log("Error extracting metadata from ", file);
  if (verbose) console.log("Extracted metadata...");

  const groupedData = groupData(file, stats, data, metadata);

  if (verbose) console.log("Grouped file data...");
  return groupedData;
}

function analyseDuplicates(groupedData) {
  const possibleDuplicates = findPossibleDuplicates(groupedData);
  if (verbose) console.log("Processed duplicates...");

  return possibleDuplicates;
}

module.exports = async (files) => {
  const groupedData = files.map(processFile);
  const report = analyseDuplicates(groupedData);

  return report;
};
