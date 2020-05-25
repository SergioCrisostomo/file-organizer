export const ADD_TREE_NODE = "ADD_TREE_NODE";

export interface File {
  path: string;
  checked: boolean;
}

export interface TreeNodeType {
  path: string;
  checked?: boolean;
  expanded?: boolean;
  subFolders?: TreeNodeType[];
  files?: File[];
}

export interface StoreState {
  subFolders: TreeNodeType[];
}

export interface Action {
  type: string;
  payload: string;
}

// actions
export interface AddTreeNode {
  type: typeof ADD_TREE_NODE;
  payload: TreeNodeType;
}

export type NodeActionTypes = AddTreeNode;

// actions

// update tree
//
