const path = require("path");

/*
 *	If you need to debug, set this to true
 */
const debug = false;

const loadFileContents = (obj, groupedData) => {
  const fileIndexes = Object.values(obj)
    .map((group) => Object.values(group))
    .flat(2)
    .filter((el, i, arr) => arr.indexOf(el) === i);

  return Promise.all(
    fileIndexes.map(async (index) => {
      const file = groupedData[index];
      const promise = file.raw();
      return await promise.then((content) => (file.raw = content));
    })
  );
};

module.exports = async function findPossibleDuplicates(groupedData) {
  const similarities = { name: {}, size: {}, created: {} };

  // group by strong related fields
  for (let i = 0, l = groupedData.length; i < l; i++) {
    const file = groupedData[i];

    // file name
    const basename = path.basename(file.path).toLowerCase();
    if (!similarities.name[basename]) similarities.name[basename] = [i];
    else similarities.name[basename].push(i);

    // file size
    const size = file.stats.size;
    if (!similarities.size[size]) similarities.size[size] = [i];
    else similarities.size[size].push(i);

    // created date
    const created = file.metadata && file.metadata.DateTime;
    if (created) {
      if (!similarities.created[created]) similarities.created[created] = [i];
      else similarities.created[created].push(i);
    }
  }

  // cleanup weak ones
  // we could make this be the sensitivity treshhold
  Object.keys(similarities).forEach((type) => {
    const field = similarities[type];
    for (const entry in field) {
      if (field[entry].length < 2) delete similarities[type][entry];
    }
  });

  if (debug) {
    console.log("similarities", JSON.stringify(similarities, null, "  "));
  }

  /*
  Example of similarities:

  {
    name: {
      "bairro_alto-elevador_da_bica.jpg": [0, 2],
      "beach.jpg": [1, 4],
    },
    size: {
      "36771": [1, 4],
      "372781": [0, 2, 3],
    },
    created: {
      "2017:01:24 18:49:24": [0, 2, 3],
    },
  }
  */

  await loadFileContents(similarities, groupedData);

  // reorganise, per file
  const duplicates = {};

  for (let comparisonType of Object.keys(similarities)) {
    const groups = similarities[comparisonType];
    for (let fileIndexes of Object.values(groups)) {
      const [referenceFile, ...otherFiles] = fileIndexes.map(
        (index) => groupedData[index]
      );
      if (!duplicates[referenceFile.path]) {
        duplicates[referenceFile.path] = {};
      }

      for (let candidate of otherFiles) {
        if (!duplicates[referenceFile.path][candidate.path]) {
          const isIdentical = referenceFile.raw === candidate.raw;
          if (isIdentical) {
            duplicates[referenceFile.path][candidate.path] = true;
          }
        }
      }
    }
  }

  // reorganise into arrays
  const report = Object.keys(duplicates)
    .map((filePath) => [filePath, ...Object.keys(duplicates[filePath])])
    .filter((arr) => arr.length > 1);

  if (debug) {
    console.log("Duplicates", JSON.stringify(duplicates, null, "  "));
    console.log("Report", JSON.stringify(report, null, "  "));
  }

  /*
    REPORT EXAMPLE:
    [
      [
        "/Users/sergiocrisostomo/github/file-organizer/server/__tests__/images/folder_a/bairro_alto-elevador_da_bica.jpg",
        "/Users/sergiocrisostomo/github/file-organizer/server/__tests__/images/folder_b/bairro_alto-elevador_da_bica.jpg",
        "/Users/sergiocrisostomo/github/file-organizer/server/__tests__/images/folder_b/bairro_alto-elevador_da_bica0.jpg"
      ],
      [
        "/Users/sergiocrisostomo/github/file-organizer/server/__tests__/images/folder_a/beach.jpg",
        "/Users/sergiocrisostomo/github/file-organizer/server/__tests__/images/folder_b/beach.jpg"
      ]
    ]
   */

  return report;
};
