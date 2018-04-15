/* @flow */

import * as React from 'react';

import { Node, Input, Output } from './';

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
  nodes : Array<Node> = [];
  needRepaint : boolean = true;
  actuallyDraggedObject : Input | Output;

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
    this.paintCanvas(this.canvas.getContext('2d'));
  }

  paintCanvas(context : CanvasRenderingContext2D) {
    if(!this.needRepaint) return;//only repaint if needed

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    this.nodes.forEach(node => {
      if(node !== null && node.enabled !== false)
      {
        node.inputs.forEach(i => {
          if(i !== null) i.paint(context)
        });
        node.outputs.filter(o => o !== null && o.state.isBeingDragged).forEach(o => o.paint(context));
      }
    });

    this.needRepaint = false;
  }

  checkConnections() {
    this.nodes.forEach(n => {
      n.check();
    });
  }

  getCenterX() {
    return -this.state.posX + (this.frame.clientWidth / 2) / zoomCorrespondances[this.state.zoomLevel];
  }

  getCenterY() {
    return -this.state.posY + (this.frame.clientHeight / 2) / zoomCorrespondances[this.state.zoomLevel];
  }

  render() {
    this.needRepaint = true;
    setTimeout(() => this.paintCanvas(this.canvas.getContext('2d')), 10);// eslint-disable-line
    const realZoom = zoomCorrespondances[this.state.zoomLevel];
    let style = {
      left: this.state.posX,
      top: this.state.posY,
      zoom: realZoom,
      MozTransform: 'scale(' + realZoom.toString() + ')',
    };
    //var id = 0;
    const childrenWithProps = this.container !== undefined ? React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        zoomLevel: realZoom,
        ref: n => {
          if(n)
            this.nodes[child.props.nodeKey] = n;//keep same index as in App
        },
        width: this.container.clientWidth,
        height: this.container.clientHeight,
        needRepaint: () => {
          this.needRepaint = true;
          //eslint-disable-next-line
          setTimeout(() => this.paintCanvas(this.canvas.getContext('2d')), 10);
        },
        setDraggedObject: obj => this.actuallyDraggedObject = obj,
        getDraggedObject : () => this.actuallyDraggedObject,
        initialPosX : typeof child.props.initialPosX === "number" ? child.props.initialPosX : this.getCenterX(),
        initialPosY : typeof child.props.initialPosY === "number" ? child.props.initialPosY : this.getCenterY(),
      })}) : null;
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
            ref={(container) => {
              const b = this.container === undefined;
              this.container = container;
              if(b)
                this.setState({});//should redraw
            }}
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
