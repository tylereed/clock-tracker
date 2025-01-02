import { describe, expect, test } from "vitest";
import { applySahuaginTemplate } from "../../../../src/components/initiative/templates/sahuagin";
import { MonsterO5e } from "../../../../src/utils/Open5e";
import { expectActionSoft, expectHasActionsSoft, jsonMonster as jsonDefaultMonster } from "./helpers";

describe("Sahuagin Template", () => {

  test("applySahuaginTemplate", () => {
    const monster: MonsterO5e = JSON.parse(jsonDefaultMonster);
    monster.speed.swim = undefined!;

    const actual = applySahuaginTemplate(monster);

    expect.soft(actual.name).toBe("Sahuagin Unit Test Monster");
    expect.soft(actual.speed.swim).toBe(40);
    expect.soft(actual.senses).toMatch(/darkvision 120 ft./);
    expect.soft(actual.languages).toMatch(/Sahuagin/);

    expectActionSoft(actual.actions, "Claw", "Melee Weapon Attack: +8 to hit, reach 10 ft., one target. Hit: 18 (3d8 + 5) bludgeoning damage.");
    expectActionSoft(actual.bonus_actions, "Bite", "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 7 (d4+5) piercing damage.");
    expectHasActionsSoft(actual.special_abilities, "Blood Frenzy", "Limited Amphibiousness", "Shark Telepathy");
  });

});