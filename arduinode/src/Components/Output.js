/* @flow */
import React, { Component } from 'react';
import { VarTypes, getUnpluggedImageForType, getPluggedImageForType, getColorForType } from '../Types';
import { Input } from './';
import { paintBezier } from '../Tools';

import type { SyntheticDragEvent, HTMLImageElement, HTMLDivElement, CanvasRenderingContext2D } from 'flow';
import type { VarType } from '../Types';

import '../css/Node.css';

const refreshRate = 10;

type State = {
  isBeingDragged : boolean,
  mouseStartX : number,
  mouseStartY : number,
}

type Props = {
  type : VarType,
  name : string,
  zoomLevel : number,
  needRepaint : Function,
  nodePosX : number,
  nodePosY : number,
  setDraggedObject : Function,
  getDraggedObject : Function,
}

class Output extends Component<Props, State> {
  state = {
    isBeingDragged: false,
    mouseStartX : 0,
    mouseStartY : 0,
  }

  container : HTMLDivElement;
  image : HTMLImageElement;
  mouseX : number;
  mouseY : number;
  connectedTo : Array<Input> = [];
  refreshLeft = refreshRate;

  connectTo(obj : Input) {
    if(!this.connectedTo.includes(obj)) {
      if(this.props.type === VarTypes.EXEC) {
        this.connectedTo.forEach(e => e.disconnect(this));
        this.connectedTo = [];
      }
      this.connectedTo.push(obj);
    }
    this.setState({});//force re render
  }

  disconnect(obj : Input) {
    this.connectedTo.splice(this.connectedTo.indexOf(obj), 1);
  }

  getPosX() {
    return this.props.nodePosX + this.image.offsetLeft + this.image.width;
  }

  getPosY() {
    return this.props.nodePosY + this.image.offsetTop + this.image.height / 2;
  }

  getImageUrl() {
    if(this.connectedTo.length > 0)
      return getPluggedImageForType(this.props.type);
    return getUnpluggedImageForType(this.props.type);
  }

  paint(context : CanvasRenderingContext2D) {
    if(this.state.isBeingDragged) {
      paintBezier(context, this.mouseX, this.mouseY, this.getPosX(), this.getPosY(), getColorForType(this.props.type));
    }
  }

  /************Drop zone events**************/
  handleDragOver(e : SyntheticDragEvent) {
    if(this.props.getDraggedObject() instanceof Input && this.props.getDraggedObject().props.type === this.props.type)
      e.preventDefault();
  }

  handleDrop(e : SyntheticDragEvent) {
    if(this.props.getDraggedObject() instanceof Input && this.props.getDraggedObject().props.type === this.props.type)
    {
      e.preventDefault();
      if(this.connectedTo && this.props.type === VarTypes.EXEC) {//exec outputs can have only one connection
        this.connectedTo.forEach(e => e.disconnect(this));
        this.connectedTo = [];
      }
      if(!this.connectedTo.includes(this.props.getDraggedObject())) {
        this.connectedTo.push(this.props.getDraggedObject());
        this.props.getDraggedObject().connectTo(this);
      }
      this.setState({});//force re render
    }
  }

  /************dragged object events****************/
  handleDragStart(e : SyntheticDragEvent) {
    e.stopPropagation();
    this.refreshLeft = refreshRate;
    this.setState({
      mouseStartX: e.clientX,
      mouseStartY: e.clientY,
      isBeingDragged: true,
    });

    var crt = this.container.cloneNode();
    crt.style.display = "none";
    e.dataTransfer.setDragImage(crt, 0, 0);

    this.props.setDraggedObject(this);
  }

  handleDrag(e : SyntheticDragEvent) {
    e.stopPropagation();
    this.refreshLeft--;
    if(this.refreshLeft <= 0) {
      this.mouseX = (e.clientX - this.state.mouseStartX) / this.props.zoomLevel + this.getPosX();
      this.mouseY = (e.clientY - this.state.mouseStartY) / this.props.zoomLevel + this.getPosY();
      this.props.needRepaint();
      this.refreshLeft = refreshRate;
    }
  }

  handleDragEnd(e : SyntheticDragEvent) {
    e.stopPropagation();
    this.setState({
      isBeingDragged: false,
    });
    this.props.setDraggedObject(undefined);
    this.props.needRepaint();
  }

  render() {
    return (
      <div
        className="Node-output"
        onDragOver={e => this.handleDragOver(e)}
        onDrop={e => this.handleDrop(e)}
        ref={ob => this.container = ob}
        >
        <span className="Node-output-name">{this.props.name}</span>
        <img
          className="Node-output-image"
          src={this.getImageUrl()}
          alt="varType"
          ref={e => this.image = e}
          draggable
          onDragStart={e => this.handleDragStart(e)}
          onDrag={e => this.handleDrag(e)}
          onDragEnd={e => this.handleDragEnd(e)}
        />
      </div>
    );
  }
}

export default Output;
