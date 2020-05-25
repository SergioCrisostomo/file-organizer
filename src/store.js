import { createStore } from "redux";
import fetchPath from "./utils/fetchPath";

// import { ADD_TREE_NODE, File } from "./reducers/types";


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
    subFolders: data.subFolders.map((str) => ({ path: str, checked: false })),
    files: data.files.map((str) => ({ path: str, checked: false })),
  };
  store.dispatch(folderTreeUpdateAction(rootData));
});

export default store;
