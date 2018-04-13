/* eslint-disable */
import * as NodeTypes from './Nodes';

var nodeTypeNames = [];

describe('Node types', () => {
  Object.entries(NodeTypes).forEach(category => {
    describe('Category ' + category[0], () => {
      Object.values(category[1]).forEach(type => {
        it("should have a unique name", () => {
          expect(nodeTypeNames.includes(type.name)).toEqual(false);
          nodeTypeNames.push(type.name);
        });
      });
    });
  });
});
