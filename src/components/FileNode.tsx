import React from "react";

const FileNode = (name) => {
  return (
    <div key={name} className="app-selection-node">
      <input type="checkbox" />
      {name}
    </div>
  );
};


export default FileNode;
