// Core
import React, { Component } from 'react';

// Helpers
import getFileContent from '../utils/getFileContent';
import getDirectoryContent from '../utils/getDirectoryContent';
import getKeyCode from '../utils/getKeyCode';
import overrideKeyDownEvent from '../utils/overrideKeyDownEvent';

// UI
import './App.css';
import Sidebar from './Sidebar';
import Codemirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript';

class App extends Component {
  constructor() {
    super();
    this.state = {
      files: [],
      selectedName: '',
      content: '',
      fileTypes: {
        js: 'javascript'
      }
    };
    this.handleItemClick = this.handleItemClick.bind(this);
    this.updateCode = this.updateCode.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    let self = this;
      if (!!window.EventSource) {
        var source = new EventSource('http://localhost:5000/sse/')
        source.addEventListener('message', (e) => {
          self.setState({
            files: JSON.parse(e.data)
          });
        }, false)

        source.addEventListener('error', (e) => {
          if (e.readyState === EventSource.CLOSED) {
            console.log("Ziya was closed")
          }
        }, false)
      }

      overrideKeyDownEvent();
  }

  async handleItemClick(item) {
    const { name, type } = item;

    if (type === 'directory') {
      const dirContent = await getDirectoryContent(name);
      console.log('clicked directory content: ', dirContent);
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
    const charCode = getKeyCode(event),
        self = this;

    if (event.metaKey && charCode === 's' && (navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey)) {
      fetch('http://localhost:5000/content', {
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type,x-requested-with,Authorization,Access-Control-Allow-Origin',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify({
          name: self.state.selectedName,
          content: self.state.content
        })
      });
    }
  }

  getExtension(fileName) {
    const splittedName = fileName.split('.');
    return splittedName[splittedName.length - 1];
  }

  getFileType(extension) {
    return this.state.fileTypes[extension];
  }

  buildEditorOptions(mode, lineNumbers = true) {
    return {
      mode,
      lineNumbers
    };
  }

  render() {
    const { files, selectedName } = this.state;
    const editorOptions = this.buildEditorOptions(this.getFileType(this.getExtension(selectedName)));

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

          <div id="Content" className={this.state.content ? '' : 'hidden'} onKeyDown={this.handleKeyDown}>
            <Codemirror
              className="Editor"
              value={this.state.content}
              onChange={this.updateCode}
              options={editorOptions}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
