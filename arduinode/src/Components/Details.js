/* @flow */
import React, { Component } from 'react';

import '../css/App.css';

import { VarTypes } from '../Types';

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
    switch (this.state.inspected.getObject().type) {
      case VarTypes.Pin:
        // $FlowFixMe
        this.state.inspected.setObject(Object.assign({},
          // $FlowFixMe
          this.state.inspected.getObject(),
          { value : { pin : 0,  mode : "INPUT" } },
        ));

        this.setState({ value : { pin : 0, mode : "INPUT" } });
        break;
      case VarTypes.Bool:
        // $FlowFixMe
        this.state.inspected.setObject(Object.assign({},
          // $FlowFixMe
          this.state.inspected.getObject(),
          { value : false },
        ));

        this.setState({ value : false });
        break;
      case VarTypes.Int:
        // $FlowFixMe
        this.state.inspected.setObject(Object.assign({},
          // $FlowFixMe
          this.state.inspected.getObject(),
          { value : 0 },
        ));

        this.setState({ value : 0 });
        break;
      default:

    }
  }

  renderVariable() {//getObject is a variable

    var formComplement;
    // $FlowFixMe
    switch (this.state.inspected.getObject().type) {
      case VarTypes.Pin:
        formComplement = (
          <div>
            <label>Pin number :</label>
            <input
              type="text"
              name="varVal"
              value={this.state.value && this.state.value.pin ? this.state.value.pin : 0}
              onChange={(e) => {
                // $FlowFixMe
                this.state.inspected.setObject(Object.assign({},
                  // $FlowFixMe
                  this.state.inspected.getObject(),
                  { value : { pin : e.target.value,  mode : this.state.value.mode } },
                ));

                this.setState({ value : { pin : e.target.value, mode : this.state.value.mode } });
              }}
            >
            </input><br/>
            <label>Pin mode : </label>
            <select
              name="pinMode"
              // $FlowFixMe
              value={this.state.value.mode}
              onChange={(e) => {
                // $FlowFixMe
                this.state.inspected.setObject(Object.assign({},
                  // $FlowFixMe
                  this.state.inspected.getObject(),
                  { value : { mode : e.target.value, pin : this.state.value.pin } },
                ));

                this.setState({ value : { mode : e.target.value, pin : this.state.value.pin } });
              }}
            >
              <option value="INPUT">Input</option>
              <option value="OUTPUT">Output</option>
              <option value="INPUT_PULLUP">Input Pullup</option>
            </select>
          </div>
        );
        break;
      case VarTypes.Bool:
        formComplement = (
          <div>
            <label htmlFor="varVal">Value :</label>
            <input
              type="checkbox"
              id="varVal"
              checked={this.state.value}
              onChange={(e) => {
                // $FlowFixMe
                this.state.inspected.setObject(Object.assign({},
                  // $FlowFixMe
                  this.state.inspected.getObject(),
                  {
                    value : e.target.checked,
                  },
                ));

                this.setState({value : e.target.checked});
              }}
            >
            </input>
          </div>
        );
        break;
      case VarTypes.Int:
        formComplement = (
          <div>
            <label>Value :</label>
            <input
              type="number"
              name="varVal"
              value={this.state.value}
              onChange={(e) => {
                // $FlowFixMe
                this.state.inspected.setObject(Object.assign({},
                  // $FlowFixMe
                  this.state.inspected.getObject(),
                  { value : e.target.value },
                ));

                this.setState({ value : e.target.value });
              }}
            >
            </input>
          </div>
        );
        break;
      default:
        break;
    }

    var i = 0;
    return (
      <form>
        <label htmlFor="varType">Type :
          <select
            name="varType"
            // $FlowFixMe
            value={this.state.inspected.getObject().type.name}
            onChange={(e) => {
              const type = VarTypes.getVarType(e.target.value);

              // $FlowFixMe
              this.state.inspected.setObject(Object.assign({},
              // $FlowFixMe
                this.state.inspected.getObject(),
                {
                  type
                },
              ));

              this.setState({});

              this.typeChanged();
            }}
          >
            {
              Object.values(VarTypes).filter(type => type !== VarTypes.Exec && type !== VarTypes.getVarType).map(type => (

                // $FlowFixMe
                <option value={type.name} key={i++}>{type.name}</option>
              ))
            }
          </select>
        </label>
        <label htmlFor="varName">Name :
          <input
            type="text"
            name="varName"
            value={this.state.name}
            onChange={(e) => {
              // $FlowFixMe
              this.state.inspected.setObject(Object.assign({},
              // $FlowFixMe
                this.state.inspected.getObject(),
                {
                  name : e.target.value,
                },
              ));
              this.setState({name : e.target.value});
            }}
            >
          </input>
        </label><br/>
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
