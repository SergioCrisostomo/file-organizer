import React from "react";
import store from "./store";

import "./App.css";
import { TreeNodeType } from "./reducers/types";
import TreeNode from "./components/TreeNode";
import postSelections from "./utils/postSelections";

const appPhases = ['Select', 'Analyse', 'Process', 'Report']
const [SELECT, ANALYSE, PROCESS, REPORT] = appPhases;

interface Props {}
interface State {
  folderTree: TreeNodeType;
  phase: string;
  phaseButtonActive: boolean;
}

const { getState, subscribe } = store;

const Button = ({ phase, onClick, disabled, type }) => {

  const isActive = !disabled && (() => {
    if (type === phase || type === SELECT) return true;
    
    if (type === ANALYSE){
      if (phase === SELECT) return true;
    }

    if (type === PROCESS){
      if (phase === ANALYSE) return true;
    }

    if (type === REPORT){
      if (phase === PROCESS) return true;
    }

    return false;
  })();

  const onButtonClick = () => onClick(type);

  return (
    <button
      className="app-phase-button"
      disabled={!isActive}
      onClick={onButtonClick}
    >
      {type}
    </button>
  );
};

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      folderTree: { path: "/", checked: false, subFolders: [], files: [] },
      phase: SELECT,
      phaseButtonActive: true,
    };
  }

  componentDidMount() {
    subscribe(() => {
      this.setState({
        folderTree: getState().folderTree,
      });
    });
  }

  getSelections() {
    const state = store.getState();
    const folderTree = state.folderTree;
    const extractor = (folder, type) => {
      const rootMatches = (folder[type] || [])
        .reduce((types, entry) => {
          if (entry.checked) return [...types, entry];
          else return types;
        }, [])
        .map(({ path }) => path);

      const subFolderMatches = (folder.subFolders || []).reduce(
        (arr, subFolder) => arr.concat(extractor(subFolder, type)),
        []
      );

      return rootMatches.concat(subFolderMatches);
    };
    return {
      files: extractor(folderTree, "files"),
      folders: extractor(folderTree, "subFolders"),
    };
  }

  async handlePhaseChange(nextPhase) {
    this.setState({ phaseButtonActive: false });
    this.setState({ phase: nextPhase });

    if (nextPhase === "analysing") {
      const selections = this.getSelections();
      console.log("selections", selections);
      const analysisReport = await postSelections(selections);
      this.setState({ phase: "reporting" });
      console.log(analysisReport);
    }

    if (nextPhase === "processing") {
      setTimeout(() => this.setState({ phase: "reporting" }), 2000);
    }

    this.setState({ phaseButtonActive: true });
  }

  render() {
    return (
      <div className="file-organiser-app">
        <header className="app-header">
          <h1>File organizer</h1>
          <Button
            type={SELECT}
            phase={this.state.phase}
            disabled={!this.state.phaseButtonActive}
            onClick={(nextPhase) => this.handlePhaseChange(nextPhase)}
          />
          <Button
            type={ANALYSE}
            phase={this.state.phase}
            disabled={!this.state.phaseButtonActive}
            onClick={(nextPhase) => this.handlePhaseChange(nextPhase)}
          />
          <Button
            type={PROCESS}
            phase={this.state.phase}
            disabled={!this.state.phaseButtonActive}
            onClick={(nextPhase) => this.handlePhaseChange(nextPhase)}
          />

        </header>
        <TreeNode props={this.state.folderTree} />
      </div>
    );
  }
}

export default App;
