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
      selectedFile: {},
      content: '',
    };

    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
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
    const { parentPath, path, type } = item;

    if (type === 'directory') {
      const directoryContent = await getDirectoryContent(path);

      const updateFiles = fileList => fileList.map(file => {
        if (file.path === path) {
          return { ...file, children: directoryContent };
        } else if (file.path === parentPath) {
          return { ...file, children: updateFiles(file.children) }
        }

        return file;
      });

      const updatedFiles = updateFiles(files);

      this.setState({
        selectedFile: item,
        files: updatedFiles
      });
    } else {
      const fileContent = await getFileContent(path);

      this.setState({
        selectedFile: item,
        content: fileContent
      });
    }
  }

  handleContentChange(content) {
    this.setState({ content });
  }

  handleKeyDown(event) {
    const charCode = getKeyCode(event);

    if (event.metaKey && charCode === 's' && (navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey)) {
      const { selectedFile, content } = this.state;
      saveFile(selectedFile.path, content);
    }
  }

  getExtension(fileName) {
    const splittedName = fileName.split('.');
    return splittedName[splittedName.length - 1];
  }

  buildEditorOptions() {
    const extension = this.getExtension(this.state.selectedFile.name);
    const fileType = FILE_TYPES[extension];

    return {
      mode: fileType,
      lineNumbers: true,
    };
  }

  render() {
    const { content, files, selectedFile } = this.state;

    return (
      <div className="App">
        <div id="Container">
          <div className="Header">
            ZİYA
          </div>

          <Sidebar
            items={files}
            selectedItem={selectedFile}
            handleItemClick={this.handleItemClick}
          />

          <Content
            value={content}
            onChange={this.handleContentChange}
            options={selectedFile.name && selectedFile.type === 'file' && this.buildEditorOptions()}
            onKeyDown={this.handleKeyDown}
          />
        </div>
      </div>
    );
  }
}

export default App;
