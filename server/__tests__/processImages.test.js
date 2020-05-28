const path = require("path");
const getFilesFromSelection = require("../utils/getFilesFromSelection");
const findDuplicateFolders = require('../utils/findDuplicateFolders');

const filesAnalyser = require("../../lib/index");
const testImagesFolder = path.join(__dirname, "/images");
const projectRoot = path.join(__dirname, "../../../");

const getTestFiles = async () => {
  const fetchers = getFilesFromSelection([testImagesFolder], [".jpg"]);
  const paths = await Promise.all(fetchers);
  return paths.flat();
};

const anonymizeFolders = (str) => {
  return str.split(projectRoot).join("");
};

test("Detect correct amount of images", async () => {
  const files = await getTestFiles();
  expect(files.length).toBe(7);
});

test("Generate a report", async () => {
  const files = await getTestFiles();
  const report = await filesAnalyser(files);
  const expectedReport = [
    [
      "file-organizer/server/__tests__/images/folder_a/bairro_alto-elevador_da_bica.jpg",
      "file-organizer/server/__tests__/images/folder_b/bairro_alto-elevador_da_bica.jpg",
      "file-organizer/server/__tests__/images/folder_b/bairro_alto-elevador_da_bica0.jpg",
    ],
    [
      "file-organizer/server/__tests__/images/folder_a/beach.jpg",
      "file-organizer/server/__tests__/images/folder_b/beach.jpg",
    ],
  ];
  const input = anonymizeFolders(JSON.stringify(report));
  const output = anonymizeFolders(JSON.stringify(expectedReport));
  expect(input).toEqual(output);
});

test("Should get file stats", async () => {
  const testFile = path.join(
    projectRoot,
    "/file-organizer/server/__tests__/images/folder_a/bairro_alto-elevador_da_bica.jpg"
  );
  const getFileStats = require("../../server/routes/getFileStats");
  let response = null;
  await getFileStats(
    { query: { file: testFile } },
    {
      send(data) {
        response = data;
      },
    }
  );

  // remove access timestamps, not relevant to the test...
  ["atime", "atimeMs"].forEach((key) => delete response.stats[key]);

  expect(response).toMatchSnapshot();
});

test("Should compare folders", async () => {
  const files = await getTestFiles();
  const duplicates = await filesAnalyser(files);
  const duplicateFolders = await findDuplicateFolders(duplicates);

  expect(duplicateFolders).toMatchSnapshot();
});
