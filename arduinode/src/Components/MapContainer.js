/* @flow */

import * as React from 'react';
import ContainerDimensions from 'react-container-dimensions';

import { Node } from './';

import type { HTMLDivElement, HTMLCanvasElement, SyntheticDragEvent, SyntheticWheelEvent, CanvasRenderingContext2D } from 'flow';

const minZoomLevel = 0;
const maxZoomLevel = 5;

const zoomCorrespondances = [1, 0.8, 0.6, 0.5, 0.4, 0.3];

type State = {
  mouseStartX : number,
  mouseStartY : number,
  startPosX : number,
  startPosY : number,
  posX : number,
  posY : number,
  zoomLevel : number,
}

type Props = {
  children?: React.Node,
}

class MapContainer extends React.Component<Props, State> {
  state = {
    mouseStartX: 0,
    mouseStartY: 0,
    startPosX: 50,
    startPosY: 50,
    posX: -2000,
    posY: -2000,
    zoomLevel: 1,
  };

  container : HTMLDivElement;
  frame : HTMLDivElement;
  canvas : HTMLCanvasElement;
  nodes : Array<Node> = Array();

  handleDragStart(e : SyntheticDragEvent<HTMLDivElement>) {
    this.setState({
      mouseStartX: e.clientX,
      mouseStartY: e.clientY,
      startPosX: this.state.posX,
      startPosY: this.state.posY,
    });
    // hide preview, moving in real time
    let crt = this.container.cloneNode();
    crt.style.display = 'none';
    e.dataTransfer.setDragImage(crt, 0, 0);
  }

  handleDrag(e : SyntheticDragEvent<HTMLDivElement>) {
    this.setState({
      posX: this.state.startPosX + (e.clientX - this.state.mouseStartX) / zoomCorrespondances[this.state.zoomLevel],
      posY: this.state.startPosY + (e.clientY - this.state.mouseStartY) / zoomCorrespondances[this.state.zoomLevel],
    });
  }

  handleScroll(e : SyntheticWheelEvent<HTMLDivElement>) {
    const dY = e.deltaY;
    if (dY === 0) return;
    this.setState((actualState) => ({
      zoomLevel: Math.max(minZoomLevel, Math.min(maxZoomLevel, actualState.zoomLevel + (dY > 0 ? 1 : -1))),
    }));
  }

  componentDidMount() {
    var context = this.canvas.getContext('2d');
    this.paintCanvas(context);
  }

  componentDidUpdate() {
    var context = this.canvas.getContext('2d');
    context.clearRect(0, 0, 200, 200);
    this.paintCanvas(context);
  }

  paintCanvas(context : CanvasRenderingContext2D) {
    // @TODO implement 'gotta be repaint'

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    this.nodes.forEach(node => {
      if(node !== null)
      {
        node.inputs.forEach(i => {
          if(i !== null) i.paint(context)
        });
        node.outputs.filter(o => o !== null && o.state.isBeingDragged).forEach(o => o.paint(context));
      }
    });
    /*React.Children.toArray(this.props.children).filter(c => c.type == Node)
      .forEach((elem) => {
        React.Children.toArray(elem.props.children).filter(ch => ch.type == Input || ch.type == Output)
          .forEach((connector) => connector.paint(context));
      })*/
    /*context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(2500, 2500);
    context.lineWidth = 1;
    context.strokeStyle = '#ff0000';
    context.stroke();*/
  }

  render() {
    const realZoom = zoomCorrespondances[this.state.zoomLevel];
    let style = {
      left: this.state.posX,
      top: this.state.posY,
      zoom: realZoom,
      MozTransform: 'scale(' + realZoom.toString() + ')',
    };
    console.log(this.container);
    const childrenWithProps = this.container !== undefined ? React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        zoomLevel: realZoom,
        ref: n => this.nodes.push(n),
        width: this.container.clientWidth,
        height: this.container.clientHeight
      })) : null;
      console.log(childrenWithProps);
    return (
      <div className="MapContainer">
        MapContainer
        <div className="MapContainer-frame" ref={(frame) => this.frame = frame}>
          <div
            className="MapContainer-container"
            draggable="true"
            onDragStart={(e) => this.handleDragStart(e)}
            onDrag={(e) => this.handleDrag(e)}
            onDragEnd={(e) => this.handleDrag(e)}
            ref={(container) => this.container = container}
            onWheel={(e) => this.handleScroll(e)}
            style={style}
            >
            <canvas ref={canvas => this.canvas = canvas} className="MapContainer-canvas" width={5000} height={5000}></canvas>
              {childrenWithProps}
          </div>
        </div>
      </div>
    );
  }
}

export default MapContainer;
