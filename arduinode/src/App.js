/* @flow */
import React, { Component } from 'react';
import ReactFileReader from 'react-file-reader';

import { Toolbar, MapContainer, Node, Variables, Details, OutputBox } from './Components';
import './css/App.css';

import { NodeTypes } from './Types';
import { Translator, FileTranslator } from './Translator';

import type { Variable, NodeType } from './Types';

type State = {
  inspectedObject : ?{
    getObject : Function,
    setObject : Function,
    objectType : string,
  },//the object being displayed in the details section
  nodes : Array<NodeType>,// the list of nodes in the sketch
  vars : Array<Variable>,// the list of vars in the sketch
  outputShown : boolean,
  output : string,
}
// hard coded starting positions for setup and loop
const setupNode = Object.assign({}, NodeTypes.Arduino[0]);
setupNode.initialPosX = 2100;
setupNode.initialPosY = 2200;
const loopNode = Object.assign({}, NodeTypes.Arduino[1]);
loopNode.initialPosX = 2100;
loopNode.initialPosY = 2400;

class App extends Component<null, State> {

  details : Details;// the details panel
  mapContainer : MapContainer;// the sketch panel

  state = {
    inspectedObject : null,
    nodes : [
      setupNode,
      loopNode,
    ],
    vars : [],
    outputShown : false,
    output : "",
  }

  refresh() {
    this.mapContainer.checkConnections();// check if a node or a var have been disabled and require re-wiring
    this.setState({});// force re render
  }

  addNode(n : NodeType) {
    this.state.nodes.push(n);// add the node
    this.setState({});// force re render
  }

  handleFiles(files : any) {
    const app = this;
    var reader = new FileReader();
    reader.onload = function(e) {
      // Use reader.result
      FileTranslator.FileToAppTranslator(app, JSON.parse(reader.result.toString()));
    }
    reader.readAsText(files[0]);
  }

  render() {
    //var i = 0;// the key of the nodes
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to ArduiNode</h1>
          <div style={{textAlign: "left"}}>
            <button onClick={e => {
              this.setState({ output : Translator(this), outputShown : true });
            }}>
              Generate code
            </button>
            <button onClick={e => {
              this.setState({ output : FileTranslator.AppToFileTranslator(this, true), outputShown : true });
            }}>
              Save sketch
            </button>
            <ReactFileReader handleFiles={files => this.handleFiles(files)} fileTypes={'.arduinode'}>
              <button className='btn'>Load sketch</button>
            </ReactFileReader>
          </div>
        </header>
        <div className="App-container">
          <OutputBox data={this.state.output} shown={this.state.outputShown} toggleShown={() => this.setState({ outputShown : false })}></OutputBox>
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
            {this.state.nodes.map((n, i) => {
              const x = typeof n.initialPosX === "number" ? n.initialPosX : null;
              const y = typeof n.initialPosY === "number" ? n.initialPosY : null;
              return (
              <Node
                type={n}
                nodeKey={i}
                key={i++}
                getVar={i => this.state.vars[i]}
                initialPosX={x}
                initialPosY={y}
              />
            )})}
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
