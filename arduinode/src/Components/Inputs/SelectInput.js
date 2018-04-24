import React, { Component } from 'react';

import '../../css/App.css';

type Props = {
  name : string,
  value : string,
  onChange : Function,
  options : Array<string>,
}

class SelectInput extends Component<Props> {

  getDisplayString(o : string) {
    return o.charAt(0).toUpperCase() + o.toLowerCase().replace("_", " ").slice(1);
  }

  render() {
    return (
      <div onClick={e => e.stopPropagation()}>
        <label>{this.getDisplayString(this.props.name)}</label>
        <select
          value={this.props.value}
          onChange={e => this.props.onChange(e.target.value)}
        >
          {
            this.props.options.map((o, i) => (
              <option value={o} key={i}>{this.getDisplayString(o)}</option>
            ))
          }
        </select>
      </div>
    );
  }
}

export default SelectInput;
