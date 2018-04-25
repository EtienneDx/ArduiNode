import React, { Component } from 'react';

import '../../css/App.css';

type Props = {
  name : string,
  value : string,
  onChange : Function,
}

class BoolInput extends Component<Props> {

  getDisplayString(o : string) {
    return o.charAt(0).toUpperCase() + o.toLowerCase().replace("_", " ").slice(1);
  }

  render() {
    return (
      <div onClick={e => e.stopPropagation()} className="input-container">
        <label className="input-label">{this.getDisplayString(this.props.name)}</label>
        <input
          type="checkbox"
          checked={this.props.value}
          onChange={e => this.props.onChange(e.target.checked)}
          className="input-field"
        >
        </input>
      </div>
    );
  }
}

export default BoolInput;
