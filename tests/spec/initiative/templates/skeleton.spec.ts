import { describe, expect, test } from "vitest";
import { appplySkeletonTemplate } from "../../../../src/components/initiative/templates/skeleton";
import { MonsterO5e } from "../../../../src/utils/Open5e";
import { expectActionSoft, expectHasActionsSoft, jsonMonster as jsonDefaultMonster } from "./helpers";

describe("Merfolk Template", () => {

  test("applyMerfolkTemplate", () => {
    const monster: MonsterO5e = JSON.parse(jsonDefaultMonster);
    monster.speed.swim = undefined!;
    monster.senses = "passive perception 15";

    const actual = appplySkeletonTemplate(monster);

    expect.soft(actual.name).toBe("Unit Test Monster Skeleton");
    expect.soft(actual.type).toBe("Undead");
    expect.soft(actual.intelligence).toBe(6);
    expect.soft(actual.wisdom).toBe(8);
    expect.soft(actual.charisma).toBe(5);

    const skillList = Object.getOwnPropertyNames(actual.skills);
    expect.soft(skillList).toHaveLength(0);

    expect.soft(actual.damage_vulnerabilities).toMatch("bludgeoning");
    expect.soft(actual.damage_immunities).toMatch("poison");
    expect.soft(actual.condition_immunities).toMatch("fatigue");
    expect.soft(actual.condition_immunities).toMatch("poisoned");
    expect.soft(actual.senses).toMatch("darkvision 60 ft.");
    expect.soft(actual.languages).toBe("understands the languages it knew in life but can't speak");
    expectHasActionsSoft(actual.special_abilities, "Undead Nature");
  });

});