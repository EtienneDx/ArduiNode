/* @flow */
import type { VarType } from './';

type Variable = {
  type : VarType,
  name : string,
  isArray : boolean,
  value : Object,
}
export type {
  Variable,
}
