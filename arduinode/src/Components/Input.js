/* @flow */
import * as React from 'react';

import { getUnpluggedImageForType, getPluggedImageForType, getColorForType } from '../Types';


import type { CanvasRenderingContext2D, HTMLDivElement, HTMLImageElement, SyntheticDragEvent } from 'flow';
import type { VarType } from '../Types';
import type { Output } from './';

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
  draggedObject : Input | Output,
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
  refreshLeft = refreshRate;
  mouseX : number;
  mouseY : number;

  getImageUrl() {
    if(this.state.plugged)
      return getPluggedImageForType(this.props.type);
    return getUnpluggedImageForType(this.props.type);
  }

  getPosX() {
    return this.props.nodePosX + this.image.offsetLeft;
  }

  getPosY() {
    return this.props.nodePosY + this.image.offsetTop + this.image.width / 2;
  }

  paint(context : CanvasRenderingContext2D) {
    if(this.state.isBeingDragged) {
      context.strokeStyle = getColorForType(this.props.type);
      context.beginPath();
      context.moveTo(this.getPosX(), this.getPosY());

      const targetX = this.mouseX;
      const targetY = this.mouseY;

      context.bezierCurveTo(
        this.getPosX() - Math.abs(this.getPosX() - targetX) / 2,
        this.getPosY(),
        targetX + Math.abs(this.getPosX() - targetX) / 2,
        targetY,
        targetX, targetY
      );

      //context.lineTo(this.mouseX, this.mouseY);
      context.lineWidth = 2;
      context.stroke();
    }
  }

  handleDragStart(e : SyntheticDragEvent<HTMLDivElement>) {
    e.stopPropagation();
    this.refreshLeft = refreshRate;
    this.setState({
      mouseStartX: e.clientX,
      mouseStartY: e.clientY,
      isBeingDragged: true,
    });

    var crt = this.image.cloneNode();
    crt.style.display = "none";
    e.dataTransfer.setDragImage(crt, 0, 0);

    this.props.setDraggedObject("this");
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
      <div className="Node-input">
        <img
          className="Node-input-image"
          src={this.getImageUrl()}
          alt="varType" ref={e => this.image = e}
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
