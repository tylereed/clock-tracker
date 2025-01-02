import { describe, expect, test } from "vitest";
import { applyMerfolkTemplate } from "../../../../src/components/initiative/templates/merfolk";
import { MonsterO5e } from "../../../../src/utils/Open5e";
import { expectActionSoft, expectHasActionsSoft, jsonMonster as jsonDefaultMonster } from "./helpers";
import { MerfolkOptions } from "../../../../src/components/initiative/templates/types";

describe("Merfolk Template", () => {

  test("applyMerfolkTemplate", () => {
    const monster: MonsterO5e = JSON.parse(jsonDefaultMonster);
    monster.speed.swim = undefined!;
    monster.senses = "passive perception 15";

    const actual = applyMerfolkTemplate(monster, {} as MerfolkOptions);

    expect.soft(actual.name).toBe("Merfolk Unit Test Monster");
    expect.soft(actual.speed).toStrictEqual({ walk: 10, swim: 40 });
    expect.soft(actual.senses).toMatch(/darkvision 30 ft./);
    expect.soft(actual.languages).toMatch(/Aquan/);

    expectActionSoft(actual.actions, "Claw", "Melee Weapon Attack: +8 to hit, reach 10 ft., one target. Hit: 18 (3d8 + 5) bludgeoning damage.");
    expect(actual.bonus_actions ?? []).toHaveLength(0);
    expectHasActionsSoft(actual.special_abilities, "Amphibious");
  });

  test("applyMerfolkTemplate - Trident", () => {
    const monster: MonsterO5e = JSON.parse(jsonDefaultMonster);

    const actual = applyMerfolkTemplate(monster, { includeTrident: true } as MerfolkOptions);

    expectActionSoft(actual.actions, "Trident", "Melee or Ranged Weapon Attack: +8 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 8 (d6+5) piercing damage, or 9 (d8+5) piercing damage if used with two hands to make a melee attack.");
    expect.soft(actual.bonus_actions ?? []).toHaveLength(1);
    expectActionSoft(actual.bonus_actions, "Trident", "The merfolk makes a trident attack");
  });

});