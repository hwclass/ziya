// Core
import React, { Component } from 'react';

// Helpers
import getFileContent from '../utils/getFileContent';
import getDirectoryContent from '../utils/getDirectoryContent';
import getKeyCode from '../utils/getKeyCode';
import overrideKeyDownEvent from '../utils/overrideKeyDownEvent';
import saveFile from '../utils/saveFile';

// UI
import './App.css';
import Sidebar from './Sidebar';
import Content from './Content';

// Constants
import FILE_TYPES from '../constants/fileTypes';

class App extends Component {
  constructor() {
    super();
    this.state = {
      files: [],
      selectedName: '',
      content: '',
    };

    this.handleItemClick = this.handleItemClick.bind(this);
    this.updateCode = this.updateCode.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.buildEditorOptions = this.buildEditorOptions.bind(this);
    this.getParentDirectoryContent = this.getParentDirectoryContent.bind(this);
  }

  componentDidMount() {
    overrideKeyDownEvent();
    this.getParentDirectoryContent();
  }

  async getParentDirectoryContent() {
    const content = await getDirectoryContent();
    this.setState({ files: content });
  }

  async handleItemClick(item) {
    const { files } = this.state;
    const { name, type } = item;

    if (type === 'directory') {
      const dirContent = await getDirectoryContent(name);

      const updatedFiles = files.map(file => file.name === name ? ({
        ...file,
        children: dirContent,
      }) : file);

      this.setState({
        files: updatedFiles
      });
    } else {
      const fileContent = await getFileContent(name, type);

      this.setState({
        selectedName: name,
        content: fileContent
      });
    }
  }

  updateCode(newCode) {
    this.setState({
      content: newCode
    });
  }

  handleKeyDown(event) {
    const charCode = getKeyCode(event);

    if (event.metaKey && charCode === 's' && (navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey)) {
      const { selectedName, content } = this.state;
      saveFile(selectedName, content);
    }
  }

  getExtension(fileName) {
    const splittedName = fileName.split('.');
    return splittedName[splittedName.length - 1];
  }

  buildEditorOptions() {
    const extension = this.getExtension(this.state.selectedName);
    const fileType = FILE_TYPES[extension];

    return {
      mode: fileType,
      lineNumbers: true,
    };
  }

  render() {
    const { content, files, selectedName } = this.state;

    return (
      <div className="App">
        <div id="Container">
          <div className="Header">
            ZİYA
          </div>

          <Sidebar
            items={files}
            selectedItem={selectedName}
            handleItemClick={this.handleItemClick}
          />

          <Content
            value={content}
            onChange={this.updateCode}
            options={this.buildEditorOptions()}
            onKeyDown={this.handleKeyDown}
          />
        </div>
      </div>
    );
  }
}

export default App;
