/* @flow */
import React, { Component } from 'react';
import { getUnpluggedImageForType, getPluggedImageForType, CanvasRenderingContext2D } from '../Types';

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

class Input extends Component<Props, State> {
  getImageUrl() {
    if(this.props.plugged)
      return getPluggedImageForType(this.props.type);
    return getUnpluggedImageForType(this.props.type);
  }

  paint(context : CanvasRenderingContext2D) {
    // @TODO
  }

  render() {
    return (
      <div className="Node-input">
        <img className="Node-input-image" src={this.getImageUrl()} />
        <span className="Node-input-name">{this.props.name}</span>
      </div>
    );
  }
}

export default Input;
