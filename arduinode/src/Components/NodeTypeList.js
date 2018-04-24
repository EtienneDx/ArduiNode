/* @flow */
import React, { Component } from 'react';

import type { SyntheticMouseEvent } from 'flow';

import type NodeType from '../Types';

type Props = {
  name : string,
  data : Array<NodeType>,
  addNode : Function,
  query : string,
}

class Toolbar extends Component<Props> {

  addNode(e : SyntheticMouseEvent, obj : NodeType) {
    this.props.addNode(obj);// Normally no need for a copy, to see...
  }

  render() {
    var i = 0;
    return (
      <div>
        {this.props.name}<br/>
        <ul>
          {
            this.props.data.map(obj => (
              <li key={i++} onClick={e => {
                e.stopPropagation();
                this.addNode(e, obj);
              }}>
                {obj.name}
              </li>
            ))
          }
        </ul>
      </div>
    );
  }
}

export default Toolbar;
