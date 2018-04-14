/* eslint-disable no-undef */
import * as VarTypes from './Vars';
import { getVarType } from './';

var varTypeNames = [];

describe('Var types', () => {
  Object.entries(VarTypes).forEach(category => {
    describe('Category ' + category[0], () => {
      Object.values(category[1]).forEach(type => {
        describe('Var Type ' + type.name, () => {
          it("Should have a unique name", () => {
            expect(varTypeNames.includes(type.name)).toEqual(false);
            varTypeNames.push(type.name);
          });

          it("Should return '" + type.name + "' category", () => {
            expect(getVarType(type.name)).toEqual(type);
          });

          it("Should have corresponding value format and default value", () => {
            if(typeof type.valueFormat === "object" || typeof type.valueFormat === "undefined")
              expect(typeof type.defaultValue).toEqual(typeof type.valueFormat);
            else if(Array.isArray(type.valueFormat))
              expect(type.valueFormat.includes(type.defaultValue)).toEqual(true);
            else
              expect(typeof type.defaultValue).toEqual(type.valueFormat);
          })
        });
      });
    });
  });
});
