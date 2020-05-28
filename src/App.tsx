import React from "react";
import store from "./store";

import "./App.css";
import { TreeNodeType } from "./reducers/types";
import TreeNode from "./components/TreeNode";
import postSelections from "./utils/postSelections";
import Reporter from "./components/Reporter";

const appPhases = ["Select", "Analyse", "Process", "Report"];
const [SELECT, ANALYSE, PROCESS, REPORT] = appPhases;

interface Props {}
interface State {
  folderTree: TreeNodeType;
  phase: string;
  phaseButtonActive: boolean;
  report: any;
}

const { getState, subscribe } = store;

const Button = ({ phase, onClick, disabled, type }) => {
  const isActive =
    !disabled &&
    (() => {
      if (type === phase || type === SELECT) return true;

      if (type === ANALYSE) {
        if (phase === SELECT) return true;
      }

      if (type === PROCESS) {
        if (phase === ANALYSE) return true;
      }

      if (type === REPORT) {
        if (phase === PROCESS) return true;
      }

      return false;
    })();

  const onButtonClick = () => onClick(type);
  const classes = ["app-phase-button"];
  if (type === phase) classes.push("app-phase-selected");

  return (
    <button
      type="button"
      className={classes.join(" ")}
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
      report: {},
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

    if (nextPhase === ANALYSE) {
      const selections = this.getSelections();

      const analysisReport = await postSelections(selections);
      this.setState({ phase: ANALYSE, report: analysisReport });
    }

    if (nextPhase === PROCESS) {
      this.setState({ phase: PROCESS })
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
        {this.state.phase === SELECT && (
          <TreeNode props={this.state.folderTree} />
        )}
        {this.state.phase === ANALYSE && (
          <Reporter
            duplicateFolders={this.state.report.duplicateFolders}
            filesAnalysed={this.state.report.filesAnalysed}
            duplicates={this.state.report.duplicates}
            loading={!this.state.phaseButtonActive}
          />
        )}
      </div>
    );
  }
}

export default App;
