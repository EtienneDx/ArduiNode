/* @flow */
import App from '../App';

import { VarTypes } from '../Types';

import type NodeType from '../Types';

const codeTemplate =
`/*
* Code genrated with ArduiNode, a system created by Etienne Desrousseaux
* Date : <<date>>
*/

/*****Includes*****/
<<imports>>

/*****Var definitions*****/
<<var_defines>>

/*****Code*****/
<<nodes>>`;
const importTemplate = `#include <<import>>
`;

var nodeVars = [];

export default (app : App) => {
  console.log("Starting translation into code"); // eslint-disable-line
  var code = codeTemplate;

  /***Basic infos***/
  code = code.replace('<<date>>', new Date().toString());

  /***Imports***/
  code = code.replace("<<imports>>", getImports(app));

  /***Vars definitions***/
  code = code.replace("<<var_defines>>", getVarDefines(app));

  /***Nodes***/
  code = code.replace("<<nodes>>", getNodes(app));

  /***Vars setup***/
  code = code.replace("<<vars_setup>>", getVarsSetup(app));

  /***we're done***/
  console.log("generated code :\n", code);// eslint-disable-line
  return code;
}

/*******************Imports*******************/
function getImports(app : App) {
  var ret = "";
  var imports = [];
  // imports from vars
  app.state.vars.forEach(v => {
    if(v.enabled !== false) {
      if(typeof v.type.imports === "string")
        imports.push(v.type.imports);
      else if(Array.isArray(v.type.imports))
        imports = imports.concat(v.type.imports);
    }
  });
  // imports from nodes
  app.state.nodes.forEach(n => {
    if(n.enabled !== false) {
      if(typeof n.imports === "string")
        imports.push(n.imports);
      else if(Array.isArray(n.imports))
        imports = imports.concat(n.imports);
    }
  });
  imports = imports.filter(function(item, pos) {
      return imports.indexOf(item) === pos;
  });// we remove duplicates

  imports.forEach(imp => ret += importTemplate.replace("<<import>>", imp));

  return ret;
}

/******************Vars******************/
function getVarDefines(app : App) {
  var ret = "";
  var varNames = [];
  /***Global user vars***/
  app.state.vars.filter(v => v.enabled !== false).forEach(v => {
    const name = v.name.replace(" ", "_");
    varNames.push(name);
    var s = v.type.definition
      .replace("<<name>>",  name);
    s = replaceObject("value", v.value, s);
    ret += s;
  });
  /***Global nodes vars***/
  app.state.nodes.forEach((n, i) => {
    if(Array.isArray(n.globalVars)) {
      nodeVars[i] = {};
      n.globalVars.forEach(v => {
        var na = v.name.replace(" ", "_");
        if(varNames.includes(na)) {
          var j = 0;
          while (varNames.includes(na + j))
            j++;
            na = na + j;
        }
        nodeVars[i][v.name] = na;
        varNames.push(na);
        ret += v.type + " " + na + ";\n";
      })
    } else if (typeof n.globalVars === "object") {
      var na = n.globalVars.name.replace(" ", "_");
      if(varNames.includes(na)) {
        var j = 0;
        while (varNames.includes(na + j))
          j++;
          na = na + j;
      }
      nodeVars[i] = na;
      varNames.push(na);
      ret += n.globalVars.type + " " + na + ";\n";
    }
  });
  return ret;
}

function getVarsSetup (app : App) {
  var ret = "";
  app.state.vars.filter(v => v.enabled !== false).forEach(v => {
    if(typeof v.type.setupDefinition === "string") {
      const name = v.name.replace(" ", "_");
      var s = v.type.setupDefinition
        .replace("<<name>>",  name);
      s = replaceObject("value", v.value, s);
      ret += s;
    }
  });
  return ret;
}

/***********Nodes***********/
function getNodes(app : App) {
  var ret = "";
  app.state.nodes.filter((n, i) => n.isStartupPoint === true && app.mapContainer.nodes[i].state.enabled === true)
    .forEach((n, i) => {
      ret += processNode(app, n, i);
    });

  return ret;
}

function processNode(app : App, n : NodeType, i : number) : string {
  var s = n.becomes;
  s = replaceInputs(app, n, i, s);
  s = replaceOutputs(app, n, i, s);
  if(n.name === "Get" || n.name === "Set") {
    const target = app.mapContainer.nodes[i].props.type.target;
    s = s.replace("<<var>>", app.state.vars[target].name.replace(" ", "_"));
  }
  return s;
}

function replaceInputs (app : App, n : NodeType, nId : number, into : string) : string {
  n.inputs.forEach((input, i) => {
      if(input.type !== VarTypes.Exec.name)// only NON Exec inputs
        into = into.replace("<<inputs:" + input.name + ">>", findInputValue(app, nId, i));
    });

  return into;
}

function replaceOutputs (app : App, n : NodeType, nId : number, into : string) : string {
  n.outputs.forEach((output, i) => {
      if(output.type === VarTypes.Exec.name) {// Only Exec outputs
        const outV = findOutputValue(app, nId, i);
        into = into.replace("<<outputs:" + output.name + ">>", outV);
        if(outV === "") {
          const regex = new RegExp("<<outputs:" + output.name + "\\?>>.*?<<\\/outputs:" + output.name + "\\?>>", "s");
          into = into.replace(regex, "");
        }
        else {
          into = into.replace("<<outputs:" + output.name + "?>>", "")
                  .replace("<</outputs:" + output.name + "?>>", "");
        }
      }
    });

  return into;
}

function findInputValue(app : App, nId : number, inId : number) : string {
  const input = app.mapContainer.nodes[nId].inputs[inId];
  if(Array.isArray(input.connectedTo) && input.connectedTo.length === 1) {// there's one connection
      const outId = input.connectedTo[0].props.connectorId;
      if(input.connectedTo[0].props.parent.props.type.needsExecution === false)
        return processNode(app,
          input.connectedTo[0].props.parent.props.type,
          input.connectedTo[0].props.parent.props.nodeKey);
      else {
        var bec = input.connectedTo[0].props.parent.props.type.outputs[outId].becomes;
        return replaceGlobalVars(bec, input.connectedTo[0].props.parent);
      }
    }
  return "null";// if the node isn't connected
}

function findOutputValue(app : App, nId : number, outId : number) : string {
  if(Array.isArray(app.mapContainer.nodes[nId].outputs[outId].connectedTo) &&
    app.mapContainer.nodes[nId].outputs[outId].connectedTo.length === 1) {// there's one connection
      return processNode(app,
        app.mapContainer.nodes[nId].outputs[outId].connectedTo[0].props.parent.props.type,
        app.mapContainer.nodes[nId].outputs[outId].connectedTo[0].props.parent.props.nodeKey);
    }
  return "";
}

function replaceGlobalVars(into, node) {
  var gVars = {};
  if(typeof node.props.type.globalVars === "object") {
    gVars[node.props.type.globalVars.name] = nodeVars[node.props.nodeKey][node.type.globalVars.name];
  } else if (Array.isArray(node.props.type.globalVars)) {
    node.props.type.globalVars.forEach(v => {
      gVars[v.name] = nodeVars[node.props.nodeKey][v.name];
    });
  }
  return replaceObject("globalVars", gVars, into);
}

/***********Utils***********/

/// actualPath is the "path" to the actual object, formatted like "path:to:object"
function replaceObject(actualPath : string, obj : any, into : string) : string {
  if(typeof obj === "object")
    Object.entries(obj).forEach(data => {
      into = replaceObject(actualPath + ":" + data[0], data[1], into);
    });
  else// it isn't an object
    return into.replace("<<" + actualPath + ">>", obj);
  return into;
}
