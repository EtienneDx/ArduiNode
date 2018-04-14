/* @flow */
import type VarType from '../';

// default images for objects
import objUnplugged from '../../resources/Obj_Unplugged.png';
import objPlugged from '../../resources/Obj_Plugged.png';

const SERVO = "Servo";

const Servo : VarType = {
  name : SERVO,
  pluggedImage : objPlugged,
  unpluggedImage : objUnplugged,
  color : "#1969a6",
  imports : "<Servo.h>",
  definition : `Servo <<name>>;
`,
  setupDefinition : `<<name>>.attach(<<value:pin>>);
`,
  defaultValue: { pin : 9 },
  valueFormat : { pin : "string" },
}

export default {
  Servo,
};
