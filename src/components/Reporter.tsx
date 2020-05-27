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

const Reporter = ({ duplicates, filesAnalysed, loading }) => {
  if (loading) return <p>Loading...</p>;
  if (typeof filesAnalysed === "undefined") return null;

  const groups =
    duplicates.length === 0 ? (
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

  const duplicateGroups = duplicates.length;
  const duplicateCount = duplicates.flat().length - duplicateGroups;

  return (
    <div className="app-report-node">
      <div>Analysed {filesAnalysed} files</div>
      <div>Found {duplicateCount} duplicate files</div>
      <div>{groups}</div>
    </div>
  );
};

export default Reporter;
