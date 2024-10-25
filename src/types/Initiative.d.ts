import Conditions from "./Conditions";

export default interface Initiative {
  name: string;
  order: number;
  dex?: number;
  ac?: number;
  maxHp?: number;
  hp?: number;
  conditions: Conditions;
  actions?: Actions[];
  bonusAction?: Actions[];
}

export interface Actions {
  name: string;
  desc: string;
}

export type InitWithId = Initiative & { id: number };
export type Initiatives = InitWithId[];

export interface InitiativeColumns {
  hasInitiative: boolean,
  hasDex: boolean,
  hasName: boolean,
  hasAc: boolean,
  hasMaxHp: boolean,
  hasHp: boolean,
  hasConditions: boolean
}