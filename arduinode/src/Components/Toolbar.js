/* @flow */
import React, { Component } from 'react';

import type { HTMLInputElement } from 'flow';

import { NodeTypeList, Input, Output } from './';
import { NodeTypes } from '../Types';

type Props = {
  addNode : Function,
}

type State = {
  query : string,
  actualId : number,
  draggedFrom ?: Input | Output,
}

class Toolbar extends Component<Props, State> {

  query : HTMLInputElement;

  state = {
    query : "",
    actualId : 0,
    draggedFrom : null
  }

  getAllNodes() {
    var allNodes = [];
    Object.entries(NodeTypes).filter(d => d[0] !== "Vars").forEach((data) => // key = data[0], value = data[1]
      allNodes = allNodes.concat(data[1])
    )
    return allNodes;
  }

  getValidNodes() {
    return this.getAllNodes()
      .filter(n => {
        if(this.state.draggedFrom instanceof Input) {// $FlowFixMe
          return n.outputs.some(o => o.type === this.state.draggedFrom.props.type.name);
        }
        else if(this.state.draggedFrom instanceof Output) {// $FlowFixMe
          return n.inputs.some(i => i.type === this.state.draggedFrom.props.type.name);
        }
        return true;
      })
      .filter(n => this.state.query.toLowerCase().split(" ")// $FlowFixMe
        .every(v => n.name.toLowerCase().split(" ")
          .some(v2 => v2.includes(v))));// this sorting function is fat but seems rather adequate for now
  }

  openFromDrag(from : Input | Output, x : number, y : number) {
    this.setState({ draggedFrom : from, query : "", actualId : 0 }, () => {
      this.query.focus();
    });
  }

  clearQuery() {
    this.setState({ query : "", actualId : 0, draggedFrom : null });
  }

  onKeyDown(key : string) {
    const validNodes = this.getValidNodes();
    if(key === "ArrowDown") {
      this.setState({ actualId : Math.min(this.state.actualId + 1, validNodes.length - 1) });
    } else if(key === "ArrowUp") {
      this.setState({ actualId : Math.max(this.state.actualId - 1, 0) });
    } else if(key === "Enter" && (this.state.query !== "" || this.state.draggedFrom !== null)) {
      const n = validNodes[this.state.actualId];
      this.props.addNode(n, this.state.draggedFrom);
      this.clearQuery();
    } else if(key ==="Escape") {
      this.clearQuery();
    }
  }

  render() {
    var i = 0;
    return (
      <div className="Toolbar">
        Toolbar<br/>
        <input
          type="text"
          value={this.state.query}
          onChange={e => this.setState({ query : e.target.value, actualId : 0 })}
          onKeyDown={e => this.onKeyDown(e.key)}
          ref={e => this.query = e}
          placeholder="Search &#128269;"
          onClick={e => e.stopPropagation()}
        ></input>
        {
          this.state.query === "" && this.state.draggedFrom === null ?// @TODO would it be better to always filter and hide categories? / have checkbox option?
            Object.entries(NodeTypes).filter(d => d[0] !== "Vars").map((data) => (// key = data[0], value = data[1]
              <NodeTypeList name={data[0]} data={data[1]} key={i++} addNode={n => this.props.addNode(n, null)} query={this.state.query} />
            )) :
            (
              <ul className="Toolbar-List">
                {
                  this.getValidNodes().map(n => (
                    <li
                      key={i}
                      onClick={e => {
                        e.stopPropagation();
                        this.props.addNode(n, null);
                      }}
                      style={this.state.actualId === i++ ? {textDecoration : "underline"} : {}}
                    >{/* $FlowFixMe */}
                      {n.name}
                    </li>
                  ))
                }
              </ul>
            )
        }
      </div>
    );
  }
}

export default Toolbar;
