/* @flow */
import App from '../App';

export default (app : App) => {
  var obj = {};
  /*****Vars*****/
  obj.vars = {};
  app.state.vars.forEach((v, i) => {// for each var
    if(v.enabled !== false) {// taking only the enabled ones
      // we simply assign the different objects
      obj.vars[i] = {};
      obj.vars[i].name = v.name;
      obj.vars[i].type = v.type.name;
      obj.vars[i].value = v.value;
    }
  });
  /*****Nodes*****/
  obj.nodes = {};
  app.state.nodes.forEach((n, i) => {// for each node (n is NodeType)
    if(app.mapContainer.nodes[i].state.enabled === true) {// is the node enabled
      obj.nodes[i] = {};
      obj.nodes[i].type = n.name;// node type
      obj.nodes[i].inputs = {};
      obj.nodes[i].outputs = {};
      n.inputs.forEach((input, j) => {
        obj.nodes[i].inputs[j] =
          app.mapContainer.nodes[i].inputs[j].connectedTo.map(output => {
            return {
              nodeKey : output.props.parent.props.nodeKey,
              connectorId : output.connectorId,
            };
          });
      });
      n.outputs.forEach((output, j) => {
        obj.nodes[i].outputs[j] =
          app.mapContainer.nodes[i].outputs[j].connectedTo.map(input => {
            return {
              nodeKey : input.props.parent.props.nodeKey,
              connectorId : input.connectorId,
            };
          });
      });
    }
  });

  return JSON.stringify(obj);
}
