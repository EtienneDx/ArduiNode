/* @flow */
import * as React from 'react';

import { getUnpluggedImageForType, getPluggedImageForType, getColorForType } from '../Types';
import { Output } from './';


import type { CanvasRenderingContext2D, HTMLDivElement, HTMLImageElement, SyntheticDragEvent } from 'flow';
import type { VarType } from '../Types';

import '../css/Node.css';

type State = {
  isBeingDragged : boolean,
  plugged : boolean,
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

const refreshRate = 10;

class Input extends React.Component<Props, State> {

  state = {
    isBeingDragged : false,
    plugged : false,
    mouseStartX : 0,
    mouseStartY : 0,
  }

  image : HTMLImageElement;
  container : HTMLDivElement;//for drag start
  refreshLeft = refreshRate;
  mouseX : number;
  mouseY : number;
  connectedTo : Output;

  connectTo(obj : Output) {
    this.connectedTo = obj;
    this.setState({plugged : true});
  }

  disconnect() {
    this.connectedTo = undefined;
    this.setState({plugged : false});
  }

  getImageUrl() {
    if(this.state.plugged)
      return getPluggedImageForType(this.props.type);
    return getUnpluggedImageForType(this.props.type);
  }

  getPosX() {
    return this.props.nodePosX + this.image.offsetLeft;
  }

  getPosY() {
    return this.props.nodePosY + this.image.offsetTop + this.image.height / 2;
  }

  paint(context : CanvasRenderingContext2D) {
    if(this.state.isBeingDragged) {
      this.paintBezier(context, this.getPosX(), this.getPosY(), this.mouseX, this.mouseY);
    }
    if(this.connectedTo) {
      this.paintBezier(context, this.getPosX(), this.getPosY(), this.connectedTo.getPosX(), this.connectedTo.getPosY());
    }
  }

  // @TODO move that somewhere else
  paintBezier(context : CanvasRenderingContext2D, fromX : number, fromY : number, toX : number, toY : number) {
    context.strokeStyle = getColorForType(this.props.type);
    context.beginPath();
    context.moveTo(fromX, fromY);

    context.bezierCurveTo(
      fromX - Math.abs(fromX - toX) / 2, fromY,//control point 1
      toX + Math.abs(fromX - toX) / 2, toY,//control point 2
      toX, toY//end point
    );

    //context.lineTo(this.mouseX, this.mouseY);
    context.lineWidth = 2;
    context.stroke();
  }

  handleDragStart(e : SyntheticDragEvent<HTMLDivElement>) {
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

  handleDrag(e : SyntheticDragEvent<HTMLDivElement>) {
    e.stopPropagation();
    this.refreshLeft--;
    if(this.refreshLeft <= 0) {
      this.mouseX = (e.clientX - this.state.mouseStartX) / this.props.zoomLevel + this.getPosX();
      this.mouseY = (e.clientY - this.state.mouseStartY) / this.props.zoomLevel + this.getPosY();
      this.props.needRepaint();
      this.refreshLeft = refreshRate;
    }
  }

  handleDragEnd(e : SyntheticDragEvent<HTMLDivElement>) {
    e.stopPropagation();
    this.setState({
      isBeingDragged: false,
    });
    this.props.needRepaint();
  }

  render() {
    return (
      <div className="Node-input" ref={e => this.container = e}>
        <img
          className="Node-input-image"
          src={this.getImageUrl()}
          alt="varType"
          ref={e => this.image = e}
          draggable="true"
          onDragStart={e => this.handleDragStart(e)}
          onDrag={e => this.handleDrag(e)}
          onDragEnd={e => this.handleDragEnd(e)}
        />
        <span className="Node-input-name">{this.props.name}</span>
      </div>
    );
  }
}

export default Input;
