import React, { Component } from 'react';
import uuid from 'uuid';
import Codemirror from 'react-codemirror';
import { File } from './File';

import 'codemirror/lib/codemirror.css'
import './App.css';

class App extends Component {

  constructor() {
    super();
    this.state = {
      files: [],
      selectedName: '',
      content: ''
    };
    this.handleFileClick = this.handleFileClick.bind(this);
    this.updateCode = this.updateCode.bind(this);
  }

  componentDidMount() {
    let self = this;
      if (!!window.EventSource) {
        var source = new EventSource('http://localhost:5000/sse/')
        source.addEventListener('message', function(e) {
          self.setState({
            files: []
          });
          self.setState({
            files: JSON.parse(e.data)
          })
        }, false)
        source.addEventListener('error', function(e) {
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
    console.log(e.target.textContent);
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
    }).then(function(response) {
        var reader = response.body.getReader();
        return reader.read();
      }).then(function(result, done) {
        if (!done) {
          console.log(result);
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

  render() {
    var options = {
      lineNumbers: true
    };

    return (
      <div className="App">
        <div id="container">
          <div className="header">
            ZİYA
          </div>
          <div id="sidebar">
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
          <div id="content" className={this.state.content ? '' : 'hidden'}>
            <Codemirror
              className="Editor"
              value={this.state.content}
              onChange={this.updateCode}
              options={options}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
