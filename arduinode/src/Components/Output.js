/* @flow */
import React, { Component } from 'react';
import { getUnpluggedImageForType, getPluggedImageForType } from '../Types';

//import type { HTMLDivElement, SyntheticDragEvent } from 'flow';
import type { VarType } from '../Types';

import '../css/Node.css';

type State = {
}

type Props = {
  type : VarType,
  plugged : boolean,
  name : string,
}

class Output extends Component<Props, State> {
  getImageUrl() {
    if(this.props.plugged)
      return getPluggedImageForType(this.props.type);
    return getUnpluggedImageForType(this.props.type);
  }

  render() {
    return (
      <div className="Node-output">
        <span className="Node-output-name">{this.props.name}</span>
      <img className="Node-output-image" src={this.getImageUrl()} />
      </div>
    );
  }
}

export default Output;
