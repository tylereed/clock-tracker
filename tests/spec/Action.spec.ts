import { describe, expect, test } from "vitest";

import { Action, parse } from "../../src/utils/Attack";
import Dice from "../../src/utils/Dice";

function assertActionEqual(a: Action | undefined, expected: Action) {
  expect(a).toBeDefined();
  const actual = a!;
  expect.soft(actual.isMelee, "isMelee").toBe(expected.isMelee);
  expect.soft(actual.isRanged, "isRanged").toBe(expected.isRanged);
  expect.soft(actual.isWeapon, "isWeapon").toBe(expected.isWeapon);
  expect.soft(actual.isSpell, "isSpell").toBe(expected.isSpell);
  expect.soft(actual.toHitBonus, "toHitBonus").toBe(expected.toHitBonus);
  expect.soft(actual.reach, "reach").toBe(expected.reach);
  expect.soft(actual.range).toBe(expected.range);
  expect.soft(actual.rangeMax).toBe(expected.rangeMax);
  expect.soft(actual.numberTargets, "numberTargets").toBe(expected.numberTargets);
  expect.soft(actual.damageAverage, "damageAverage").toBe(expected.damageAverage);
  expect.soft(actual.damageDice, "damageDice").toStrictEqual(expected.damageDice);
  expect.soft(actual.damageType, "damageType").toBe(expected.damageType);
  expect.soft(actual.plusDamageAverage, "plusDamageAverage").toBe(expected.plusDamageAverage);
  expect.soft(actual.plusDamageDice, "plusDamageDice").toStrictEqual(expected.plusDamageDice);
  expect.soft(actual.plusDamageType, "plusDamageType").toBe(expected.plusDamageType);
  expect.soft(actual.twoHandedDamageAverage, "twoHandedDamageAverage").toBe(expected.twoHandedDamageAverage);
  expect.soft(actual.twoHandedDamageDice, "twoHandedDamageDice").toStrictEqual(expected.twoHandedDamageDice);
  expect.soft(actual.twoHandedDamageType, "twoHandedDamageType").toBe(expected.twoHandedDamageType);
  expect.soft(actual.extraText, "extraText").toBe(expected.extraText);
}

describe("AttackAction", () => {

  test.each([
    // Melee Weapon
    ["Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 12 (2d6 + 5) piercing damage.",
      {
        isMelee: true,
        isRanged: false,
        isWeapon: true,
        isSpell: false,
        toHitBonus: 7,
        reach: 5,
        numberTargets: 1,
        damageAverage: 12,
        damageDice: new Dice(2, 6, 5),
        damageType: "piercing",
        extraText: "."
      }],
    // Ranged Weapon
    ["Ranged Weapon Attack: +3 to hit, range 20/60 ft., one target. Hit: 5 (2d4) acid damage and the target takes 1 acid damage at the start of its next turn unless the target immediately uses its reaction to wipe off the spit.",
      {
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
        damageType: "acid",
        extraText: " and the target takes 1 acid damage at the start of its next turn unless the target immediately uses its reaction to wipe off the spit."
      }],
    // Melee or Ranged Weapon
    ["Melee or Ranged Weapon Attack: +3 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 4 (1d6 + 1) piercing damage.",
      {
        isMelee: true,
        isRanged: true,
        isWeapon: true,
        isSpell: false,
        toHitBonus: 3,
        reach: 5,
        range: 20,
        rangeMax: 60,
        numberTargets: 1,
        damageAverage: 4,
        damageDice: new Dice(1, 6, 1),
        damageType: "piercing",
        extraText: "."
      }],
    // Ranged Spell
    ["_Ranged Spell Attack:_ +6 to hit, range 60 ft., one target. _Hit:_ 6 (1d4+4) radiant damage.",
      {
        isMelee: false,
        isRanged: true,
        isWeapon: false,
        isSpell: true,
        toHitBonus: 6,
        range: 60,
        numberTargets: 1,
        damageAverage: 6,
        damageDice: new Dice(1, 4, 4),
        damageType: "radiant",
        extraText: "."
      }],
    // Melee Spell
    ["Melee Spell Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (3d6) psychic damage.",
      {
        isMelee: true,
        isRanged: false,
        isWeapon: false,
        isSpell: true,
        toHitBonus: 5,
        reach: 5,
        numberTargets: 1,
        damageAverage: 10,
        damageDice: new Dice(3, 6, 0),
        damageType: "psychic",
        extraText: "."
      }],
    // 2 damage types
    ["Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6 + 1) bludgeoning damage plus 5 (2d4) piercing damage.",
      {
        isMelee: true,
        isRanged: false,
        isWeapon: true,
        isSpell: false,
        toHitBonus: 3,
        reach: 5,
        numberTargets: 1,
        damageAverage: 4,
        damageDice: new Dice(1, 6, 1),
        damageType: "bludgeoning",
        plusDamageAverage: 5,
        plusDamageDice: new Dice(2, 4, 0),
        plusDamageType: "piercing",
        extraText: "."
      }],
    // Versatile
    ["Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 8 (1d8 + 4) bludgeoning damage, or 9 (1d10 + 4) bludgeoning damage if used with two hands.",
      {
        isMelee: true,
        isRanged: false,
        isWeapon: true,
        isSpell: false,
        toHitBonus: 6,
        reach: 5,
        numberTargets: 1,
        damageAverage: 8,
        damageDice: new Dice(1, 8, 4),
        damageType: "bludgeoning",
        twoHandedDamageAverage: 9,
        twoHandedDamageDice: new Dice(1, 10, 4),
        twoHandedDamageType: "bludgeoning",
        extraText: "."
      }],
    // Versatile 2 damage types
    ["Melee or Ranged Weapon Attack: +2 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 3 (1d6) piercing damage plus 7 (2d6) poison damage, or 4 (1d8) piercing damage plus 7 (2d6) poison damage if used with two hands to make a melee attack.",
      {
        isMelee: true,
        isRanged: true,
        isWeapon: true,
        isSpell: false,
        toHitBonus: 2,
        reach: 5,
        range: 20,
        rangeMax: 60,
        numberTargets: 1,
        damageAverage: 3,
        damageDice: new Dice(1, 6, 0),
        damageType: "piercing",
        plusDamageAverage: 7,
        plusDamageDice: new Dice(2, 6, 0),
        plusDamageType: "poison",
        twoHandedDamageAverage: 4,
        twoHandedDamageDice: new Dice(1, 8, 0),
        twoHandedDamageType: "piercing",
        extraText: "."
      }],
    // ["",
    //   {
    //
    //   }],
  ])("Parse '%s'", (text: string, expected: Action) => {
    const actual = parse(text)!;

    assertActionEqual(actual, expected);
  });

});