import { computed, Ref } from "vue";

import { ActionDescription, Encounter, Initiatives, InitWithId, MonsterInitiative } from "@/types/Initiative";
import * as i from "./initiativeHelpers";

export const PartyNamePrefix = "party";
export const MonsterNamePrefix = "monster";

export function usePrefixes(prefix: Ref<string, string>) {
  const GroupNamePrefix = computed(() => prefix.value + "-");
  const FullPrefix = computed(() => i.makeKey(GroupNamePrefix.value + "-"));

  return { GroupNamePrefix, FullPrefix };
}

export function newEntry(entryId: number): InitWithId {
  return {
    id: entryId++,
    order: 0,
    name: "",
    conditions: {},
  };
}


const xpByCr = [0, 25, 50, 100, 200, 450, 700, 1100, 1800, 2300, 2900, 3900, 5000, 5900, 7200, 8400, 10000, 11500, 13000, 15000, 18000, 20000,
  22000, 25000, 33000, 41000, 50000, 62000, 75000, 90000, 105000, 120000, 135000, 155000];

export function crToIndex(cr: string) {
  if (cr === "0") return 0;
  if (cr === "1/8") return 1;
  if (cr === "1/4") return 2;
  if (cr === "1/2") return 3;
  return parseInt(cr) + 4;
}

export function indexToCr(index: number) {
  if (index === 0) return "0";
  if (index === 1) return "1/8";
  if (index === 2) return "1/4";
  if (index === 3) return "1/2";
  return (index - 4).toString();
}

export function crToXp(cr: string) {
  const index = crToIndex(cr);
  return xpByCr[index];
}

const diceRegex = /(\d*)(d\d+)/g;

function* getDiceInAction(action: ActionDescription) {
  for (const match of action.desc.matchAll(diceRegex)) {
    const count = match[1] || 1;
    const sides = match[2];
    yield { count: +count, sides: sides };
  }
}

function* getDiceInActions(actions: ActionDescription[] | undefined) {
  if (actions?.length) {
    for (const action of actions) {
      yield* getDiceInAction(action);
    }
  }
}

function* getMonsterDice(monster: MonsterInitiative) {
  yield* getDiceInActions(monster.actions);
  yield* getDiceInActions(monster.bonusActions);
  yield* getDiceInActions(monster.reactions);
  yield* getDiceInActions(monster.legendaryActions);
}

export function getEncounterDice(monsters: Encounter) {
  const maxSides: { [key: string]: number | undefined } = {};

  for (const monster of monsters) {
    for (const dice of getMonsterDice(monster)) {
      const currentCount = maxSides[dice.sides] ?? 0;
      if (dice.count > currentCount) {
        maxSides[dice.sides] = dice.count;
      }
    }
  }

  // object iteration is insertion order
  // re-insert all properties into a new object in sorted order
  const sides = Object.keys(maxSides);
  sides.sort((a, b) => +b.substring(1) - +a.substring(1));

  const sortedResult: { [key: string]: number | undefined } = {};
  for (const s of sides) {
    sortedResult[s] = maxSides[s];
  }

  return sortedResult;
}

export function filterToMonsters(group: Initiatives) {
  return group.filter(maybeMonster => maybeMonster.cr != null) as (InitWithId & { cr: number })[];
}

if (import.meta.vitest) {
  const { describe, expect, test } = import.meta.vitest

  describe("encounterHelper in-source", () => {

    test('getDiceInAction', () => {
      const action = { name: "", desc: "asdfas4d6dfasdf3d12asdf" };
      const actual = [...getDiceInAction(action)];

      expect(actual.length).toBe(2);
      expect(actual[0]).toStrictEqual({ sides: "d6", count: 4 });
      expect(actual[1]).toStrictEqual({ sides: "d12", count: 3 });
    });

    test('getDiceInActions', () => {
      const actions = [
        { name: "", desc: "asdfd6asdf3d12" },
        { name: "", desc: "fdsa3d6fdsa2d8" }
      ];
      const actual = [...getDiceInActions(actions)];

      expect(actual.length).toBe(4);
      expect(actual[0]).toStrictEqual({ sides: "d6", count: 1 });
      expect(actual[1]).toStrictEqual({ sides: "d12", count: 3 });
      expect(actual[2]).toStrictEqual({ sides: "d6", count: 3 });
      expect(actual[3]).toStrictEqual({ sides: "d8", count: 2 });
    });

    test('getDiceInActions', () => {
      const actions = [
        { name: "", desc: "d6" },
        { name: "", desc: "3d12" },
        { name: "", desc: "3d6" },
        { name: "", desc: "2d8" }
      ];
      const actual = [...getDiceInActions(actions)];

      expect(actual.length).toBe(4);
      expect(actual[0]).toStrictEqual({ sides: "d6", count: 1 });
      expect(actual[1]).toStrictEqual({ sides: "d12", count: 3 });
      expect(actual[2]).toStrictEqual({ sides: "d6", count: 3 });
      expect(actual[3]).toStrictEqual({ sides: "d8", count: 2 });
    });

    test('getMonsterDice', () => {
      const monster = {
        id: 0,
        name: "",
        order: 0,
        conditions: {},
        cr: "0",
        actions: [
          { name: "", desc: "3d6" },
          { name: "", desc: "4d12" },
        ]
      };
      const actual = [...getMonsterDice(monster)];

      expect(actual.length).toBe(2);
      expect(actual[0]).toStrictEqual({ sides: "d6", count: 3 });
      expect(actual[1]).toStrictEqual({ sides: "d12", count: 4 });
    });
  });

}
