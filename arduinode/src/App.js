/* @flow */
import React, { Component } from 'react';
import ReactFileReader from 'react-file-reader';
import urlQuery from './urlQuery';

import { Toolbar, MapContainer, Node, Variables, Details, OutputBox, InfoPopup, Input, Output } from './Components';
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
  infoShown : boolean,
}
// hard coded starting positions for setup and loop
const setupNode = Object.assign({}, NodeTypes.Arduino[0]);
setupNode.initialPosX = 2100;
setupNode.initialPosY = 2200;
const loopNode = Object.assign({}, NodeTypes.Arduino[1]);
loopNode.initialPosX = 2100;
loopNode.initialPosY = 2400;

class App extends Component<null, State> {

  constructor(props : null) {
    super(props);
    this.state = {
      inspectedObject : null,
      nodes : [
        setupNode,
        loopNode,
      ],
      vars : [],
      outputShown : false,
      output : "",
      infoShown : false,
    };

    const query = urlQuery(location.search);// eslint-disable-line
    const app = this;
    if(query.src === "pastebin") {
      console.log("loading pastebin sketch :  https://arduinode.net/loadPbSketch.php?src=" + query.ref);
      this.readFileAndOpen("https://arduinode.net/loadPbSketch.php?src=" + query.ref);
    } else if(query.src === "example") {
      console.log("loading example sketch :  https://arduinode.net/loadExampleSketch.php?src=" + query.ref);
      this.readFileAndOpen("https://arduinode.net/loadExampleSketch.php?src=" + query.ref);
    }
  }

  readFileAndOpen(file : string) {
    var app = this;
    var rawFile = new XMLHttpRequest();// eslint-disable-line
    rawFile.onload = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status === 0)
            {
                var allText = rawFile.responseText;
                try {
                  FileTranslator.FileToAppTranslator(app, JSON.parse(allText));
                } catch (e) {
                  console.error(e); //eslint-disable-line
                }
            }
        }
    }
    rawFile.onerror = function (e) {
      console.error(rawFile.statusText, e);// eslint-disable-line
    };
    rawFile.open("GET", file, true);
    rawFile.send(null);
  }

  details : Details;// the details panel
  mapContainer : MapContainer;// the sketch panel
  toolbar : Toolbar;// the toolbar panel

  refresh(then : Function) {
    this.mapContainer.checkConnections();// check if a node or a var have been disabled and require re-wiring
    if(typeof then === "function") {
      this.setState({}, () => then());// force re render
    } else {
      this.setState({});// force re render
    }
  }

  addNode(n : NodeType, f : Input | Output) {
    if(typeof f === "undefined" || f === null) {
      this.state.nodes.push(n);// add the node
      this.setState({});// force re render
    } else {
      n = Object.assign({}, n, {
        initialPosX : f.mouseX,
        initialPosY : f.mouseY,
      });
      this.state.nodes.push(n);// add the node
      this.setState({}, () => {
        let n = this.mapContainer.nodes[this.mapContainer.nodes.length - 1];
        if(f instanceof Input) {
          const connector = n.outputs.filter(o => o.props.type.name === f.props.type.name)[0];
          connector.connectTo(f);
          f.connectTo(connector);
        }
        else if(f instanceof Output) {
          const connector = n.inputs.filter(i => i.props.type.name === f.props.type.name)[0];
          connector.connectTo(f);
          f.connectTo(connector);
        }
        this.setState({});
      });
    }
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
      <div className="App" onClick={() => {
        this.details.setInspected(null);
        this.toolbar.clearQuery();
        this.setState({inspectedObject : null});// redraw
      }}>
        <header className="App-header">
          <h1 className="App-title">Welcome to ArduiNode</h1>
          <div style={{textAlign: "left"}}>
            <button onClick={e => {
              e.stopPropagation();
              this.setState({ output : Translator(this), outputShown : true });
            }}>
              Generate code
            </button>
            <button onClick={e => {
              e.stopPropagation();
              this.setState({ output : FileTranslator.AppToFileTranslator(this, true), outputShown : true });
            }}>
              Save sketch
            </button>
            <ReactFileReader handleFiles={files => this.handleFiles(files)} fileTypes={'.arduinode'}>
              <button className='btn' onClick={e => e.stopPropagation()}>Load sketch</button>
            </ReactFileReader>
            <button onClick={e => {
              e.stopPropagation();
              this.details.setInspected(
              {
                 objectType : "examples",
                 object : {name : "", value : ""},
              })
            }}>
              Examples
            </button>
            <div style={{display : "inline", right : 0, position : "absolute"}}>
              <a href="" onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                this.setState({infoShown : true});
              }}>More infos</a>
            </div>
        </div>
        </header>
        <div className="App-container">
          <OutputBox data={this.state.output} shown={this.state.outputShown} toggleShown={() => this.setState({ outputShown : false })}></OutputBox>
          <InfoPopup shown={this.state.infoShown} toggleShown={() => this.setState({ infoShown : false })}></InfoPopup>
          <div className="left-toolbar">
            <Variables
              setDetails={obj => {
                this.setState({inspectedObject : obj});
                this.details.setInspected(obj);
              }}
              inspectedObject={this.state.inspectedObject}
              addNode={n => this.addNode(n)}
              vars={this.state.vars}// arrays are references so no problem
              refresh={(then) => this.refresh(then)}
            />
            <Details ref={e => this.details = e} app={this}/>
          </div>
          <MapContainer
            ref={e => this.mapContainer = e}
            openToolbar={(e, x, y) => this.toolbar.openFromDrag(e, x, y)}
            inspectedObject={this.state.inspectedObject}
            setInspected={obj => {
              this.details.setInspected(obj);
              this.setState({inspectedObject : obj});
            }}
          >
            {this.state.nodes.map((n, i) => {
              const x = typeof n.initialPosX === "number" ? n.initialPosX : null;
              const y = typeof n.initialPosY === "number" ? n.initialPosY : null;
              return (
              <Node
                type={n}
                nodeKey={i}
                key={i}
                getVar={j => this.state.vars[j]}
                initialPosX={x}
                initialPosY={y}
              />
            )})}
          </MapContainer>
          <div className="right-toolbar">
            <Toolbar addNode={(n, f) => this.addNode(n, f)} ref={e => this.toolbar = e} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
