/* @flow */
import React, { Component } from 'react';

import { Toolbar, MapContainer, Node, Variables, Details } from './Components';
import './css/App.css';

import { NodeTypes } from './Types';
import { Translator } from './Translator';

import type { Variable, NodeType } from './Types';

type State = {
  inspectedObject : ?{
    getObject : Function,
    setObject : Function,
    objectType : string,
  },//the object being displayed in the details section
  nodes : Array<NodeType>,
  vars : Array<Variable>,
}

class App extends Component<null, State> {

  details : Details;
  mapContainer : MapContainer;

  state = {
    inspectedObject : null,
    nodes : [
      NodeTypes.Arduino[0],
      NodeTypes.Arduino[1],
    ],
    vars : [],
  }

  refresh() {
    this.mapContainer.checkConnections();
    this.setState({});
  }

  addNode(n : NodeType) {
    this.state.nodes.push(n);
    this.setState({});
  }

  render() {
    var i = 0;
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to ArduiNode</h1>
          <div style={{textAlign: "left"}}>
            <button onClick={e => {
              Translator(this);
            }}>
              Generate code
            </button>
          </div>
        </header>
        <div className="App-container">
          <div className="left-toolbar">
            <Variables
              setDetails={obj => {
                this.setState({inspectedObject : obj});
                this.details.setInspected(obj);
              }}
              addNode={n => this.addNode(n)}
              vars={this.state.vars}// arrays are references so no problem
              refresh={() => this.refresh()}
            />
            <Details ref={e => this.details = e}/>
          </div>
          <MapContainer ref={e => this.mapContainer = e}>
            {this.state.nodes.map(n => (
              <Node type={n} nodeKey={i} key={i++} getVar={i => this.state.vars[i]}/>
            ))}
          </MapContainer>
          <div className="right-toolbar">
            <Toolbar addNode={n => this.addNode(n)}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
