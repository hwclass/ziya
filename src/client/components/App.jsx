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
import { Notification } from 'react-notification';

// Constants
import FILE_TYPES from '../constants/fileTypes';
import NOTIFICATIONS from '../constants/notifications';

class App extends Component {
  constructor() {
    super();
    this.state = {
      files: [],
      selectedFile: {},
      content: '',
      isNotificationActive: false,
      notificationAction: NOTIFICATIONS.saved,
    };

    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.buildEditorOptions = this.buildEditorOptions.bind(this);
    this.getParentDirectoryContent = this.getParentDirectoryContent.bind(this);
    this.toggleNotification = this.toggleNotification.bind(this);
  }

  componentDidMount() {
    overrideKeyDownEvent();
    this.getParentDirectoryContent();
  }

  async getParentDirectoryContent() {
    const content = await getDirectoryContent();
    this.setState({ files: content });
  }

  getExtension = (fileName) => {
    const splittedName = fileName.split('.');
    return splittedName[splittedName.length - 1];
  }

  async handleItemClick(item) {
    const { files } = this.state;
    const { parentPath, path, type } = item;

    this.setState({ isNotificationActive: false });

    if (type === 'directory') {
      const directoryContent = await getDirectoryContent(path);

      const updateFiles = fileList => fileList.map((file) => {
        if (file.path === path) {
          return { ...file, children: directoryContent };
        } else if (file.path === parentPath) {
          return { ...file, children: updateFiles(file.children) };
        }

        return file;
      });

      const updatedFiles = updateFiles(files);

      this.setState({
        selectedFile: item,
        files: updatedFiles,
      });
    } else {
      const fileContent = await getFileContent(path);

      this.setState({
        selectedFile: item,
        content: fileContent,
      });
    }
  }

  handleContentChange(content) {
    this.setState({ content });
  }

  async handleKeyDown(event) {
    const charCode = getKeyCode(event);

    if (event.metaKey && charCode === 's' && (navigator.platform.match('Mac') ? event.metaKey : event.ctrlKey)) {
      const { selectedFile, content } = this.state;
      await saveFile(selectedFile.path, content);
      this.setState({
        isNotificationActive: true,
        notificationAction: NOTIFICATIONS.saved,
      });
    }
  }

  buildEditorOptions() {
    const { selectedFile } = this.state;

    if (selectedFile.name && selectedFile.type) {
      const extension = this.getExtension(selectedFile.name);
      const fileType = FILE_TYPES[extension];

      return {
        mode: fileType,
        lineNumbers: true,
      };
    }

    return {};
  }

  toggleNotification() {
    this.setState({ isNotificationActive: false });
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
            options={this.buildEditorOptions()}
            onKeyDown={this.handleKeyDown}
          />

          <Notification
            isActive={this.state.isNotificationActive}
            message={this.state.notificationAction}
            title={this.state.selectedFile.path}
            onClick={() => this.setState({ isNotificationActive: false })}
            onDismiss={() => this.toggleNotification()}
            dismissAfter={3000}
          />
        </div>
      </div>
    );
  }
}

export default App;
