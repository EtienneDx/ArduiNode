/* @flow */
import * as React from 'react';

import type { HTMLDivElement, SyntheticDragEvent, SyntheticMouseEvent } from 'flow';

import { Input, Output } from './';
import { getVarType } from '../Types';
import '../css/Node.css';

import type NodeType from '../Types';

const repaintRate = 6;

type State = {
  mouseStartX : number,
  mouseStartY : number,
  startPosX : number,
  startPosY : number,
  posX : number,
  posY : number,
  enabled : boolean,
}

type Props = {
  type : NodeType,
  width : number,
  height : number,
  zoomLevel: number,
  needRepaint : Function,
  setDraggedObject : Function,
  getDraggedObject : Function,
  getVar : Function,
}

class Node extends React.Component<Props, State> {

  state = {
    mouseStartX : 0,
    mouseStartY : 0,
    startPosX : 50,
    startPosY : 50,
    posX : 2200,
    posY : 2200,
    enabled : true,
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

  handleClick(e : SyntheticMouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if(e.altKey) {
      this.setState({ enabled : false });// delete the node
      // eslint-disable-next-line
      setTimeout(() => {
        this.check();
        this.props.needRepaint();
      }, 10);// check after setstate becomes effective
    }
  }

  check() {
    if(this.props.type.name === "Get" && this.props.getVar(this.props.type.target).enabled === false) {
      this.setState({ enabled : false });
    }
    this.inputs.forEach(i => i.checkConnections());
    this.outputs.forEach(o => o.checkConnections());
  }

  render() {
    if(this.state.enabled === false) return null;
    const l = this.state.posX;
    const t = this.state.posY;
    var style = {
      left: l,
      top: t,
    };

    var headerName = this.props.type.name;
    if(this.props.type.name === "Get") {// Variable getter
      this.props.type.outputs[0].type = this.props.getVar(this.props.type.target).type.name;
      headerName += " " + this.props.getVar(this.props.type.target).name;
    }
    if(this.props.type.name === "Set") {// Variable setter
      this.props.type.inputs[1].type = this.props.getVar(this.props.type.target).type.name;
      headerName += " " + this.props.getVar(this.props.type.target).name;
    }

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
        onClick={e => this.handleClick(e)}
        style={style}
        ref={divElem => {
          if(this.divElement === undefined)
            this.props.needRepaint();//repaint once mounted for the first time
          this.divElement = divElem;
        }}
        >
        <div className="Node-header">{headerName}</div>
        <div className="Node-body">
          <div className="Node_inputs">
            {this.props.type.inputs.map(
              input => (
                <Input
                  type={getVarType(input.type)}
                  name={input.name}
                  zoomLevel={this.props.zoomLevel}
                  needRepaint={this.props.needRepaint}
                  nodePosX={this.state.posX}
                  nodePosY={this.state.posY}
                  setDraggedObject={this.props.setDraggedObject}
                  getDraggedObject={this.props.getDraggedObject}
                  connectorId={inId}
                  key={inId++}
                  ref={connector => {
                    if(connector)
                      this.inputs[connector.props.connectorId] = connector;
                  }}
                  parent={this}
                />
              ))}
          </div>
          <div className="Node_outputs">
            {this.props.type.outputs.map(
              output => (
                <Output
                  type={getVarType(output.type)}
                  name={output.name}
                  zoomLevel={this.props.zoomLevel}
                  needRepaint={this.props.needRepaint}
                  nodePosX={this.state.posX}
                  nodePosY={this.state.posY}
                  setDraggedObject={this.props.setDraggedObject}
                  getDraggedObject={this.props.getDraggedObject}
                  connectorId={outId}
                  key={outId++}
                  ref={connector => {
                    if(connector)
                      this.outputs[connector.props.connectorId] = connector;
                  }}
                  parent={this}
                />
              ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Node;
