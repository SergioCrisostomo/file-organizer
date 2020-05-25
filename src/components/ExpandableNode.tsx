import fetchPath from "../utils/fetchPath";
import store, { updateNode } from "../store";
import React from "react";
import { TreeNodeType } from "../reducers/types";
import TreeNode from "./TreeNode";

const ExpandableNode = (props: TreeNodeType) => {
  const dirname = props.path.split("/").pop();

  const onIconClick = async () => {
    const expanded = !props.expanded;
    const nodeDate = await fetchPath(props.path);
    store.dispatch(
      updateNode({
        path: props.path,
        checked: false,
        expanded: expanded,
        subFolders: nodeDate.subFolders.map((str) => ({ path: str })),
        files: nodeDate.files,
      })
    );
  };

  return (
    <div key={props.path} className="app-selection-node">
      <input type="checkbox" />/{dirname}
      <i onClick={onIconClick}>📂</i>
      {props.expanded && TreeNode({ props })}
    </div>
  );
};

export default ExpandableNode;
