import fetchPath from "../utils/fetchPath";
import store from "../store";
import React from "react";
import { TreeNodeType } from "../reducers/types";
import TreeNode from "./TreeNode";
import { updateNode } from "../reducers/updateNode";
import { toggleNodeCheck } from "../reducers/toggleNodeCheck";

const ExpandableNode = (props: TreeNodeType) => {

  const path = props.path;
  const checked = Boolean(props.checked);
  const dirname = path.split("/").pop();

  const onIconClick = async () => {
    const expanded = !props.expanded;
    const nodeDate = await fetchPath(path);
    store.dispatch(
      updateNode({
        path,
        checked,
        expanded: expanded,
        subFolders: nodeDate.subFolders.map((str) => ({ path: str, checked })),
        files: nodeDate.files.map((str) => ({ path: str, checked })),
      })
    );
  };

  const onToggle = async () => {
    store.dispatch(toggleNodeCheck(props));
  };

  return (
    <div key={path} className="app-selection-node">
      <fieldset>
        <label htmlFor={path}>/{dirname}</label>
        <input id={path} type="checkbox" checked={checked} onChange={onToggle} />
      </fieldset>

      <i onClick={onIconClick}>📂</i>
      {props.expanded && TreeNode({ props })}
    </div>
  );
};

export default ExpandableNode;
