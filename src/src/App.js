import React, { Component } from 'react';
import uuid from 'uuid';
import Codemirror from 'react-codemirror';
import { File } from './File';

import 'codemirror/lib/codemirror.css'
import './App.css';

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
    this.handleFileClick = this.handleFileClick.bind(this);
    this.updateCode = this.updateCode.bind(this);
  }

  componentDidMount() {
    let self = this;
      if (!!window.EventSource) {
        var source = new EventSource('http://localhost:5000/sse/')
        source.addEventListener('message', (e) => {
          self.setState({
            files: []
          });
          self.setState({
            files: JSON.parse(e.data)
          })
        }, false)
        source.addEventListener('error', (e) => {
          if (e.readyState === EventSource.CLOSED) {
            console.log("Ziya was closed")
          }
        }, false)
      }
  }

  Uint8ToString(u8a) {
    var CHUNK_SZ = 0x8000;
    var c = [];
    for (var i=0; i < u8a.length; i+=CHUNK_SZ) {
      c.push(String.fromCharCode.apply(null, u8a.subarray(i, i+CHUNK_SZ)));
    }
    return c.join("");
  }

  handleFileClick(e) {
    let self = this;
    this.setState({
      selectedName: e.target.textContent
    });
    fetch('http://localhost:5000/content/' + encodeURIComponent(e.target.textContent), {
      method: 'GET', headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,x-requested-with,Authorization,Access-Control-Allow-Origin',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json'
      },
      mode: 'cors'
    }).then((response) => {
        var reader = response.body.getReader();
        return reader.read();
      }).then((result, done) => {
        if (!done) {
          var u8 = new Uint8Array(result.value);
          self.setState({
            content: self.Uint8ToString(u8)
          });
        }
      });
  }

  updateCode(newCode) {
    this.setState({
      content: newCode
    });
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
      mode: mode,
      lineNumbers: lineNumbers
    }
  }

  render() {
    let editorOptions = this.buildEditorOptions(this.getFileType(this.getExtension(this.state.selectedName)));
    return (
      <div className="App">
        <div id="Container">
          <div className="Header">
            ZİYA
          </div>
          <div id="Sidebar">
            {
              this.state.files.map((item) => (
                <File
                  key={uuid.v1()}
                  name={item.name}
                  className={this.state.selectedName === item.name ? 'selected' : ''}
                  onClick={this.handleFileClick}
                 />
              ))
            }
          </div>
          <div id="Content" className={this.state.content ? '' : 'hidden'}>
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
