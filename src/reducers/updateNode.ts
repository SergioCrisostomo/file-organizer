import store from "../store";

export const updateNode = (data) => {
  const state = store.getState();
  const folderTree = { ...state.folderTree };

  const replaceNode = (root) => {
    const subFolders = root.subFolders || [];

    for (let i = 0; i < subFolders.length; i++) {
      const folder = subFolders[i];

      if (folder.path === data.path) {
        subFolders[i] = data;
        return;
      } else {
        replaceNode(folder);
      }
    }
  };

  replaceNode(folderTree);

  return {
    type: "folderTree",
    payload: folderTree,
  };
};
