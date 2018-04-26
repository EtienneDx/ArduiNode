/* @flow */
import React, { Component } from 'react';

import '../css/App.css';

import { VarTypes, getVarType } from '../Types';
import { TextInput, NumInput, BoolInput, SelectInput, TypeSelect } from './Inputs';
import App from '../App';
import * as Examples from '../Examples';
import { FileTranslator } from '../Translator';

type T = {
  object : {
    type : Object,
    value : any,
    name : string,
  } | {
    name : string,
    defaultValue : any,
    inputs : Array<{
      type : string,
      name : string,
    }>,
  },
  objectType : string
} | null

type State = {
  inspected : T,
}

type Props = {
  app : App
}

class Details extends Component<Props, State> {

  state = {
    inspected : null,
  }

  setInspected(obj : ?T) {
    if(obj) {
      this.setState({
        inspected : obj,
      });
    }
    else
      this.setState({
        inspected : null,
      });
  }

  typeChanged() {
    if(this.state.inspected !== null) {
      // $FlowFixMe
      this.state.inspected.object.value = this.state.inspected.object.type.defaultValue;// eslint-disable-line
      this.props.app.setState({ });
    }
  }

  getObjectInputs(obj : any, valueId : any) {
    const onChange = v => {
      if(this.state.inspected !== null) {// $FlowFixMe
        var value = this.state.inspected.object.value;
        if(valueId === null) {
          value = v;
        } else {
          value[valueId] = v;
        }
        //unnecessary if object but supposidely can't harm
        // $FlowFixMe
        this.state.inspected.object.value = value;// eslint-disable-line
        this.setState({});
      }
    };
    if(this.state.inspected !== null) {// $FlowFixMe
      const realVal = valueId === null ? this.state.inspected.object.value : this.state.inspected.object.value[valueId];
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
  }

  renderVariable() {//getObject is a variable
    if(this.state.inspected !== null) {
      // $FlowFixMe
      const valueFormat = this.state.inspected.object.type.valueFormat;
      const formComplement = this.getObjectInputs(valueFormat, null);

      var typeOptions = [];
      Object.values(VarTypes).forEach(category => // $FlowFixMe
        Object.values(category).filter(type => type !== VarTypes.Basics.Exec).forEach(type => typeOptions.push(type.name)));
      return (
        <form>
          <TypeSelect
            name="Type : "
            value={// $FlowFixMe
              this.state.inspected.object.type.name
            }
            onChange={(v) => {
              const type = getVarType(v);
              if(this.state.inspected !== null) {
                // $FlowFixMe
                this.state.inspected.object.type = type;// eslint-disable-line
                this.typeChanged();
              }
            }}
            options={typeOptions}
          />
          <TextInput
            name="Name : "
            value={this.state.inspected === null ? "" : this.state.inspected.object.name}
            onChange={v => {
              if(this.state.inspected !== null) {
                // eslint-disable-next-line
                this.state.inspected.object.name = v;
                this.props.app.setState({});
              }
            }}
          />
          {formComplement}
        </form>
      )
    }
  }

  readTextFile(file : string, then : Function) {
    var rawFile = new XMLHttpRequest();// eslint-disable-line
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status === 0)
            {
                var allText = rawFile.responseText;
                then(allText);
            }
        }
    }
    rawFile.send(null);
}

  renderExamples() {
    return (
      <div>
        <span>Examples</span>
        <ul>
          {Object.entries(Examples).map((data : [string, any]) => (
            <li key={data[0]}>{data[0]} <button onClick={
              e => {
                e.stopPropagation();
                this.readTextFile(data[1], json => FileTranslator.FileToAppTranslator(this.props.app, JSON.parse(json)))
              }
            }>Open</button></li>
          ))}
        </ul>
      </div>
    );
  }

  renderNodeDefVal() {
    var i = 0;
    return (
      <div className="Details-Node-Default-Value">
        <span className="name">
          {// $FlowFixMe
            this.state.inspected.object.name
          }
        </span>
        <div className="fields">
          <span>Default input values : </span>
          {
            // $FlowFixMe
            this.state.inspected.object.inputs.map(input => {
              const onChange = v => {
                // $FlowFixMe
                this.state.inspected.object.defaultValue[input.name] = v;// eslint-disable-line
                this.props.app.setState({});
              }

              var v;
              // $FlowFixMe
              switch (input.type) {
                case "Int":
                  // $FlowFixMe
                  v = this.state.inspected.object.defaultValue[input.name]
                  v = v ? v : 0;
                  return (<NumInput name={input.name} value={v} onChange={onChange} key={i++} />);
                case "Boolean":
                  // $FlowFixMe
                  v = this.state.inspected.object.defaultValue[input.name]
                  v = v ? v : false;
                  return (<BoolInput name={input.name} value={v} onChange={onChange} key={i++} />);
                default:
                  return null;
              }
            })
          }
        </div>
      </div>
    )
  }

  renderInspected() {
    if(this.state.inspected)
    {
    // $FlowFixMe
      switch (this.state.inspected.objectType.toLowerCase()) {
        case "variable":
          return this.renderVariable();
        case "examples":
          return this.renderExamples();
        case "node-default-value":
          return this.renderNodeDefVal();
        default:
          return null;
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
