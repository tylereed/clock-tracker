import debounce from "debounce";

import Initiative, { Actions, InitiativeColumns, Initiatives, InitKey } from "@/types/Initiative";
import Dice from "@/utils/Dice";
import { Command, Executor } from "@/utils/Executor";
import { MonsterO5e } from "@/utils/Open5e";

export function makeKey(name?: string): InitKey {
  return (name ? "inits-" + name : "inits") as InitKey;
}

const saveDebounced = debounce(function (key: InitKey, toSave: Initiatives) {
  try {
    const saveData = JSON.stringify(toSave);
    localStorage.setItem(key, saveData);
  } catch (e) {
    console.error(e);
  }
}, 500);

export function saveInits(inits: Initiatives, name?: InitKey) {
  const key: InitKey = name ?? makeKey();
  saveDebounced(key, [...inits]);
}

export function loadInits(name?: InitKey) {
  try {
    const key = name ?? makeKey();
    const initJson = localStorage.getItem(key);
    if (initJson) {
      const restoredInits = JSON.parse(initJson) as Initiatives;
      if (restoredInits.length > 0) {
        for (const init of restoredInits) {
          if (!init.conditions) {
            init.conditions = {};
          }
        }

        return restoredInits;
      }
    }
  } catch (e) {
    console.error(e);
  }
  return [];
}

export function deleteInits(name?: InitKey) {
  const key = name ?? makeKey();
  localStorage.removeItem(key);
}

export function insertInitCommand(executor: Executor, initiatives: Initiatives,
  index: number, propName: keyof Initiative, newValue: any, oldValue: any,
  callback?: () => void) {

  const initiative = initiatives[index];

  if (newValue == oldValue) {
    return;
  }

  const command: Command = {
    execute: () => {
      const init = initiative as any;
      init[propName] = newValue;
      callback?.call(undefined);
    },
    undo: () => {
      const init = initiative as any;
      init[propName] = oldValue;
      callback?.call(undefined);
    }
  };
  executor.pushUndo(command);
  callback?.call(undefined);
}

export function buildInitiativeColumns(columns: Partial<InitiativeColumns>) {
  const defaultColumns: InitiativeColumns = {
    hasInitiative: false,
    hasDex: false,
    hasName: true,
    hasAc: true,
    hasMaxHp: true,
    hasHp: false,
    hasCr: false,
    hasLevel: false,
    hasConditions: false,
    hasEdit: false
  };

  return { ...defaultColumns, ...columns };
}

function* buildActions(...args: ({ name: string, desc: string }[] | undefined)[]): Generator<Actions> {

  for (const arg of args) {
    if (arg) {
      for (const a of arg) {
        yield { name: a.name, desc: a.desc };
      }
    }
  }
}

function getSave(monster: any, stat: keyof MonsterO5e) {
  return monster[stat + "_save"] ?? Dice.calculateModifier(monster[stat]);
}

export function monsterO5eToInitiative(monster: MonsterO5e, nameOverride?: string): Initiative {
  return {
    open5eId: monster.slug,
    name: nameOverride ?? monster.name,
    order: 10 + Dice.calculateModifier(monster.dexterity),
    dex: monster.dexterity,
    ac: monster.armor_class,
    maxHp: monster.hit_points,
    hp: monster.hit_points,
    cr: monster.challenge_rating,
    conditions: {},
    traits: [...buildActions(monster.special_abilities)],
    actions: [...buildActions(monster.actions)],
    bonusActions: [...buildActions(monster.bonus_actions)],
    reactions: [...buildActions(monster.reactions)],
    legendaryActions: [...buildActions(monster.legendary_actions)],
    saves: {
      str: getSave(monster, "strength"),
      dex: getSave(monster, "dexterity"),
      con: getSave(monster, "constitution"),
      int: getSave(monster, "intelligence"),
      wis: getSave(monster, "wisdom"),
      cha: getSave(monster, "charisma")
    }
  };
}