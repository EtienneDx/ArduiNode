import React, { Component } from 'react';
import { Node } from './';

class MapContainer extends Component {
  render() {
    return (
      <div className="MapContainer">
        MapContainer
        <div className="MapContainer-container">
          <Node/>
        </div>
      </div>
    );
  }
}

export default MapContainer;
