import React from "react";

const Reporter = ({ duplicates, filesAnalysed, loading }) => {
  if (loading) return <p>Loading...</p>;
  if (typeof filesAnalysed === "undefined") return null;

  const groups =
    duplicates.length === 0 ? (
      <p>No files found!</p>
    ) : (
      duplicates.map((files, i) => {
        const lis = files.map((file) => <li key={file}>{file}</li>);

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
