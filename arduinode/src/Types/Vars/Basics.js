/* @flow */
import execUnplugged from '../../resources/Exec_Unplugged.png';
import execPlugged from '../../resources/Exec_Plugged.png';
import pinUnplugged from '../../resources/Pin_Unplugged.png';
import pinPlugged from '../../resources/Pin_Plugged.png';
import boolUnplugged from '../../resources/Bool_Unplugged.png';
import boolPlugged from '../../resources/Bool_Plugged.png';
import intUnplugged from '../../resources/Int_Unplugged.png';
import intPlugged from '../../resources/Int_Plugged.png';

const EXEC = "Execution";
const PIN = "Pin";
const BOOL = "Boolean";
const INT = "Int";

export default {
  Exec : {
    name : EXEC,
    pluggedImage : execPlugged,
    unpluggedImage : execUnplugged,
    color : "white",
    imports : null,
    value : null,
    definition : "",//no defines for exec
  },
  Pin : {
    name : PIN,
    pluggedImage : pinPlugged,
    unpluggedImage : pinUnplugged,
    color : "grey",
    definition : `#define <<name>> <<value:pin>>
`,
    setupDefinition : `pinMode(<<name>>, <<value:mode>>);
`,
    defaultValue : {
      pin : "0",
      mode : "INPUT",
    },
    valueFormat : {
      pin : "string",
      mode : ["INPUT", "OUTPUT", "INPUT_PULLUP"],
    },
  },
  Bool : {
    name : BOOL,
    pluggedImage : boolPlugged,
    unpluggedImage : boolUnplugged,
    color : "red",
    definition : `bool <<name>> = <<value>>;
`,
    defaultValue : false,
    valueFormat : "bool",
  },
  Int : {
    name : INT,
    pluggedImage : intPlugged,
    unpluggedImage : intUnplugged,
    color : "#36b436",
    definition : `int <<name>> = <<value>>;
`,
    defaultValue : 0,
    valueFormat : "number",
  },
};
