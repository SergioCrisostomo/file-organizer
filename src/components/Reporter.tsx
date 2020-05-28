import React from "react";
import "./Reporter.css";

const getFileStats = (file: string): void => {
  fetch("/file-stats?file=" + encodeURIComponent(file))
    .then((res) => res.json())
    .then((res) =>
      console.log(
        ["File stats:", file, JSON.stringify(res, null, 2)].join("\n")
      )
    );
};

const Folders = ({ duplicateFolders }) => {
  console.log(JSON.stringify(duplicateFolders, null, 2));

  const identicalFolders = duplicateFolders
    .filter(({ same }) => same === true)
    .map(({ A, B }) => {
      return (
        <p key={A + B} className="app-report-pairs">
          {A}
          <br />
          {B}
        </p>
      );
    });

  const includeds = duplicateFolders
    .filter(
      ({ same, left, right }) => same !== true && (left === 0 || right === 0)
    )
    .map(({ left, right, A, B }) => {
      if (left === 0) {
        return (
          <p className="app-report-pairs">
            {B} includes {A}
          </p>
        );
      } else if (right === 0) {
        return (
          <p className="app-report-pairs">
            {A} includes {B}
          </p>
        );
      } else {
        console.error("Includes logic is wrong!");
      }
    });

  return (
    <div>
      <h5>Exact duplicates:</h5>
      {identicalFolders}
      <h5>Content is included in other folder</h5>
      {includeds}
    </div>
  );
};

const Files = ({ duplicates }) => {
  return duplicates.length === 0 ? (
    <p>No files found!</p>
  ) : (
    duplicates.map((files, i) => {
      const lis = files.map((file) => (
        <li key={file} onClick={() => getFileStats(file)}>
          {file}
        </li>
      ));

      return <ul key={"report-" + i}>{lis}</ul>;
    })
  );
};

const Reporter = ({ duplicates, filesAnalysed, loading, duplicateFolders }) => {
  if (loading) return <p>Loading...</p>;
  if (typeof filesAnalysed === "undefined") return null;

  const duplicateGroups = duplicates.length;
  const duplicateCount = duplicates.flat().length - duplicateGroups;

  return (
    <div className="app-report-node">
      <div>Analysed {filesAnalysed} files</div>
      <div>Found {duplicateCount} duplicate files</div>
      <h3>Folder analysis:</h3>
      <Folders duplicateFolders={duplicateFolders} />
      <h3>Files analysis</h3>
      <Files duplicates={duplicates} />
    </div>
  );
};

export default Reporter;
