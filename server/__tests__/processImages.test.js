const path = require("path");
const getFilesFromSelection = require("../utils/getFilesFromSelection");
const filesAnalyser = require("../../lib/index");

const testImagesFolder = path.join(__dirname, "/images");

const getTestFiles = async () => {
  const fetchers = getFilesFromSelection([testImagesFolder], [".jpg"]);
  const paths = await Promise.all(fetchers);
  return paths.flat();
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
      "/Users/sergiocrisostomo/github/file-organizer/server/__tests__/images/folder_a/bairro_alto-elevador_da_bica.jpg",
      "/Users/sergiocrisostomo/github/file-organizer/server/__tests__/images/folder_b/bairro_alto-elevador_da_bica.jpg",
      "/Users/sergiocrisostomo/github/file-organizer/server/__tests__/images/folder_b/bairro_alto-elevador_da_bica0.jpg",
    ],
    [
      "/Users/sergiocrisostomo/github/file-organizer/server/__tests__/images/folder_a/beach.jpg",
      "/Users/sergiocrisostomo/github/file-organizer/server/__tests__/images/folder_b/beach.jpg",
    ],
  ];
  expect(report).toEqual(expectedReport);
});
