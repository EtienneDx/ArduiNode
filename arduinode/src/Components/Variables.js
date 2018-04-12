import React, { Component } from 'react';

import { Var } from './';
import { VarTypes, NodeTypes } from '../Types';

import type { HTMLUListElement, SyntheticMouseEvent } from 'flow';
import type { Variable } from '../Types';

import '../css/App.css';

type Props = {
  setDetails : Function,
  addNode : Function,
  vars : Array<Variable>,
  refresh : Function,
}

class Variables extends Component<Props> {

  list : HTMLUListElement;

  newVar(e : SyntheticMouseEvent) {
    var v = {
      type : VarTypes.Pin,
      name : "new var",
      isArray : false,
      value : { pin : 0, mode : "INPUT" },
    };
    this.props.vars.push(v);
    this.props.refresh();
  }

  render() {
    return (
      <div className="Variables">
        Variables&nbsp;&nbsp;&nbsp;&nbsp;
        <button onClick={e => this.newVar(e)}>+</button>
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
                    this.props.setDetails({
                      setObject : obj => {
                        obj.changed = true;
                        // eslint-disable-next-line
                        this.props.vars[i] = obj;
                        this.props.refresh();// refresh
                      },//function to use to set changed data
                      getObject : () => this.props.vars[i],//get original object
                      objectType : "Variable",//type of object
                    })
                  }}
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
