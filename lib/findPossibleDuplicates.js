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

  if (true || debug) {
    console.log("similarities", JSON.stringify(similarities, null, "  "));
  }

  // score possible duplicates
  const possibleDuplicates = { __maxScore: Object.keys(similarities).length };

  const similarityTypes = Object.keys(similarities);
  similarityTypes.forEach((type) => {
    // name, created, size, etc...
    const group = similarities[type];

    Object.keys(group).forEach((referenceKey) => {
      const indexesInGroup = group[referenceKey];
      const fileNamesInGroup = indexesInGroup.map(
        (index) => groupedData[index].path
      );
      const [a, ...candidates] = fileNamesInGroup;

      for (let candidate of candidates) {
        const matchScore = similarityTypes.reduce((sum, similarityType) => {
          const matches = !!Object.values(similarities[similarityType]).find(
            (group) => {
              return (
                group.includes(indexesInGroup[0]) &&
                group.includes(
                  indexesInGroup[candidates.indexOf(candidate) + 1]
                )
              );
            }
          );

          return sum + (matches ? 1 : 0);
        }, 0);

        if (matchScore > 1) {
          if (!possibleDuplicates[a]) possibleDuplicates[a] = {}; // just to initiate property
          if (!possibleDuplicates[a][matchScore]) {
            // just to initiate property
            possibleDuplicates[a][matchScore] = [a];
          }
          if (!possibleDuplicates[a][matchScore].includes(candidate)) {
            possibleDuplicates[a][matchScore].push(candidate);
          }
        }
      }
    });
  });

  if (debug)
    console.log(
      "possibleDuplicates",
      JSON.stringify(possibleDuplicates, null, "  ")
    );

  return possibleDuplicates;
};
