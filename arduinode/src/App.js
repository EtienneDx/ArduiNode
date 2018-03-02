import React, { Component } from 'react';
import { Toolbar, MapContainer } from './Components';
import './css/App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to ArduiNode</h1>
        </header>
        <div className="App-container">
          <Toolbar/>
          <MapContainer/>
        </div>
      </div>
    );
  }
}

export default App;
