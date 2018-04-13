/* eslint-disable */
import * as VarTypes from './Vars';
import { getVarType } from './';

var varTypeNames = [];

describe('Var types', () => {
  Object.entries(VarTypes).forEach(category => {
    describe('Category ' + category[0], () => {
      Object.values(category[1]).forEach(type => {
        it("should have a unique name", () => {
          expect(varTypeNames.includes(type.name)).toEqual(false);
          varTypeNames.push(type.name);
        });

        it("should return '" + type.name + "' category", () => {
          expect(getVarType(type.name)).toEqual(type);
        });
      });
    });
  });
});
