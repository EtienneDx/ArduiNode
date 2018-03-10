/* @flow */
import * as React from 'react';

import { VarTypes, getUnpluggedImageForType, getPluggedImageForType, getColorForType } from '../Types';
import { Output } from './';
import { paintBezier } from '../Tools';

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
  connectedTo : Array<Output> = [];

  connectTo(obj : Output) {
    if(!this.connectedTo.includes(obj))
      this.connectedTo.push(obj);
    this.setState({plugged : true});
  }

  disconnect(obj : Output) {
    this.connectedTo.splice(this.connectedTo.indexOf(obj), 1);
    this.setState({plugged : this.connectedTo.length > 0});
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
      paintBezier(context, this.getPosX(), this.getPosY(), this.mouseX, this.mouseY, getColorForType(this.props.type));
    }
      this.connectedTo.forEach(e =>
        paintBezier(
          context,
          this.getPosX(), this.getPosY(), //from
          e.getPosX(), e.getPosY(), //towards
          getColorForType(this.props.type)));
  }
  /********This being dragged events***************/
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

  /***************This used as a dropzone events****************/

  handleDragOver(e : SyntheticDragEvent) {
    if(this.props.getDraggedObject() instanceof Output && this.props.getDraggedObject().props.type === this.props.type)
      e.preventDefault();
  }

  handleDrop(e : SyntheticDragEvent) {
    if(this.props.getDraggedObject() instanceof Output && this.props.getDraggedObject().props.type === this.props.type)
    {
      e.preventDefault();
      if(this.connectedTo.length > 0 && this.props.type !== VarTypes.EXEC) {//non exec can only have one connection on inputs
        this.connectedTo.forEach(e => e.disconnect());
        this.connectedTo = [];
      }
      if(!this.connectedTo.includes(this.props.getDraggedObject()))
      {
        this.connectedTo.push(this.props.getDraggedObject());
        this.props.getDraggedObject().connectTo(this);
      }
      this.setState({plugged : this.connectedTo.length > 0});//force re render
    }
  }

  render() {
    return (
      <div
        className="Node-input"
        ref={e => this.container = e}
        onDragOver={e => this.handleDragOver(e)}
        onDrop={e => this.handleDrop(e)}
      >
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
