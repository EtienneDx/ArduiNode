import React, { Component } from 'react';
import '../css/Node.css';

class Node extends Component {
  //implement state n stuff

  handleMouseDown(event) {

  }

  render() {
    return (
      <div className="Node" onMouseDown={(e) => this.handleMouseDown(e)}>
        <div className="Node-header">header</div>
        <div className="Node-body">body</div>
      </div>
    );
  }
}

export default Node;
