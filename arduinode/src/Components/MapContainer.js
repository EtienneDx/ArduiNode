/* @flow */

import React, { Component } from 'react';
import ContainerDimensions from 'react-container-dimensions';

import { Node, Input, Output } from './';
import { VarTypes } from '../Types';

import type { HTMLDivElement, HTMLCanvasElement, SyntheticDragEvent, SyntheticWheelEvent } from 'flow';

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

class MapContainer extends Component<null, State> {
  state = {
    mouseStartX: 0,
    mouseStartY: 0,
    startPosX: 50,
    startPosY: 50,
    posX: -4000,
    posY: -4000,
    zoomLevel: 1,
  };

  container : HTMLDivElement;
  frame : HTMLDivElement;
  canvas : HTMLCanvasElement;

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

  render() {
    const realZoom = zoomCorrespondances[this.state.zoomLevel];
    let style = {
      left: this.state.posX,
      top: this.state.posY,
      zoom: realZoom,
      MozTransform: 'scale(' + realZoom.toString() + ')',
    };
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
            <canvas ref={canvas => this.canvas = canvas} className="MapContainer-canvas"></canvas>
            <ContainerDimensions>
              <Node zoomLevel={realZoom} name="testing node">
                <Input type={VarTypes.EXEC} name="exec" />
                <Output type={VarTypes.EXEC} name="exec" />
                <Input type={VarTypes.EXEC} name="exec" />
              </Node>
            </ContainerDimensions>
          </div>
        </div>
      </div>
    );
  }
}

export default MapContainer;
