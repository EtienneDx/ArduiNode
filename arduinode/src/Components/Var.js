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
}

class Var extends Component<Props> {

  render() {
    return (
      <li className="Var">
        {this.props.data.name}
        <button onClick={this.props.remove}>X</button>
        <button onClick={this.props.details}>Details</button>
        <button onClick={this.props.getter}>Get</button>
        <button onClick={this.props.setter}>Set</button>
      </li>
    );
  }
}

export default Var;
