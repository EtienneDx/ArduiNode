/* @flow */
import * as VarTypes from './Vars';

export type VarType = {
  name : string,// name of the type of var
  imports : ?(Array<string> | string),
  pluggedImage : any,
  unpluggedImage : any,
  color : any,
  definition : string,
  setupDefinition ?: string,
  defaultValue : any,
  valueFormat : any,
}
export type Variable = {
  name : string,// name of the var
  value : any,
  type : VarType,
}

export const objectColor = "#1969a6";

function getVarType(type : string) {
  var ret;
  Object.values(VarTypes).forEach(category => {// check into each category
    Object.values(category).forEach(vtype => {// and into each type
      // $FlowFixMe
      if(vtype.name === type)// and return the first type that correspond to the name
        ret = vtype;
    });
  });
  return ret;
}

export {
  VarTypes,
  getVarType,
}
