/* @flow */
import * as React from 'react';

import { VarTypes } from '../Types';
import { Output, Node } from './';
import { paintBezier } from '../Tools';

import type { CanvasRenderingContext2D, HTMLDivElement, HTMLImageElement, SyntheticDragEvent, SyntheticMouseEvent } from 'flow';
import type { VarType } from '../Types';

import '../css/Node.css';

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

const refreshRate = 10;// rate at which the line is redrawn

class Input extends React.Component<Props, State> {

  state = {
    isBeingDragged : false,
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
    if(!this.connectedTo.includes(obj)) {
      if(this.props.type !== VarTypes.Basics.Exec) {
        this.connectedTo.forEach(e => e.disconnect(this));
        this.connectedTo = [];
      }
      this.connectedTo.push(obj);
    }
    this.setState({});//force re render
  }

  disconnect(obj : Output) {
    if(this.props.parent.state.enabled === false) return;// we're not mounted anymore
    this.connectedTo.splice(this.connectedTo.indexOf(obj), 1);
    this.setState({});
  }

  getImageUrl() {
    if(!this.props.type) return;
    if(this.connectedTo.length > 0)
      return this.props.type.pluggedImage;
    return this.props.type.unpluggedImage;
  }

  getPosX() {
    return this.props.nodePosX + (this.image ? this.image.offsetLeft : 0);
  }

  getPosY() {
    return this.props.nodePosY + (this.image ? (this.image.offsetTop + this.image.height / 2) : 0);
  }

  paint(context : CanvasRenderingContext2D) {
    this.checkConnections();
    if(this.state.isBeingDragged) {
      paintBezier(context, this.getPosX(), this.getPosY(), this.mouseX, this.mouseY, this.props.type.color);
    }
      this.connectedTo.forEach(e =>
        paintBezier(
          context,
          this.getPosX(), this.getPosY(), //from
          e.getPosX(), e.getPosY(), //towards
          this.props.type.color));
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
    if(
      this.props.getDraggedObject() instanceof Output &&
      (
        this.props.getDraggedObject().props.type === this.props.type ||
        (
          this.props.type.name === "any" &&
          this.props.getDraggedObject().props.type !== VarTypes.Basics.Exec
        )
      )
    )
      e.preventDefault();
  }

  handleDrop(e : SyntheticDragEvent) {
    if(
      this.props.getDraggedObject() instanceof Output &&
      (
        this.props.getDraggedObject().props.type === this.props.type ||
        (
          this.props.type.name === "any" &&
          this.props.getDraggedObject().props.type !== VarTypes.Basics.Exec
        )
      )
    )
    {
      e.preventDefault();
      if(this.connectedTo.length > 0 && this.props.type !== VarTypes.Basics.Exec) {//non exec can only have one connection on inputs
        this.connectedTo.forEach(e => e.disconnect());
        this.connectedTo = [];
      }
      if(!this.connectedTo.includes(this.props.getDraggedObject()))
      {
        this.connectedTo.push(this.props.getDraggedObject());
        this.props.getDraggedObject().connectTo(this);
      }
      this.setState({});//force re render
    }
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

  /********render*********/

  checkConnections() {
    for (var i = 0; i < this.connectedTo.length; i++) {
      if (
        (
          this.connectedTo[i].props.type !== this.props.type &&
          this.props.type.name !== "any"
        ) ||
        (
          this.connectedTo[i].props.type === VarTypes.Basics.Exec &&
          this.props.type.name === "any"
        ) ||
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
          onClick={e => this.handleClick(e)}
        />
        <span className="Node-input-name">{this.props.name}</span>
      </div>
    );
  }
}

export default Input;
