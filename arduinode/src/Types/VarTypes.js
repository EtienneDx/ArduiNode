/* @flow */
import execUnplugged from '../resources/Exec_Unplugged.png';
import execPlugged from '../resources/Exec_Plugged.png';
import pinUnplugged from '../resources/Pin_Unplugged.png';
import pinPlugged from '../resources/Pin_Plugged.png';
import boolUnplugged from '../resources/Bool_Unplugged.png';
import boolPlugged from '../resources/Bool_Plugged.png';
import intUnplugged from '../resources/Int_Unplugged.png';
import intPlugged from '../resources/Int_Plugged.png';

export type VarType = {
  name : string,// name of the type of var
  imports : ?(Array<string> | string),
  pluggedImage : any,
  unpluggedImage : any,
  color : any,
  value : any,
  definition : string,
  setupDefinition ?: string,
}
export type Variable = {
  name : string,// name of the var
  value : any,
  type : VarType,
}

const EXEC = "Execution";
const PIN = "Pin";
const BOOL = "Boolean";
const INT = "Int";

const Exec : VarType = {
  name : EXEC,
  pluggedImage : execPlugged,
  unpluggedImage : execUnplugged,
  color : "white",
  imports : null,
  value : null,
  definition : "",//no defines for exec
}
const Pin : VarType = {
  name : PIN,
  pluggedImage : pinPlugged,
  unpluggedImage : pinUnplugged,
  color : "grey",
  imports : null,
  value : null,
  definition :
`#define <<name>> <<value:pin>>
`,
  setupDefinition:
`pinMode(<<name>>, <<value:mode>>);
`,
}
const Bool : VarType = {
  name : BOOL,
  pluggedImage : boolPlugged,
  unpluggedImage : boolUnplugged,
  color : "red",
  imports : null,
  value : null,
  definition :
`bool <<name>> = <<value>>;
`,
}
const Int : VarType = {
  name : INT,
  pluggedImage : intPlugged,
  unpluggedImage : intUnplugged,
  color : "#36b436",
  imports : null,
  value : null,
  definition :
`int <<name>> = <<value>>;
`,
}

function getVarType(type : string) {
  switch (type) {
    case EXEC:
      return Exec;
    case PIN:
      return Pin;
    case BOOL:
      return Bool;
    case INT:
      return Int;
    default:
      console.error("unexisting type '" + type + "'");// eslint-disable-line
  }
}

export {
  Exec,
  Pin,
  Bool,
  Int,
  getVarType,
}
