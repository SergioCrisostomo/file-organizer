import ExpandableNode from "./ExpandableNode";
import React from "react";
import FileNode from "./FileNode";

const TreeNode = ({ props }) => {
  const getFiles = (props) => {
    const files = props.files || [];
    return files.map(FileNode);
  };

  const getSubFolders = (props) => {
    const subFolders = props.subFolders || [];
    return subFolders.map(ExpandableNode);
  };

  const subfolders = getSubFolders(props);
  const files = getFiles(props);

  return (
    <div className="app-tree-node" key={props.path}>
      <div>{subfolders}</div>
      <div>{files}</div>
    </div>
  );
};

export default TreeNode;
