import debounce from "debounce";

import { Command, Executor } from "@/utils/Executor";
import Initiative, { InitiativeColumns, Initiatives } from "@/types/Initiative";

export function makeKey(name?: string) {
  return name ? "inits-" + name : "inits";
}

const saveDebounced = debounce(function (key: string, toSave: Initiatives) {
  try {
    const saveData = JSON.stringify(toSave);
    localStorage.setItem(key, saveData);
  } catch (e) {
    console.error(e);
  }
}, 500);

export function saveInits(inits: Initiatives, name?: string) {
  const key = makeKey(name);
  saveDebounced(key, [...inits]);
}

export function loadInits(name?: string) {
  try {
    const key = makeKey(name);
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

export function deleteInits(name?: string) {
  const key = makeKey(name);
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
    hasConditions: false
  };

  return { ...defaultColumns, ...columns };
}