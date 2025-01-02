import { describe, expect, test } from "vitest";
import { applySquadTemplate } from "../../../../src/components/initiative/templates/squad";
import { MonsterO5e } from "../../../../src/utils/Open5e";
import { expectActionSoft, jsonMonster } from "./helpers";

describe("Squad Template", () => {

  test("applySquadTemplate", () => {
    const monster: MonsterO5e = JSON.parse(jsonMonster);
    monster.actions?.push(
      {
        name: "Poison Ink Knife",
        desc: "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4 + 2) slashing damage plus 10 (3d6) poison damage."
      },
      {
        name: "Spear",
        desc: "Melee or Ranged Weapon Attack: +3 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 4 (1d6 + 1) piercing damage, or 5 (1d8 + 1) piercing damage if used with two hands to make a melee attack."
      });

    const actual = applySquadTemplate(monster);

    expect.soft(actual.name).toBe("Unit Test Monster Squad");
    expect.soft(actual.size).toBe("Titanic");
    expect.soft(actual.type).toBe("Group of Aberrations");
    expect.soft(actual.cr).toBe(16);
    expect.soft(actual.hit_points).toBe(575);
    expect.soft(actual.hit_dice).toBe("50d12+250");

    expectActionSoft(actual.actions, "Bites", "Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 60 (10d6+25) piercing damage or half damage if the squad is bloodied.");
    expectActionSoft(actual.actions, "Claws", "Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 92 (15d8+25) bludgeoning damage or half damage if the squad is bloodied.");
    expectActionSoft(actual.actions, "Poison Ink Knives", "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 22 (5d4+10) slashing damage plus 52 (15d6) poison damage or half damage if the squad is bloodied.");
    expectActionSoft(actual.actions, "Spears", "Melee or Ranged Weapon Attack: +5 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 22 (5d6+5) piercing damage, or 27 (5d8+5) piercing damage if used with two hands to make a melee attack or half damage if the squad is bloodied.");

    const specialAbilityNames = actual.special_abilities?.map(x => x.name) ?? [];
    expect.soft(specialAbilityNames).toContain("Area Vulnerability");
    expect.soft(specialAbilityNames).toContain("Squad Dispersal");
    expect.soft(specialAbilityNames).toContain("Squad");
  });

});