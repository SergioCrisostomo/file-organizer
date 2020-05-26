import React from "react";
import store from "./store";

import "./App.css";
import { TreeNodeType } from "./reducers/types";
import TreeNode from "./components/TreeNode";
import postSelections from "./utils/postSelections";

interface Props {}
interface State {
  folderTree: TreeNodeType;
  phase: string;
  phaseButtonActive: boolean;
}

const { getState, subscribe } = store;

const Button = ({ phase, onClick, disabled }) => {
  const text = (() => {
    if (phase === "selecting") return "Analyse";
    if (phase === "analysing") return "Process";
    if (phase === "processing") return "Processing...";
    if (phase === "reporting") return "Start over";
  })();

  const possiblePhases = ["selecting", "analysing", "processing", "reporting"];
  const index =
    (possiblePhases.length + possiblePhases.indexOf(phase) + 1) %
    possiblePhases.length;
  const nextPhase = possiblePhases[index];

  const onButtonClick = () => onClick(nextPhase);

  return (
    <button
      className="app-phase-button"
      disabled={disabled}
      onClick={onButtonClick}
    >
      {text}
    </button>
  );
};

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      folderTree: { path: "/", checked: false, subFolders: [], files: [] },
      phase: "selecting", // can be selecting|analysing|processing|reporting
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
      const rootMatches = (folder[type] || []).reduce((types, entry) => {
        if (entry.checked) return [...types, entry];
        else return types;
      }, []).map(({ path }) => path);

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
