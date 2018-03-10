/* @flow */
import * as React from 'react';

import type { HTMLDivElement, SyntheticDragEvent } from 'flow';

import { Input, Output } from './';
import '../css/Node.css';

const repaintRate = 6;

type State = {
  mouseStartX : number,
  mouseStartY : number,
  startPosX : number,
  startPosY : number,
  posX : number,
  posY : number,
}

type Props = {
  width : number,
  height : number,
  zoomLevel: number,
  children?: React.Node,
  name : string,
  needRepaint : Function,
  setDraggedObject : Function,
  getDraggedObject : Function,
}

class Node extends React.Component<Props, State> {

  state = {
    mouseStartX : 0,
    mouseStartY : 0,
    startPosX : 50,
    startPosY : 50,
    posX : 2200,
    posY : 2200,
  };

  divElement : HTMLDivElement;
  inputs : Array<Input> = [];
  outputs : Array<Output> = [];
  repaintLeft = repaintRate;

  handleDragStart(e : SyntheticDragEvent<HTMLDivElement>) {
    e.stopPropagation();
    this.setState({
      mouseStartX: e.clientX,
      mouseStartY: e.clientY,
      startPosX : this.state.posX,
      startPosY : this.state.posY,
    });
    //hide preview, moving in real time
    var crt = this.divElement.cloneNode();
    crt.style.display = "none";
    e.dataTransfer.setDragImage(crt, 0, 0);
    this.repaintLeft = repaintRate;
  }

  handleDrag(e : SyntheticDragEvent<HTMLDivElement>) {
    e.stopPropagation();
    this.setState({
      posX: Math.min(Math.max(0, (e.clientX - this.state.mouseStartX) / this.props.zoomLevel + this.state.startPosX),
        this.props.width - this.divElement.clientWidth),
      posY: Math.min(Math.max(0, (e.clientY - this.state.mouseStartY) / this.props.zoomLevel + this.state.startPosY),
        this.props.height - this.divElement.clientHeight),
    });
    if(this.repaintLeft-- <= 0) {
      this.repaintLeft = repaintRate;
      this.props.needRepaint();
    }
  }

  render() {
    const l = this.state.posX;
    const t = this.state.posY;
    var style = {
      left: l,
      top: t,
    };
    var inId = 0;
    var outId = 0;
    return (
      <div className="Node"
        draggable="true"
        onDragStart={(e) => this.handleDragStart(e)}
        onDrag={(e) => this.handleDrag(e)}
        onDragEnd={(e) => {
          this.handleDrag(e);
          this.props.needRepaint();
        }}
        style={style}
        ref={divElem => {
          if(this.divElement === undefined)
            this.props.needRepaint();//repaint once mounted for the first time
          this.divElement = divElem;
        }}
        >
        <div className="Node-header">{this.props.name}</div>
        <div className="Node-body">
          <div className="Node_inputs">
            {React.Children.toArray(this.props.children).filter(c => c.type === Input)
              .map(input => React.cloneElement(input, {
                ref : connector => {
                  if(connector)
                    this.inputs[inId++] = connector;
                },
                zoomLevel: this.props.zoomLevel,
                needRepaint: this.props.needRepaint,
                nodePosX: this.state.posX,
                nodePosY: this.state.posY,
                setDraggedObject: obj => this.props.setDraggedObject(obj),
                getDraggedObject : () => this.props.getDraggedObject(),
              }))}
          </div>
          <div className="Node_outputs">
            {React.Children.toArray(this.props.children).filter(c => c.type === Output)
              .map(input => React.cloneElement(input, {
                ref : connector => {
                  if(connector)
                    this.outputs[outId++] = connector;
                },
                zoomLevel: this.props.zoomLevel,
                needRepaint: this.props.needRepaint,
                nodePosX: this.state.posX,
                nodePosY: this.state.posY,
                setDraggedObject: obj => this.props.setDraggedObject(obj),
                getDraggedObject : () => this.props.getDraggedObject(),
              }))}
          </div>
        </div>
      </div>
    );
  }
}

export default Node;
