/* eslint-disable no-undef */
import * as NodeTypes from './Nodes';

var nodeTypeNames = [];

describe('Node types', () => {
  Object.entries(NodeTypes).forEach(category => {
    describe('Category ' + category[0], () => {
      Object.values(category[1]).forEach(type => {
        describe('Node ' + type.name, () => {
          it("Should have a unique name", () => {
            expect(nodeTypeNames.includes(type.name)).toEqual(false);
            nodeTypeNames.push(type.name);
          });
          var inputNames = [];
          it("Should have unique inputs names", () => {
            var b = true;
            type.inputs.forEach(i => {
              b = b && inputNames.includes(i.name) === false;
              inputNames.push(i.name);
            });// check for duplicates
            expect(b).toEqual(true);
          });
          var outputNames = [];
          it("Should have unique outputs names", () => {
            var b = true;
            type.outputs.forEach(i => {
              b = b && outputNames.includes(i.name) === false;
              outputNames.push(i.name);
            });// check for duplicates
            expect(b).toEqual(true);
          });
        });
      });
    });
  });
});
