import { describe, expect, test } from "vitest";
import { applyZombieTemplate } from "../../../../src/components/initiative/templates/zombie";
import { MonsterO5e } from "../../../../src/utils/Open5e";
import { expectActionSoft, expectHasActionsSoft, jsonMonster as jsonDefaultMonster } from "./helpers";
import { first } from "../../../../src/utils/helpers";
import { ZombieOptions } from "../../../../src/components/initiative/templates/types";

describe("Zombie Template", () => {

  test("applyZombieTemplate", () => {
    const monster: MonsterO5e = JSON.parse(jsonDefaultMonster);

    const actual = applyZombieTemplate(monster, {} as ZombieOptions);

    expect.soft(actual.name).toBe("Unit Test Monster Zombie");
    expect.soft(actual.size).toBe("Huge");
    expect.soft(actual.type).toBe("Undead")
    expect.soft(actual.cr).toBe(7);
    expect.soft(actual.hit_points).toBe(115);
    expect.soft(actual.hit_dice).toBe("10d12+50");

    expect.soft(actual.dexterity).toBe(6);
    expect.soft(actual.intelligence).toBe(3);
    expect.soft(actual.wisdom).toBe(8);
    expect.soft(actual.charisma).toBe(4);

    expect.soft(actual.strength_save).toBeUndefined();
    expect.soft(actual.dexterity_save).toBeUndefined();
    expect.soft(actual.constitution_save).toBeUndefined();
    expect.soft(actual.intelligence_save).toBeUndefined();
    expect.soft(actual.wisdom_save).toBeUndefined();
    expect.soft(actual.charisma_save).toBeUndefined();

    expect.soft(actual.speed.swim).toBe(30);
    expect.soft(actual.speed.burrow).toBe(10);
    expect.soft(actual.speed.walk).toBe(20);

    expectActionSoft(actual.actions, "Bite", "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 21 (3d10+5) piercing damage.");
    expectActionSoft(actual.actions, "Grab", "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 15 (3d6+5) bludgeoning damage and the target is grappled if its Medium or smaller (escape DC 16) and until the grapple ends the unit test monster zombie can't grab another target.");
    expectActionSoft(actual.actions, "Multiattack", "The unit test creature make a bite and a claw attack. The unit test monster zombie can replace one weapon attack with a bite or grab.");
    expect.soft(actual.actions).toHaveLength(4);

    const skills = Object.getOwnPropertyNames(actual.skills);
    expect.soft(skills).toHaveLength(0);

    expect.soft(actual.damage_immunities).toMatch(/poison/);
    expect.soft(actual.condition_immunities).toMatch(/fatigue/);
    expect.soft(actual.condition_immunities).toMatch(/poisoned/);

    expect.soft(actual.languages).toBe("understands the languages it knew in life but can't speak");

    expect.soft(actual.special_abilities).toHaveLength(1);
    expectActionSoft(actual.special_abilities, "Undead Nature", "A zombie doesn't require air, sustenance, or sleep.");
  });

  test("applyZombieTemplate - keep lower ability scores", () => {
    const monster: MonsterO5e = JSON.parse(jsonDefaultMonster);
    monster.dexterity = 5;
    monster.intelligence = 2;
    monster.wisdom = 7;
    monster.charisma = 3;

    const actual = applyZombieTemplate(monster, {} as ZombieOptions);

    expect.soft(actual.dexterity).toBe(5);
    expect.soft(actual.intelligence).toBe(2);
    expect.soft(actual.wisdom).toBe(7);
    expect.soft(actual.charisma).toBe(3);
  });

  test("applyZombieTemplate - max zombie walk speed", () => {
    const monster: MonsterO5e = JSON.parse(jsonDefaultMonster);
    monster.speed.walk = 90;

    const actual = applyZombieTemplate(monster, {} as ZombieOptions);

    expect.soft(actual.speed.walk).toBe(30);
  });

  test("applyZombieTemplate - ranged attacks removed", () => {
    const monster: MonsterO5e = JSON.parse(jsonDefaultMonster);
    monster.actions!.push({
      name: "Shortbow",
      desc: "Ranged Weapon Attack: +5 to hit, range 80/320 ft., one target. Hit: 6 (1d6 + 3) piercing damage."
    });

    expect(monster.actions).toHaveLength(4);

    const actual = applyZombieTemplate(monster, {} as ZombieOptions);

    const shortbow = first(actual.actions.filter(x => x.name === "Shortbow"));
    expect(shortbow).toBeNull();
  });

  test("applyZombieTemplate - legendary and bonus actions removed", () => {
    const monster: MonsterO5e = JSON.parse(jsonDefaultMonster);
    monster.legendary_actions = [{
      name: "unit test legendary action name",
      desc: "unit test legendary action desc"
    }];
    monster.bonus_actions = [{
      name: "unit test bonus action name",
      desc: "unit test bonus action desc"
    }];

    const actual = applyZombieTemplate(monster, {} as ZombieOptions);

    expect.soft(actual.legendary_actions).toHaveLength(0);
    expect.soft(actual.bonus_actions).toHaveLength(0);
  });

  test("applyZombieTemplate - darkvision increased", () => {
    const monster: MonsterO5e = JSON.parse(jsonDefaultMonster);
    monster.senses = "darkvision 10 ft., passive perception 10";

    const actual = applyZombieTemplate(monster, {} as ZombieOptions);

    expect(actual.senses).toMatch(/darkvision 60 ft./);
  });

  test("applyZombieTemplate - Infectious Bite", () => {
    const monster: MonsterO5e = JSON.parse(jsonDefaultMonster);

    const actual = applyZombieTemplate(monster, { infectiousBite: true } as ZombieOptions);

    expectActionSoft(actual.actions, "Bite", "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 21 (3d10+5) piercing damage plus 2 (d4) necrotic damage. A creature bitten by the zombie takes 2 (1d4) ongoing necrotic damage until it regains hit points or a creature makes a DC 15 Medicine check to treat the wound. If a beast, dragon, giant, humanoid, or monstrosity dies while suffering from this effect, it becomes a zombie after 1 minute, gaining the zombie template.");
    expectActionSoft(actual.actions, "Grab", "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 15 (3d6+5) bludgeoning damage and the target is grappled if its Medium or smaller (escape DC 16) and until the grapple ends the unit test monster zombie can't grab another target.");
  });

  test("applyZombieTemplate - Vile Discharge", () => {
    const monster: MonsterO5e = JSON.parse(jsonDefaultMonster);

    const actual = applyZombieTemplate(monster, { vileDischarge: true } as ZombieOptions);

    expectActionSoft(actual.actions, "Bite", "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 21 (3d10+5) piercing damage plus 2 (d4) poison damage.");
    expectActionSoft(actual.actions, "Grab", "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 15 (3d6+5) bludgeoning damage plus 2 (d4) poison damage and the target is grappled if its Medium or smaller (escape DC 16) and until the grapple ends the unit test monster zombie can't grab another target.");
    expectActionSoft(actual.actions, "Claw", "Melee Weapon Attack: +8 to hit, reach 10 ft., one target. Hit: 18 (3d8+5) bludgeoning damage plus 2 (d4) poison damage.");
  });

  test("applyZombieTemplate - Options", () => {
    const monster: MonsterO5e = JSON.parse(jsonDefaultMonster);

    const actual = applyZombieTemplate(monster, {
      infectiousBite: true,
      vileDischarge: true,
      undeadFortitude: true,
      vigorMortis: true
    } as ZombieOptions);

    expectHasActionsSoft(actual.special_abilities, "Undead Fortitude (1/Day)", "Infectious Bite", "Vile Discharge", "Vigor Mortis");
  });

});