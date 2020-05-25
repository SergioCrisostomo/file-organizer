import React from "react";
import store from "../store";
import { toggleFile } from "../reducers/toggleFile";

const FileNode = ({ path, checked }) => {
  const fileName = path.split("/").pop();

  const onToggle = () => {
    store.dispatch(toggleFile(path, !checked));
  };

  return (
    <div key={path} className="app-selection-node">
      <input type="checkbox" checked={checked} onChange={onToggle} />
      {fileName}
    </div>
  );
};

export default FileNode;
