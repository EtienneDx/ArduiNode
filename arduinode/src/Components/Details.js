/* @flow */
import React, { Component } from 'react';

import '../css/App.css';

import { VarTypes, getVarType } from '../Types';
import { TextInput, NumInput, BoolInput, SelectInput } from './Inputs';

type T = {
  getObject : Function,
  setObject : Function,
  objectType : string,
}

type State = {
  name : string,
  value : any,
  inspected : ?T,
}

class Details extends Component<null, State> {

  state = {
    name : "",
    value : {},
    inspected : null,
  }

  setInspected(obj : ?T) {
    if(obj) {
      this.setState({
        name : obj.getObject().name,
        value : obj.getObject().value,
        inspected : obj,
      });
    }
    else
      this.setState({
        name : "",
        value : {},
        inspected : null,
      });
  }

  typeChanged() {
    // $FlowFixMe
    this.state.inspected.setObject(Object.assign({},
      // $FlowFixMe
      this.state.inspected.getObject(),// $FlowFixMe
      { value : this.state.inspected.getObject().type.defaultValue },
    ));
    // $FlowFixMe
    this.setState({ value : this.state.inspected.getObject().type.defaultValue });
  }

  getObjectInputs(obj : any, valueId : any) {
    const onChange = v => {
      var value = this.state.value;
      if(valueId === null) {
        value = v;
      } else {
        value[valueId] = v;
      }
      // $FlowFixMe
      this.state.inspected.setObject(Object.assign({},
        // $FlowFixMe
        this.state.inspected.getObject(),
        { value },
      ));

      this.setState({ value });
    };
    const realVal = valueId === null ? this.state.value : this.state.value[valueId];
    const name = valueId === null ? "Value : " : valueId + " : ";
    if(typeof obj === "string" && obj === "string") {
      return (<TextInput name={name} value={realVal} onChange={onChange} key={valueId} />);
    } else if(typeof obj === "string" && obj === "number") {
      return (<NumInput name={name} value={realVal} onChange={onChange} key={valueId} />);
    } else if(typeof obj === "string" && obj === "boolean") {
      return (<BoolInput name={name} value={realVal} onChange={onChange} key={valueId} />);
    } else if(Array.isArray(obj)) {
      return (<SelectInput name={name} value={realVal} onChange={onChange} options={obj} key={valueId} />)
    } else if(typeof obj === "object" && valueId === null) {
      return (
        <div>
          {
            Object.entries(obj).map(data => this.getObjectInputs(data[1], data[0]))
          }
        </div>
      )
    }
  }

  renderVariable() {//getObject is a variable
    // $FlowFixMe
    const valueFormat = this.state.inspected.getObject().type.valueFormat;
    const formComplement = this.getObjectInputs(valueFormat, null);

    var typeOptions = [];
    Object.values(VarTypes).forEach(category => // $FlowFixMe
      Object.values(category).filter(type => type !== VarTypes.Basics.Exec).forEach(type => typeOptions.push(type.name)));
    return (
      <form>
        <SelectInput
          name="Type : "
          value={// $FlowFixMe
            this.state.inspected.getObject().type.name
          }
          onChange={(v) => {
            const type = getVarType(v);

            // $FlowFixMe
            this.state.inspected.setObject(Object.assign({},
            // $FlowFixMe
              this.state.inspected.getObject(),
              {
                type
              },
            ));
            this.typeChanged();
          }}
          options={typeOptions}
        />
        <TextInput
          name="Name : "
          value={this.state.name}
          onChange={v => {
            // $FlowFixMe
            this.state.inspected.setObject(Object.assign({},
              // $FlowFixMe
              this.state.inspected.getObject(),
              { name : v },
            ));
            this.setState({ name : v });
          }}
        />
        {formComplement}
      </form>
    )
  }

  renderInspected() {
    if(this.state.inspected)
    {
    // $FlowFixMe
      switch (this.state.inspected.objectType.toLowerCase()) {
        case "variable":
          return this.renderVariable();
        default:

      }
    }
  }

  render() {
    return (
      <div className="Details">
        <span>Details</span>
        <br/><br/>
        {this.renderInspected()}
      </div>
    );
  }
}

export default Details;
