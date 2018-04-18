/* @flow */
import * as Nodes from "./Nodes";

// Refer to wiki for more infos
export type NodeType = {
  name : string,
  inputs : Array<{
    type : string,
    name : string,
  }>,
  outputs : Array<{
    type : string,
    name : string,
    becomes : ?string,
  }>,
  needsExecution : boolean,
  becomes : string,
  globalVars : ?(Array<{type : string, name : string}> | {type : string, name : string}),//type "int" name "varName" -> so we can easily change the name
  imports : ?(Array<string> | string),
  isStartupPoint : ?boolean,
}

export default Nodes;

export function getNodeType(type : string) {
  var ret;
  Object.values(Nodes).forEach(category => {// check into each category
    Object.values(category).forEach(ntype => {// and into each type
      // $FlowFixMe
      if(ntype.name === type)// and return the first type that correspond to the name
        ret = ntype;
    });
  });
  return ret;
}
