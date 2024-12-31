import { describe, expect, test } from "vitest";
import { addOrReplaceIfBetter, addPlusDamage, appendList, crToPb, formatDamage, formatDescription, getSizeNumber, increaseSize, intToWord, modifyBlindSight, modifyDarkvision, notMagic, stringToCr } from "../../../../src/components/initiative/templates/utils";
import { Size } from "../../../../src/utils/Open5e";
import Dice from "../../../../src/utils/Dice";
import { Action } from "../../../../src/utils/Attack";

describe("initiative/templates/utils", () => {

  test.each([
    ["0", 0],
    ["1/8", 1 / 8],
    ["1/4", 1 / 4],
    ["1/2", 1 / 2],
    ["1", 1],
    ["30", 30]
  ])("stringToCr '%s' == %s", (cr: string, expected: number) => {
    const actual = stringToCr(cr);
    expect(actual).toBeCloseTo(expected, 3);
  });

  describe("crToPb", () => {
    test.each([
      [0, 2],
      [1 / 8, 2],
      [1 / 4, 2],
      [1 / 2, 2],
      [1, 2],
      [2, 2],
      [3, 2],
      [4, 2],
      [5, 3],
      [6, 3],
      [7, 3],
      [8, 3],
      [9, 4],
      [10, 4],
      [11, 4],
      [12, 4],
      [13, 5],
      [14, 5],
      [15, 5],
      [16, 5],
      [17, 6],
      [18, 6],
      [19, 6],
      [20, 6],
      [21, 7],
      [22, 7],
      [23, 7],
      [24, 7],
      [25, 8],
      [26, 8],
      [27, 8],
      [28, 8],
      [29, 9],
      [30, 9]
    ])("crToPb(%s): %s", (cr: string | number, expected: number) => {
      const actual = crToPb(cr);
      expect(actual).toBe(expected);
    });

    test.each([
      ["0", 2],
      ["1/8", 2],
      ["1/4", 2],
      ["1/2", 2],
      ["1", 2],
      ["2", 2],
      ["3", 2],
      ["4", 2],
      ["5", 3],
      ["6", 3],
      ["7", 3],
      ["8", 3],
      ["9", 4],
      ["10", 4],
      ["11", 4],
      ["12", 4],
      ["13", 5],
      ["14", 5],
      ["15", 5],
      ["16", 5],
      ["17", 6],
      ["18", 6],
      ["19", 6],
      ["20", 6],
      ["21", 7],
      ["22", 7],
      ["23", 7],
      ["24", 7],
      ["25", 8],
      ["26", 8],
      ["27", 8],
      ["28", 8],
      ["29", 9],
      ["30", 9],
    ])("crToPb('%s'): %s", (cr: string | number, expected: number) => {
      const actual = crToPb(cr);
      expect(actual).toBe(expected);
    });

    test("crToPb(undefined): 0", () => {
      const expected = 0;
      const actual = crToPb(undefined);
      expect(actual).toBe(expected);
    });

  });

  test.each([
    ["Tiny", 1, "Small"],
    ["Small", 1, "Medium"],
    ["Medium", 1, "Large"],
    ["Large", 1, "Huge"],
    ["Huge", 1, "Gargantuan"],
    ["Gargantuan", 1, "Titanic"],
    ["Titanic", 1, "Titanic"],

    ["Tiny", 2, "Medium"],
    ["Small", 2, "Large"],
    ["Medium", 2, "Huge"],
    ["Large", 2, "Gargantuan"],
    ["Huge", 2, "Titanic"],
    ["Gargantuan", 2, "Titanic"],
    ["Titanic", 2, "Titanic"],
  ] as [Size, number, Size][])("increaseSize('%s', %s): %s", (size: Size, steps: number, expected: Size) => {
    const actual = increaseSize(size, steps);
    expect(actual).toBe(expected);
  })

  test.each([
    ["Tiny", 0],
    ["Small", 1],
    ["Medium", 2],
    ["Large", 3],
    ["Huge", 4],
    ["Gargantuan", 5],
    ["Titanic", 6]
  ] as [Size, number][])("getSizeNumber('%s'): %s", (size: Size, expected: number) => {
    const actual = getSizeNumber(size);
    expect(actual).toBe(expected);
  });

  test("formatDamage", () => {
    const expected = "8 (2d6+1) slashing damage";
    const actual = formatDamage("", 8, new Dice(2, 6, 1), "slashing");
    expect(actual).toBe(expected);
  });

  test.each(
    [[1, "one"], [2, "two"], [3, "three"], [4, "four"], [5, "five"], [6, "six"], [7, "seven"], [8, "eight"], [9, "nine"]]
  )("intToWord(%s): '%s'", (n: number, expected: string) => {
    const actual = intToWord(n);
    expect(actual).toBe(expected);
  });

  describe("formatDescription", () => {

    test("Melee Weapon Attack", () => {
      const expected = "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 12 (2d6+5) piercing damage.";
      const attack: Action = {
        isMelee: true,
        isRanged: false,
        isWeapon: true,
        isSpell: false,
        toHitBonus: 8,
        reach: 5,
        numberTargets: 1,
        damageAverage: 12,
        damageDice: new Dice(2, 6, 5),
        damageType: "piercing"
      }

      const actual = formatDescription(attack);
      expect(actual).toBe(expected);
    });

    test("Ranged Weapon Attack", () => {
      const expected = "Ranged Weapon Attack: +3 to hit, range 20/60 ft., one target. Hit: 5 (2d4) acid damage.";
      const attack: Action = {
        isMelee: false,
        isRanged: true,
        isWeapon: true,
        isSpell: false,
        toHitBonus: 3,
        range: 20,
        rangeMax: 60,
        numberTargets: 1,
        damageAverage: 5,
        damageDice: new Dice(2, 4, 0),
        damageType: "acid"
      }

      const actual = formatDescription(attack);
      expect(actual).toBe(expected);
    });

    test("Melee or Ranged Weapon Attack", () => {
      const expected = "Melee or Ranged Weapon Attack: +13 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 10 (d6+7) piercing damage.";
      const attack: Action = {
        isMelee: true,
        isRanged: true,
        isWeapon: true,
        isSpell: false,
        toHitBonus: 13,
        reach: 5,
        range: 20,
        rangeMax: 60,
        numberTargets: 1,
        damageAverage: 10,
        damageDice: new Dice(1, 6, 7),
        damageType: "piercing"
      }

      const actual = formatDescription(attack);
      expect(actual).toBe(expected);
    });

    test("Ranged Spell Attack", () => {
      const expected = "Ranged Spell Attack: +8 to hit, range 120 ft., one target. Hit: 14 (3d6+4) psychic damage.";
      const attack: Action = {
        isMelee: false,
        isRanged: true,
        isWeapon: false,
        isSpell: true,
        toHitBonus: 8,
        range: 120,
        numberTargets: 1,
        damageAverage: 14,
        damageDice: new Dice(3, 6, 4),
        damageType: "psychic"
      }

      const actual = formatDescription(attack);
      expect(actual).toBe(expected);
    });

    test("Plus Damage", () => {
      const expected = "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 7 (d8+3) bludgeoning damage plus 28 (8d6) fire damage.";
      const attack: Action = {
        isMelee: true,
        isRanged: false,
        isWeapon: true,
        isSpell: false,
        toHitBonus: 8,
        reach: 5,
        numberTargets: 1,
        damageAverage: 7,
        damageDice: new Dice(1, 8, 3),
        damageType: "bludgeoning",
        plusDamageAverage: 28,
        plusDamageDice: new Dice(8, 6, 0),
        plusDamageType: "fire"
      }

      const actual = formatDescription(attack);
      expect(actual).toBe(expected);
    });

    test("Two Handed Ranged", () => {
      const expected = "Melee or Ranged Weapon Attack: +8 to hit, reach 15 ft. or range 20/60 ft., one target. Hit: 15 (3d6+5) piercing damage plus 2 (d4) poison damage, or 18 (3d8+5) piercing damage plus 2 (d4) poison damage if used with two hands to make a melee attack.";
      const attack: Action = {
        isMelee: true,
        isRanged: true,
        isWeapon: true,
        isSpell: false,
        toHitBonus: 8,
        reach: 15,
        range: 20,
        rangeMax: 60,
        numberTargets: 1,
        damageAverage: 15,
        damageDice: new Dice(3, 6, 5),
        damageType: "piercing",
        plusDamageAverage: 2,
        plusDamageDice: new Dice(1, 4, 0),
        plusDamageType: "poison",
        twoHandedDamageAverage: 18,
        twoHandedDamageDice: new Dice(3, 8, 5),
        twoHandedDamageType: "piercing"
      }

      const actual = formatDescription(attack);
      expect(actual).toBe(expected);
    });

  });

  describe("Add Plus Damage", () => {

    test("addPlusDamage - Existing Better", () => {
      const action: Action = {
        isMelee: false,
        isRanged: false,
        isWeapon: false,
        isSpell: false,
        toHitBonus: 0,
        numberTargets: 0,
        damageAverage: 0,
        damageDice: new Dice(1, 4, 0),
        damageType: "",
        plusDamageAverage: 10,
        plusDamageDice: new Dice(1, 20, 0),
        plusDamageType: "slashing"
      };

      const newPlus = new Dice(1, 6, 0);
      const newPlusDamageType = "piercing";

      addPlusDamage(action, newPlus, newPlusDamageType);

      expect.soft(action.plusDamageAverage).toBe(10);
      expect.soft(action.plusDamageDice).toStrictEqual(new Dice(1, 20, 0));
      expect.soft(action.plusDamageType).toBe("slashing");
    });

    test("addPlusDamage - Replaced", () => {
      const action: Action = {
        isMelee: false,
        isRanged: false,
        isWeapon: false,
        isSpell: false,
        toHitBonus: 0,
        numberTargets: 0,
        damageAverage: 0,
        damageDice: new Dice(1, 4, 0),
        damageType: "",
        plusDamageAverage: 2,
        plusDamageDice: new Dice(1, 4, 0),
        plusDamageType: "slashing"
      };

      const newPlus = new Dice(1, 8, 0);
      const newPlusDamageType = "piercing";

      addPlusDamage(action, newPlus, newPlusDamageType);

      expect.soft(action.plusDamageAverage).toBe(4);
      expect.soft(action.plusDamageDice).toStrictEqual(new Dice(1, 8, 0));
      expect.soft(action.plusDamageType).toBe("piercing");
    });

    test("addPlusDamage - No Base Plus", () => {
      const action: Action = {
        isMelee: false,
        isRanged: false,
        isWeapon: false,
        isSpell: false,
        toHitBonus: 0,
        numberTargets: 0,
        damageAverage: 0,
        damageDice: new Dice(1, 4, 0),
        damageType: "",
      };

      const newPlus = new Dice(1, 8, 0);
      const newPlusDamageType = "piercing";

      addPlusDamage(action, newPlus, newPlusDamageType);

      expect.soft(action.plusDamageAverage).toBe(4);
      expect.soft(action.plusDamageDice).toStrictEqual(new Dice(1, 8, 0));
      expect.soft(action.plusDamageType).toBe("piercing");
    });

  });

  describe("addOrReplaceIfBetter", () => {

    test("addOrReplaceIfBetter - Existing Better", () => {
      const expected = "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 7 (d8+3) bludgeoning damage plus 28 (8d6) fire damage.";
      const actions: { name: string, desc: string }[] = [
        { name: "AttackAction", desc: expected }
      ];

      const newAction = { name: "AttackAction", desc: "new attack description" };
      const newAttack: Action = {
        isMelee: true,
        isRanged: false,
        isWeapon: true,
        isSpell: false,
        toHitBonus: 0,
        numberTargets: 0,
        damageAverage: 2,
        damageDice: new Dice(1, 4, 0),
        damageType: "slashing"
      };

      addOrReplaceIfBetter(actions, newAction, newAttack);

      expect(actions[0].desc).toBe(expected);
    });

    test("addOrReplaceIfBetter - Replaced", () => {
      const expected = "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 7 (d8+3) bludgeoning damage plus 28 (8d6) fire damage.";
      const actions: { name: string, desc: string }[] = [
        { name: "AttackAction", desc: "old attack description" }
      ];

      const newAction = { name: "AttackAction", desc: expected };
      const newAttack: Action = {
        isMelee: true,
        isRanged: false,
        isWeapon: true,
        isSpell: false,
        toHitBonus: 8,
        reach: 5,
        numberTargets: 1,
        damageAverage: 7,
        damageDice: new Dice(1, 8, 3),
        damageType: "bludgeoning",
        plusDamageAverage: 28,
        plusDamageDice: new Dice(8, 6, 0),
        plusDamageType: "fire"
      };

      addOrReplaceIfBetter(actions, newAction, newAttack);

      expect(actions[0].desc).toBe(expected);
    });

    test("addOrReplaceIfBetter - No Existing", () => {
      const expected = "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 7 (d8+3) bludgeoning damage plus 28 (8d6) fire damage.";
      const actions: { name: string, desc: string }[] = [];

      const newAction = { name: "AttackAction", desc: expected };
      const newAttack: Action = {
        isMelee: true,
        isRanged: false,
        isWeapon: true,
        isSpell: false,
        toHitBonus: 8,
        reach: 5,
        numberTargets: 1,
        damageAverage: 7,
        damageDice: new Dice(1, 8, 3),
        damageType: "bludgeoning",
        plusDamageAverage: 28,
        plusDamageDice: new Dice(8, 6, 0),
        plusDamageType: "fire"
      };

      addOrReplaceIfBetter(actions, newAction, newAttack);

      expect(actions[0].desc).toBe(expected);
    });

  });

  test.each([
    ["Bite", "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 12 (2d6 + 5) piercing damage.", true],
    ["Telepathic Summon", "One creature within 90 feet makes a DC 16 Wisdom saving throw. On a failure, it must use its reaction, if available, to move up to its speed toward the aboleth by the most direct route that avoids hazards, not avoiding opportunity attacks. This is a magical charm effect.", false],
    ["Psychic Bolt", "Ranged Spell Attack: +8 to hit, range 120 ft., one target. Hit: 14 (3d6+4) psychic damage.", false],
    ["Command (1st-Level; V)", "One living creature within 60 feet that the naga can see and that can hear and understand it makes a DC 16 Wisdom saving throw. On a failure  the target uses its next turn to move as far from the naga as possible  avoiding hazardous terrain.", false],
    ["Spellcasting", "The acolyte is a 1st-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 12, +4 to hit with spell attacks). The acolyte has following cleric spells prepared:\\n\\n* Cantrips (at will): light, sacred flame, thaumaturgy\\n* 1st level (3 slots): bless, cure wounds, sanctuary", false],
    ["Sacred Flame (Cantrip; V, S)", "One creature the acolyte can see within 60 feet makes a DC 12 Dexterity saving throw  taking 4 (1d8) radiant damage on a failure. This spell ignores cover.", false]
  ])("notMagic - %s", (name: string, desc: string, expected: boolean) => {
    const ability = { name, desc };

    const actual = notMagic(ability);
    expect(actual).toBe(expected);
  });

  test.each([
    ["passive perception 14", 15, "darkvision 15 ft."],
    ["darkvision 30 ft., passive perception 14", 15, "darkvision 30 ft."],
    ["darkvision 30 ft., passive perception 14", 60, "darkvision 60 ft."],
  ])("modifyDarkvision - '%s' %s", (senses: string, distance: number, expected: string) => {
    const actual = modifyDarkvision(senses, distance);
    expect(actual).toContain(expected);
  });

  test.each([
    ["passive perception 14", 15, "blindsight 15 ft."],
    ["blindsight 30 ft., passive perception 14", 15, "blindsight 30 ft."],
    ["blindsight 30 ft., passive perception 14", 60, "blindsight 60 ft."],
  ])("modifyBlindSight - '%s' %s", (senses: string, distance: number, expected: string) => {
    const actual = modifyBlindSight(senses, distance);
    expect(actual).toContain(expected);
  });

  describe("appendList", () => {

    test.each([
      ["", "poison", "poison"],
      ["poison", "poison", "poison"],
      ["fire", "poison", "fire, poison"],
      ["", "fatigue, poisoned", "fatigue, poisoned"],
      ["fire", "fatigue, poisoned", "fire, fatigue, poisoned"],
      ["fatigue", "fatigue, poisoned", "fatigue, poisoned"],
      ["poisoned", "fatigue, poisoned", "poisoned, fatigue"],
      ["fatigue, poisoned", "fatigue, poisoned", "fatigue, poisoned"]
    ])("appendList(string) - '%s' '%s'", (list: string, toAppend: string, expected: string) => {

      const actual = appendList(list, toAppend);
      expect(actual).toBe(expected);
    });

    test.each([
      ["", ["poison"], "poison"],
      ["poison", ["poison"], "poison"],
      ["fire", ["poison"], "fire, poison"],
      ["", ["fatigue", "poisoned"], "fatigue, poisoned"],
      ["fire", ["fatigue", "poisoned"], "fire, fatigue, poisoned"],
      ["fatigue", ["fatigue", "poisoned"], "fatigue, poisoned"],
      ["poisoned", ["fatigue", "poisoned"], "poisoned, fatigue"],
      ["fatigue, poisoned", ["fatigue", "poisoned"], "fatigue, poisoned"]
    ])("appendList(string[]) - '%s' '%s", (list: string, toAppend: string[], expected: string) => {

      const actual = appendList(list, toAppend);
      expect(actual).toBe(expected);
    });
  });

});