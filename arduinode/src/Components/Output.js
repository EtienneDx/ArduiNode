/* @flow */
import React, { Component } from 'react';
import { getUnpluggedImageForType, getPluggedImageForType, CanvasRenderingContext2D } from '../Types';

import type { SyntheticDragEvent } from 'flow';
import type { VarType } from '../Types';
import type { Input } from './';

import '../css/Node.css';

type State = {
  isBeingDragged : boolean,
}

type Props = {
  type : VarType,
  plugged : boolean,
  name : string,
  needRepaint : Function,
  nodePosX : number,
  nodePosY : number,
  setDraggedObject : Function,
  draggedObject : Input | Output,
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

  handleDrop(e : SyntheticDragEvent) {
    e.preventDefault();
    console.log(this.props.draggedObject);
  }

  render() {
    return (
      <div
        className="Node-output"
        /*draggable="true"
        onDragStart={e => this.handleSragStart(e)}*/// @TODO finish this

        onDragOver={e => e.preventDefault()}
        onDrop={e => this.handleDrop(e)}
        >
        <span className="Node-output-name">{this.props.name}</span>
        <img className="Node-output-image" src={this.getImageUrl()} alt="varType"/>
      </div>
    );
  }
}

export default Output;
