/* @flow */
import * as VarTypes from './Vars';
import anyUnplugged from '../resources/Obj_Unplugged.png';
import anyPlugged from '../resources/Obj_Plugged.png';

// Refer to wiki for more infos
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
  if(type === "any") {
    return {
      name : "any",
      pluggedImage : anyPlugged,
      unpluggedImage : anyUnplugged,
      color : objectColor,
    };
  }
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
