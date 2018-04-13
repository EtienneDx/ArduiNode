import React, { Component } from 'react';

import '../../css/App.css';

type Props = {
  name : string,
  value : string,
  onChange : Function,
}

class NumInput extends Component<Props> {

  getDisplayString(o : string) {
    return o.charAt(0).toUpperCase() + o.toLowerCase().replace("_", " ").slice(1);
  }

  render() {
    return (
      <div>
        <label>{this.getDisplayString(this.props.name)}</label>
        <input
          type="number"
          value={this.props.value}
          onChange={e => this.props.onChange(e.target.value)}
        >
        </input>
      </div>
    );
  }
}

export default NumInput;