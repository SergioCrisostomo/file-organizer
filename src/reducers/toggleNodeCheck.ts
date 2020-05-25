import store from "../store";

export const toggleNodeCheck = (data) => {
  const state = store.getState();
  const folderTree = { ...state.folderTree };
  const checked = !data.checked;

  const checkFiles = (node) => {
    node.files = (node.files || []).map((file) => ({
      ...file,
      checked,
    }));
  };

  const replaceNode = (root, override) => {
    const subFolders = root.subFolders || [];

    for (let i = 0; i < subFolders.length; i++) {
      const folder = subFolders[i];
      if (override) {
        folder.checked = checked;
        checkFiles(folder);
      } else if (folder.path === data.path) {
        subFolders[i] = { ...data, checked };
        checkFiles(subFolders[i]);
        replaceNode(subFolders[i], true);
      } else {
        replaceNode(folder, false);
      }
    }
  };

  replaceNode(folderTree, false);

  return {
    type: "folderTree",
    payload: folderTree,
  };
};
