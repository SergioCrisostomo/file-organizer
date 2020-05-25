import React from "react";
import store, { updateNode } from "./store";

import "./App.css";
import { TreeNodeType } from "./reducers/types";
import fetchPath from "./utils/fetchPath";

interface Props {}
interface State {
  folderTree: TreeNodeType;
}

const { getState, subscribe } = store;

const FileNode = (name) => {
  return (
    <div key={name} className="app-selection-node">
      <input type="checkbox" />
      {name}
    </div>
  );
};

const ExpandableNode = (props) => {
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
      <input type="checkbox" />
      /{dirname}
      <i onClick={onIconClick}>📂</i>
      {props.expanded && TreeNode({ props })}
    </div>
  );
};

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

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      folderTree: { path: "/", checked: false, subFolders: [], files: [] },
    };
  }

  componentDidMount() {
    subscribe(() => {
      console.log("Subscriber called");
      this.setState({
        folderTree: getState().folderTree,
      });
    });
  }

  render() {
    return (
      <div className="file-organiser-app">
        <header className="app-header">
          <h1>File organizer</h1>
        </header>
        <TreeNode props={this.state.folderTree} />
      </div>
    );
  }
}

export default App;
