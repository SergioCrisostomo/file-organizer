import React from "react";

const FileNode = (name) => {
  const fileName = name.split("/").pop();

  return (
    <div key={name} className="app-selection-node">
      <input type="checkbox" />
      {fileName}
    </div>
  );
};


export default FileNode;
