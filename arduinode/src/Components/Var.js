/* @flow */
import React, { Component } from 'react';

//import { VarTypes } from '../Types';

import '../css/App.css';

type Props = {
  data : Object,
  remove : Function,
  details : Function,
  getter : Function,
  setter : Function,
  inspected : Boolean,
}

class Var extends Component<Props> {

  render() {
    return (
      <li
        className="Var"
        inspected={this.props.inspected ? "selected" : ""}
        onClick={e => {
          e.stopPropagation();
          this.props.details();
        }}
      >
        <div className="Var-label">
          <img src={this.props.data.type.pluggedImage} alt=""></img>
          {this.props.data.name}
        </div>
        <div className="Var-buttons">
          <button onClick={e => {
            e.stopPropagation();
            this.props.remove();
          }}>X</button>
          <button onClick={e => {
            e.stopPropagation();
            this.props.getter();
          }}>Get</button>
          <button onClick={e => {
            e.stopPropagation();
            this.props.setter();
          }}>Set</button>
        </div>
      </li>
    );
  }
}

export default Var;
