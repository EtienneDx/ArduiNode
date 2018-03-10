/* @flow */
import React, { Component } from 'react';
import { VarTypes, getUnpluggedImageForType, getPluggedImageForType, CanvasRenderingContext2D } from '../Types';
import { Input } from './';

import type { SyntheticDragEvent, HTMLImageElement } from 'flow';
import type { VarType } from '../Types';

import '../css/Node.css';

type State = {
  isBeingDragged : boolean,
}

type Props = {
  type : VarType,
  name : string,
  needRepaint : Function,
  nodePosX : number,
  nodePosY : number,
  setDraggedObject : Function,
  getDraggedObject : Function,
}

class Output extends Component<Props, State> {
  state = {
    isBeingDragged: false,
  }

  image : HTMLImageElement;
connectedTo : Input;

  getPosX() {
    return this.props.nodePosX + this.image.offsetLeft + this.image.width;
  }

  getPosY() {
    return this.props.nodePosY + this.image.offsetTop + this.image.height / 2;
  }

  getImageUrl() {
    if(this.connectedTo)
      return getPluggedImageForType(this.props.type);
    return getUnpluggedImageForType(this.props.type);
  }

  paint(context : CanvasRenderingContext2D) {
    // @TODO
  }

  handleDragOver(e : SyntheticDragEvent) {
    if(this.props.getDraggedObject() instanceof Input)
      e.preventDefault();
  }

  handleDrop(e : SyntheticDragEvent) {
    if(this.props.getDraggedObject() instanceof Input && this.props.getDraggedObject().props.type === this.props.type)
    {
      e.preventDefault();
      if(this.connectedTo && this.props.type === VarTypes.EXEC)
        this.connectedTo.disconnect();
      this.connectedTo = this.props.getDraggedObject();
      this.props.getDraggedObject().connectTo(this);
      this.props.setDraggedObject(null);
      this.setState({});//force re render
    }
  }

  render() {
    return (
      <div
        className="Node-output"
        onDragOver={e => this.handleDragOver(e)}
        onDrop={e => this.handleDrop(e)}
        >
        <span className="Node-output-name">{this.props.name}</span>
        <img
          className="Node-output-image"
          src={this.getImageUrl()}
          alt="varType"
          ref={e => this.image = e}
        />
      </div>
    );
  }
}

export default Output;
