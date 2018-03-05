/* @flow */
import * as React from 'react';

import type { HTMLDivElement, SyntheticDragEvent } from 'flow';

import { Input, Output } from './';
import '../css/Node.css';

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
  name : string
}

class Node extends React.Component<Props, State> {

  state = {
    mouseStartX : 0,
    mouseStartY : 0,
    startPosX : 50,
    startPosY : 50,
    posX : 2000,
    posY : 2000,
  };

  divElement : HTMLDivElement;
  inputs : Array<Input> = Array();
  outputs : Array<Output> = Array();

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
  }

  handleDrag(e : SyntheticDragEvent<HTMLDivElement>) {
    e.stopPropagation();
    this.setState({
      posX: Math.min(Math.max(0, (e.clientX - this.state.mouseStartX) / this.props.zoomLevel + this.state.startPosX),
        this.props.width - this.divElement.clientWidth),
      posY: Math.min(Math.max(0, (e.clientY - this.state.mouseStartY) / this.props.zoomLevel + this.state.startPosY),
        this.props.height - this.divElement.clientHeight),
    });
  }

  handleDragEnd(e : SyntheticDragEvent<HTMLDivElement>) {
    e.stopPropagation();
    this.setState({
      posX: Math.min(Math.max(0, (e.clientX - this.state.mouseStartX) / this.props.zoomLevel + this.state.startPosX),
        this.props.width - this.divElement.clientWidth),
      posY: Math.min(Math.max(0, (e.clientY - this.state.mouseStartY) / this.props.zoomLevel + this.state.startPosY),
        this.props.height - this.divElement.clientHeight),
    });
  }

  render() {
    var style = {
      left: this.state.posX,
      top: this.state.posY,
    };
    return (
      <div className="Node"
        draggable="true"
        onDragStart={(e) => this.handleDragStart(e)}
        onDrag={(e) => this.handleDrag(e)}
        onDragEnd={(e) => this.handleDragEnd(e)}
        style={style}
        ref={divElem => this.divElement = divElem}
        >
        <div className="Node-header">{this.props.name}</div>
        <div className="Node-body">
          <div className="Node_inputs">
            {React.Children.toArray(this.props.children).filter(c => c.type === Input)
              .map(input => React.cloneElement(input, {ref : connector => this.inputs.push(connector)}))}
          </div>
          <div className="Node_outputs">
            {React.Children.toArray(this.props.children).filter(c => c.type === Output)
              .map(input => React.cloneElement(input, {ref : connector => this.outputs.push(connector)}))}
          </div>
        </div>
      </div>
    );
  }
}

export default Node;
