import React, { Component } from 'react';

import { VarTypes, getVarType } from '../../Types';

import '../../css/App.css';

type Props = {
  name : string,
  value : string,
  onChange : Function,
}

class SelectInput extends Component<Props> {

  getDisplayString(o : string) {
    return o.charAt(0).toUpperCase() + o.toLowerCase().replace("_", " ").slice(1);
  }

  render() {
    var typeOptions = [];
    Object.values(VarTypes).forEach(category => // $FlowFixMe
      Object.values(category).filter(type => type !== VarTypes.Basics.Exec).forEach(type => typeOptions.push(type)));
    return (
      <div onClick={e => e.stopPropagation()} className="input-container">
        <label className="input-label">{this.getDisplayString(this.props.name)}</label>
        <div className="input-field">
          <img src={getVarType(this.props.value).pluggedImage} alt=""></img>
          <select
            value={this.props.value}
            onChange={e => this.props.onChange(e.target.value)}
          >
            {
              typeOptions.map((o, i) => (
                <option value={o.name} key={i}>{this.getDisplayString(o.name)}</option>
              ))
            }
          </select>
        </div>
      </div>
    );
  }
}

export default SelectInput;
