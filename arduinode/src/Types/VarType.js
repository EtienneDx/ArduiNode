/* @flow */
import execUnplugged from '../resources/Exec_Unplugged.png';
import execPlugged from '../resources/Exec_Plugged.png';

const EXEC = "Execution";
const PIN = "Pin";
export default {
  EXEC,
  PIN
};

export type VarType = 'Execution' | 'Pin';

function getUnpluggedImageForType(type : VarType) {
  switch (type) {
    case EXEC:
      return execUnplugged;
    case PIN:

      break;
    default:

      break;
  }
}

function getPluggedImageForType(type : VarType) {
  switch (type) {
    case EXEC:
      return execPlugged;
    case PIN:

      break;
    default:

      break;
  }
}

function getColorForType(type : VarType) {
  switch (type) {
    case EXEC:
      return "white";
    case PIN:

      break;
    default:

      break;
  }
}

export {
  getUnpluggedImageForType,
  getPluggedImageForType,
  getColorForType,
}
