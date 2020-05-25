import React from "react";
import store from "./store";

import "./App.css";
import { TreeNodeType } from "./reducers/types";
import TreeNode from "./components/TreeNode";

interface Props {}
interface State {
  folderTree: TreeNodeType;
}

const { getState, subscribe } = store;

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      folderTree: { path: "/", checked: false, subFolders: [], files: [] },
    };
  }

  componentDidMount() {
    subscribe(() => {
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
