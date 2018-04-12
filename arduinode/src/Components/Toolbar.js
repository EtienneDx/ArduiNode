/* @flow */
import React, { Component } from 'react';

import { NodeTypeList } from './';
import { NodeTypes } from '../Types';

type Props = {
  addNode : Function,
}

class Toolbar extends Component<Props> {
  render() {
    var i = 0;
    return (
      <div className="Toolbar">
        Toolbar<br/>
        {
          Object.entries(NodeTypes).filter(d => d[0] !== "Vars").map((data) => (// key = data[0], value = data[1]
            <NodeTypeList name={data[0]} data={data[1]} key={i++} addNode={n => this.props.addNode(n)}/>
          ))
        }
      </div>
    );
  }
}

export default Toolbar;
