import * as LanguagesModules from './LanguagesModules';

global.VarTypes = {};// object of Arrays
global.NodeTypes = {};

const LoadJsonFile(file : string, cb : Function) {
  var rawFile = new XMLHttpRequest();// eslint-disable-line
  rawFile.onload = function ()
  {
      if(rawFile.readyState === 4)
      {
          if(rawFile.status === 200 || rawFile.status === 0)
          {
              const allText = rawFile.responseText;
              try {
                const jsonData = JSON.parse(allText);
                cb(jsonData);
              } catch (e) {
                console.error(e); //eslint-disable-line
              }
          }
      }
  }
  rawFile.onerror = function (e) {
    console.error(rawFile.statusText, e);
  };
  rawFile.open("GET", file, false);//sync
  rawFile.send(null);
}

const LanguageLoader = (id : string, then : Function) => {// sync since app requires the language loaded
  global.VarTypes = {};
  global.NodeTypes = {};

  if(typeof LanguagesModules[id] === "object" && LanguagesModules[id] !== null) {
    Object.entries(LanguagesModules[id].VarTypes)
      .forEach(kv : [string, any] =>
        LoadJsonFile("./Languages/" + id + "/VarTypes/" + data[1],
          (data) => global.VarTypes[kv[0]] = data
        )
      );
    Object.entries(LanguagesModules[id].NodeTypes)
      .forEach(kv : [string, any] =>
        LoadJsonFile("./Languages/" + id + "/NodeTypes/" + data[1],
          (data) => global.NodeTypes[kv[0]] = data
        )
      );
  } else {
    console.error("unknown langage" + id +", loading default (arduino) instead");
    LanguageLoader("arduino", then);
  }
}

export default LanguageLoader;
