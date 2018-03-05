/* @flow */
import React, { Component } from 'react';
import { getUnpluggedImageForType, getPluggedImageForType, CanvasRenderingContext2D } from '../Types';

//import type { HTMLDivElement, SyntheticDragEvent } from 'flow';
import type { VarType } from '../Types';

import '../css/Node.css';

type State = {
  isBeingDragged : boolean,
}

type Props = {
  type : VarType,
  plugged : boolean,
  name : string,
}

class Output extends Component<Props, State> {
  state = {
    isBeingDragged: false,
  }

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
      <div className="Node-output">
        <span className="Node-output-name">{this.props.name}</span>
      <img className="Node-output-image" src={this.getImageUrl()} />
      </div>
    );
  }
}

export default Output;
