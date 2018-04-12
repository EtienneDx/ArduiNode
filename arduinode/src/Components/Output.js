/* @flow */
import React, { Component } from 'react';
import { VarTypes } from '../Types';
import { Input, Node } from './';
import { paintBezier } from '../Tools';

import type { SyntheticDragEvent, HTMLImageElement, HTMLDivElement, CanvasRenderingContext2D, SyntheticMouseEvent } from 'flow';
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
  parent : Node,
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
      if(this.props.type === VarTypes.Exec) {
        this.connectedTo.forEach(e => e.disconnect(this));
        this.connectedTo = [];
      }
      this.connectedTo.push(obj);
    }
    this.setState({});//force re render
  }

  disconnect(obj : Input) {
    if(this.props.parent.state.enabled === false) return;// we're not mounted anymore
    this.connectedTo.splice(this.connectedTo.indexOf(obj), 1);
    this.setState({});//force re render
  }

  getPosX() {
    return this.props.nodePosX + this.image.offsetLeft + this.image.width;
  }

  getPosY() {
    return this.props.nodePosY + this.image.offsetTop + this.image.height / 2;
  }

  getImageUrl() {
    if(!this.props.type) return;
    if(this.connectedTo.length > 0)
      return this.props.type.pluggedImage;
    return this.props.type.unpluggedImage;
  }

  paint(context : CanvasRenderingContext2D) {
    this.checkConnections();
    if(this.state.isBeingDragged) {
      paintBezier(context, this.mouseX, this.mouseY, this.getPosX(), this.getPosY(), this.props.type.color);
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

  /*********Other events************/
  handleClick(e : SyntheticMouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if(e.altKey) {
      this.connectedTo.forEach(obj => obj.disconnect(this));
      this.connectedTo = [];
      this.props.needRepaint();
      this.setState({});//force re render
    }
  }

  /**********Render**********/

  checkConnections() {
    for (var i = 0; i < this.connectedTo.length; i++) {
      if (
        this.connectedTo[i].props.type !== this.props.type ||
        this.connectedTo[i].props.parent.state.enabled === false ||
        this.props.parent.state.enabled === false
      ) {
        this.connectedTo[i].disconnect(this);
        this.connectedTo.splice(i--, 1);
      }
    }
    if(this.props.parent.state.enabled === true)// we're mounted
      this.setState({});//force re render
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
          onClick={e => this.handleClick(e)}
        />
      </div>
    );
  }
}

export default Output;
