import React, { Component } from 'react';

import { Toolbar, MapContainer, Node, Input, Output } from './Components';
import './css/App.css';

import { VarTypes } from './Types';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to ArduiNode</h1>
        </header>
        <div className="App-container">
          <Toolbar/>
          <MapContainer>
            <Node name="testing node">
              <Input type={VarTypes.EXEC} name="exec" />
              <Output type={VarTypes.EXEC} name="exec" />
              <Input type={VarTypes.EXEC} name="exec" />
            </Node>
          </MapContainer>
        </div>
      </div>
    );
  }
}

export default App;
