const path = require("path");

/*
 *	If you need to debug, set this to true
 */
const debug = false;

// check if a file pair exists in grouped data fields
function findIndexesInField([a, b], field) {
  for (const entry in field) {
    if (field[entry].includes(a) && field[entry].includes(b)) return 1;
  }
  return 0;
}

// get a score of how may grouped data fields have those marked as duplicates also
function getDuplicateScore(indexPair, similarities) {
  return Object.keys(similarities).reduce((sum, key) => {
    const keyMatched = findIndexesInField(indexPair, similarities[key]);
    return keyMatched + sum;
  }, 0);
}

module.exports = function findPossibleDuplicates(groupedData) {
  const similarities = { name: {}, size: {}, created: {} };

  // group by strong related fields
  for (let i = 0, l = groupedData.length; i < l; i++) {
    const file = groupedData[i];

    // name
    const basename = path.basename(file.path).toLowerCase();
    if (!similarities.name[basename]) similarities.name[basename] = [i];
    else similarities.name[basename].push(i);

    // size
    const size = file.stats.size;
    if (!similarities.size[size]) similarities.size[size] = [i];
    else similarities.size[size].push(i);

    // // dimentions
    // const {width, height} = file.metadata.imageSize;
    // const dimentions = [width, height].join('x');
    // if (!similarities.dimentions[dimentions]) similarities.dimentions[dimentions] = [dimentions];
    // else similarities.dimentions[dimentions].push(dimentions);

    // // extension
    // const extension = path.extname(file.path).toLowerCase();
    // if (!similarities.extension[extension]) similarities.extension[extension] = [extension];
    // else similarities.extension[extension].push(extension);

    // created
    const created = file.metadata && file.metadata.tags.CreateDate;
    if (created) {
      if (!similarities.created[created]) similarities.created[created] = [i];
      else similarities.created[created].push(i);
    }
  }

  // cleanup to debug easyer
  Object.keys(similarities).forEach((k) => {
    const field = similarities[k];
    for (const entry in field) {
      if (field[entry].length < 2) delete similarities[k][entry];
    }
  });

  if (debug)
    console.log("similarities", JSON.stringify(similarities, null, "  "));

  // score possible duplicates
  const possibleDuplicates = { __maxScore: Object.keys(similarities).length };
  Object.keys(similarities).forEach((k) => {
    const group = similarities[k];
    for (const key in group) {
      const files = group[key].slice();
      let a = files.shift();
      let b;
      while ((b = files.shift())) {
        const matchScore = getDuplicateScore([a, b], similarities);
        if (matchScore > 1) {
          if (!possibleDuplicates[a]) possibleDuplicates[a] = {}; // just to initiate property
          if (!possibleDuplicates[a][matchScore])
            possibleDuplicates[a][matchScore] = [a]; // just to initiate property

          if (!possibleDuplicates[a][matchScore].includes(b)) {
            possibleDuplicates[a][matchScore].push(b);
          }
        }
      }
    }
  });

  if (debug)
    console.log(
      "possibleDuplicates",
      JSON.stringify(possibleDuplicates, null, "  ")
    );

  return possibleDuplicates;
};
