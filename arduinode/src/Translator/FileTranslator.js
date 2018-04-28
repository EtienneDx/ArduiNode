/* @flow */
import App from '../App';
import fileDownload from 'js-file-download';

import { getVarType, getNodeType } from '../Types';

export function AppToFileTranslator (app : App, directDownload : boolean) {
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
    if(app.mapContainer.nodes[i] !== null && app.mapContainer.nodes[i].state.enabled === true) {// is the node enabled
      obj.nodes[i] = {};
      obj.nodes[i].type = n.name;// node type
      obj.nodes[i].pos = {};
      obj.nodes[i].pos.x = app.mapContainer.nodes[i].state.posX;
      obj.nodes[i].pos.y = app.mapContainer.nodes[i].state.posY;
      obj.nodes[i].defaultValue = app.mapContainer.nodes[i].state.defaultValue;
      obj.nodes[i].inputs = {};
      obj.nodes[i].outputs = {};
      if(n.name === "Get" || n.name === "Set") {
        obj.nodes[i].target = n.target;
      }
      n.inputs.forEach((input, j) => {
        obj.nodes[i].inputs[j] =
          app.mapContainer.nodes[i].inputs[j].connectedTo.map(output => {
            return {
              nodeKey : output.props.parent.props.nodeKey,
              connectorId : output.props.connectorId,
            };
          });
      });
      n.outputs.forEach((output, j) => {
        obj.nodes[i].outputs[j] =
          app.mapContainer.nodes[i].outputs[j].connectedTo.map(input => {
            return {
              nodeKey : input.props.parent.props.nodeKey,
              connectorId : input.props.connectorId,
            };
          });
      });
    }
  });

  if(directDownload === true) {
    fileDownload(JSON.stringify(obj), 'mysketch.arduinode');
  }
  return JSON.stringify(obj);
}

export function FileToAppTranslator (app : App, obj : Object) {
  console.log(obj);// eslint-disable-line
  app.state.vars = [];
  Object.entries(obj.vars).forEach((data : [string, any]) => {
    const realV = {
      type : getVarType(data[1].type),
      name : data[1].name,
      isArray : false,
      value : data[1].value,
    };
    app.state.vars[parseInt(data[0], 10)] = realV;
  });

  app.mapContainer.nodes = [];
  app.setState({ nodes : [] }, () => {// need to clear the way so that the initial positions are taken into account
    Object.entries(obj.nodes).forEach((data : [string, any]) => {
      const node = Object.assign({}, getNodeType(data[1].type));
      node.initialPosX = data[1].pos.x;
      node.initialPosY = data[1].pos.y;
      if(node.name === "Get" || node.name === "Set") {
        node.target = parseInt(data[1].target, 10);
      }
      app.state.nodes[parseInt(data[0], 10)] = node;
    });

    app.setState({}, () => {// we draw the nodes, and then connect the connectors
      Object.entries(obj.nodes).forEach((data : [string, any]) => {// data[1] is the node as defined in AppToFileTranslator
        const i = parseInt(data[0], 10);
        app.mapContainer.nodes[i].state.defaultValue = data[1].defaultValue;
        Object.entries(data[1].inputs).forEach((inputData : [string, any]) => {// inputData[1] is Array<{nodeKey : string, connectorId : string}>
          const j = parseInt(inputData[0], 10);
          const mapContainer = app.mapContainer;
          mapContainer.nodes[i].inputs[j].connectedTo =
            inputData[1].map(o => {
              return mapContainer.nodes[parseInt(o.nodeKey, 10)].outputs[parseInt(o.connectorId, 10)];
            });
        });
        Object.entries(data[1].outputs).forEach((outputData : [string, any]) => {// inputData[1] is Array<{nodeKey : string, connectorId : string}>
          const j = parseInt(outputData[0], 10);
          const mapContainer = app.mapContainer;
          mapContainer.nodes[i].outputs[j].connectedTo =
            outputData[1].map(o => {
              return mapContainer.nodes[parseInt(o.nodeKey, 10)].inputs[parseInt(o.connectorId, 10)];
            });
        });
      });
      app.setState({});// that's when we're done
    });
  });
}
