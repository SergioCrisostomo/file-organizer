import store from "../store";
import { updateNode } from "./updateNode";
import arrayOf from "../utils/arrayOf";

const findFileNode = (root, path) => {

  const nodeHasFile = (root.files || []).find((file) => file.path === path);
  if (nodeHasFile) return root;

  for (let folder of arrayOf(root.subFolders)) {
    const match = findFileNode(folder, path);
    if (match) return match;
  }
};

export const toggleFile = (path, checked) => {
  const state = store.getState();

  const node = findFileNode(state.folderTree, path);

  const newNodeValue = {
    ...node,
    files: node.files.map((file) => {
      if (file.path !== path) return file;
      return {
        ...file,
        checked: checked,
      };
    }),
  };

  return updateNode(newNodeValue);
};
