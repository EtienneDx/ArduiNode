/* @flow */
import React, { Component } from 'react';

type Props = {
  shown : boolean,
  toggleShown : Function,
}

class InfoPopup extends Component<Props> {
  render() {
    if(this.props.shown === false) return null;
    return (
      <div className="infoPopup">
        <h4>Basic informations</h4>
        <p>
          ArduiNode is a free to use open source project, that aims to provide a new way to code.<br/>
          <span style={{ fontWeight : "bold" }}>Basic usage : </span><br/>
          You can remove Nodes and disconnect connectors by Alt clicking them.<br/>
          You can add some nodes by clicking on their types inside of the Toolbar.<br/>
          You can modify variables by using the details button, and add getter and setter for specific types by clicking the Get and Set buttons.
          <br/><br/>
          More informations about ArduiNodes usage on the <a href="https://github.com/EtienneDx/ArduiNode/wiki/How-to-use-ArduiNode">wiki</a>.
          <br/><br/>
          If you want to report any issues you may encounter, you can add them on <a href="https://github.com/EtienneDx/ArduiNode/issues">GitHub</a>.
          <br/><br/>
          To suggest new features, you can add an issue with the label {'"enhancement"'} <a href="https://github.com/EtienneDx/ArduiNode/issues">here</a>.
        </p>
        <button onClick={e => {
          e.stopPropagation();
          this.props.toggleShown(e);
        }}>Close</button>
      </div>
    );
  }
}

export default InfoPopup;
