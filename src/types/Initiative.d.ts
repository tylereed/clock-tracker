import Conditions from "./Conditions";

export type InitiativeActionKey = "actions" | "bonusActions" | "reactions" | "legendaryActions" | "traits";

export type InitKey = string & { __TYPE__: "InitKey" };

export default interface Initiative {
  open5eId?: string;
  name: string;
  order: number;
  dex?: number;
  ac?: number;
  maxHp?: number;
  hp?: number;
  conditions: Conditions;
  level?: number;
  cr?: string;
  traits?: ActionDescription[];
  actions?: ActionDescription[];
  bonusActions?: ActionDescription[];
  reactions?: ActionDescription[];
  legendaryActions?: ActionDescription[];
  saves?: { str: number, dex: number, con: number, int: number, wis: number, cha: number };
  [key: InitiativeActionKey]: ActionDescription[] | undefined;
}

export interface ActionDescription {
  name: string;
  desc: string;
}

export type InitWithId = Initiative & { id: number };
export type MonsterInitiative = InitWithId & { cr: string };
export type Initiatives = InitWithId[];
export type Encounter = MonsterInitiative[];

export interface InitiativeColumns {
  hasInitiative: boolean,
  hasDex: boolean,
  hasName: boolean,
  hasAc: boolean,
  hasMaxHp: boolean,
  hasHp: boolean,
  hasCr: boolean,
  hasLevel: boolean,
  hasConditions: boolean,
  hasEdit: boolean
}