import React, { Component } from 'react';

import { Var } from './';
import { getVarType, NodeTypes } from '../Types';

import type { HTMLUListElement, SyntheticMouseEvent } from 'flow';
import type { Variable } from '../Types';

import '../css/App.css';

type Props = {
  setDetails : Function,
  getDetails : Function,
  addNode : Function,
  vars : Array<Variable>,
  refresh : Function,
}

class Variables extends Component<Props> {

  list : HTMLUListElement;

  newVar(e : SyntheticMouseEvent) {
    var v = {
      type : getVarType("Pin"),
      name : "new var",
      isArray : false,
      value : Object.assign({}, getVarType("Pin").defaultValue),
    };
    this.props.vars.push(v);
    this.props.refresh(() => {
      this.setDetails(this.props.vars.length - 1);
    });
  }

  setDetails(id) {
    this.props.setDetails({
      setObject : obj => {
        obj.changed = true;
        // eslint-disable-next-line
        this.props.vars[id] = obj;
        this.props.refresh();// refresh
      },//function to use to set changed data
      getObject : () => this.props.vars[id],//get original object
      objectType : "Variable",//type of object
    })
  }

  render() {
    return (
      <div className="Variables">
        Variables&nbsp;&nbsp;&nbsp;&nbsp;
        <button onClick={e => {
          e.stopPropagation();
          this.newVar(e);
        }}>+</button>
        <ul className="Variables-list" ref={e => this.list = e}>
          {this.props.vars.map((e, i) => {
            if(e.enabled === false) return null;
              return (
                <Var
                  key={i}
                  data={e}
                  remove={() => {
                    //this.state.vars.splice(i, 1);
                    this.props.vars[i].enabled = false;// eslint-disable-line
                    this.props.refresh();
                    this.props.setDetails(null);
                  }}
                  details={() => {
                    this.setDetails(i);
                  }}
                  inspected={
                    typeof this.props.getDetails() === "object" &&
                    this.props.getDetails() !== null &&
                    this.props.getDetails().getObject() === this.props.vars[i]
                  }
                  getter={() => {
                    var get = Object.assign({}, NodeTypes.Vars[0]);// clone get nodes// @TODO clean this up
                    get.target = i;
                    this.props.addNode(get);
                  }}
                  setter={() => {
                    var get = Object.assign({}, NodeTypes.Vars[1]);// clone set nodes// @TODO clean this up
                    get.target = i;
                    this.props.addNode(get);
                  }}
                />
        )})}
        </ul>
      </div>
    );
  }
}

export default Variables;
