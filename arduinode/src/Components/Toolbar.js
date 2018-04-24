/* @flow */
import React, { Component } from 'react';

import { NodeTypeList } from './';
import { NodeTypes } from '../Types';

type Props = {
  addNode : Function,
}

type State = {
  query : string,
  actualId : number,
}

class Toolbar extends Component<Props, State> {

  state = {
    query : "",
    actualId : 0,
  }

  clearQuery() {
    this.setState({ query : "", actualId : 0});
  }

  onKeyDown(key : string) {
    var allNodes = [];
    Object.entries(NodeTypes).filter(d => d[0] !== "Vars").forEach((data) => // key = data[0], value = data[1]
      allNodes = allNodes.concat(data[1])
    )

    const validNodes = allNodes
      .filter(n => this.state.query.toLowerCase().split(" ")// $FlowFixMe
        .every(v => n.name.toLowerCase().split(" ")
          .some(v2 => v2.includes(v))));// this sorting function is fat but seems rather adequate for now
    if(key === "ArrowDown") {
      this.setState({ actualId : Math.min(this.state.actualId + 1, allNodes.length - 1) });
    } else if(key === "ArrowUp") {
      this.setState({ actualId : Math.max(this.state.actualId - 1, 0) });
    } else if(key === "Enter" && this.state.query !== "") {
      const n = validNodes[this.state.actualId];
      this.props.addNode(n);
      this.clearQuery();
    }
  }

  render() {
    var i = 0;
    var allNodes = [];
    Object.entries(NodeTypes).filter(d => d[0] !== "Vars").forEach((data) => // key = data[0], value = data[1]
      allNodes = allNodes.concat(data[1])
    )
    return (
      <div className="Toolbar">
        Toolbar<br/>
        <input
          type="text"
          value={this.state.query}
          onChange={e => this.setState({ query : e.target.value, actualId : 0 })}
          onKeyDown={e => this.onKeyDown(e.key)}
        ></input>
        {
          this.state.query === "" ?
            Object.entries(NodeTypes).filter(d => d[0] !== "Vars").map((data) => (// key = data[0], value = data[1]
              <NodeTypeList name={data[0]} data={data[1]} key={i++} addNode={n => this.props.addNode(n)} query={this.state.query} />
            )) :
            (
              <ul className="Toolbar-List">
                {
                  allNodes
                    .filter(n => this.state.query.toLowerCase().split(" ")// $FlowFixMe
                      .every(v => n.name.toLowerCase().split(" ")
                        .some(v2 => v2.includes(v))))
                          .map(n => (
                    <li
                      key={i}
                      onClick={() => this.props.addNode(n)}
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
