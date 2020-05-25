import { createStore } from "redux";
import fetchPath from "./utils/fetchPath";

// import { ADD_TREE_NODE, File } from "./reducers/types";

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

export const folderTreeUpdateAction = (tree) => {
  return {
    type: "folderTree",
    payload: tree,
  };
};

const reducer = (state, action) => {
  const isReduxInternals = action.type.slice(0, 8) === "@@redux/";
  if (!isReduxInternals && !Object.keys(state).includes(action.type)) {
    console.log(action.type, action.payload, " not found in Store keys!");
  }

  return {
    ...state,
    [action.type]: action.payload,
  };
};

const initialState = {
  folderTree: { path: "/", checked: false, subFolders: [], files: [] },
};

const store = createStore(reducer, initialState);

fetchPath("/").then((data) => {
  const rootData = {
    ...initialState.folderTree,
    subFolders: data.subFolders.map((str) => ({ path: str })),
    files: data.files,
  };
  store.dispatch(folderTreeUpdateAction(rootData));
});

export default store;
