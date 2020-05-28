const fs = require("fs").promises;
const path = require("path");
const dircompare = require("dir-compare");

const dirCompareOptions = {
  compareSize: true,
  compareContent: true,
  ignoreCase: true,
  noDiffSet: true,
};

function findDuplicateFolders(duplicates) {

  console.log('DUPS', duplicates);
  // check if they are similar but also if A contains B || B contains A

  const checks = duplicates.map(async (files) => {
    const uniqueFolders = files
      .map((file) => path.dirname(file))
      .filter((el, i, arr) => arr.indexOf(el) === i);

    const combinationsOfPairs = uniqueFolders
      .map((referenceFolder, i, arr) => {
        const combinations = [];
        for (let j = i + 1; j < arr.length; j++) {
          const promise = dircompare
            .compare(referenceFolder, arr[j], dirCompareOptions)
            .then((res) => ({
              ...res,
              A: referenceFolder,
              B: arr[j],
            }));
          combinations.push(promise);
        }
        return combinations;
      })
      .flat();
    return Promise.all(combinationsOfPairs);
  });

  return Promise.all(checks)
    .then((res) => res.flat())
    .then(arr => arr.filter((obj, i, all) => {
      // remove duplicate results
      const match = arr.find(({A, B}) => A === obj.A && B === obj.B);
      return all.indexOf(match) === i;
    }))
    .catch((err) => console.log("Directory comparison failed with ", err));
}

module.exports = findDuplicateFolders;
