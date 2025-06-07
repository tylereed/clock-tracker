import { Action, parse as parseAttack } from "@/utils/Attack";
import { MonsterO5e } from "@/utils/Open5e";
import { ZombieOptions } from "../types";
import Dice from "@/utils/Dice";
import * as h from "@/utils/helpers";
import { addOrReplaceIfBetter, addPlusDamage, appendList, crToPb, formatDescription, getSizeNumber, modifyDarkvision, notMagic } from "../utils";

function* buildZombieAbilities(options: Partial<ZombieOptions>, dc: number) {

  if (options.undeadFortitude) {
    yield {
      "name": "Undead Fortitude (1/Day)",
      "desc": "If the zombie is reduced to 0 hit points by damage that isnt radiant or from a critical hit, its instead reduced to 1 hit point, falls prone, and is stunned until the end of its next turn, appearing to be dead."
    };
  }

  if (options.infectiousBite) {
    yield {
      name: "Infectious Bite",
      desc: "A creature bitten by the zombie takes 2 (1d4) ongoing necrotic damage until it regains hit points or a creature makes a DC 15 Medicine check to treat the wound. If a beast, dragon, giant, humanoid, or monstrosity dies while suffering from this effect, it becomes a zombie after 1 minute, gaining the zombie template."
    };
  }

  if (options.vileDischarge) {
    yield {
      name: "Vile Discharge",
      desc: `The zombie's melee attacks deal an extra 2 (1d4) poison damage. Additionally, when it's reduced to 0 hit points, it explodes. Creatures within 5 feet make a Dexterity saving throw against the zombie's maneuver DC (${dc}), taking 5 (2d4) poison damage on a failure.`
    };
  }

  if (options.vigorMortis) {
    yield {
      name: "Vigor Mortis",
      desc: "The zombie can take the Dash action as a bonus action. It can't do so again until it moves 0 feet on one of its turns."
    }
  }
}

export function applyZombieTemplate(stats: MonsterO5e, options: ZombieOptions): MonsterO5e  {
  const template = { ...stats };

  template.name = stats.name + " Zombie";
  const newName = template.name.toLocaleLowerCase();

  template.type = "Undead";
  template.dexterity = Math.min(stats.dexterity, 6);
  template.intelligence = Math.min(stats.intelligence, 3);
  template.wisdom = Math.min(stats.wisdom, 8);
  template.charisma = Math.min(stats.charisma, 4);

  template.strength_save = undefined;
  template.dexterity_save = undefined;
  template.constitution_save = undefined;
  template.intelligence_save = undefined;
  template.wisdom_save = undefined;
  template.charisma_save = undefined;

  for (let speedKey in stats.speed) {
    let s = stats.speed[speedKey] - 10;
    if (speedKey === "walk") {
      s = Math.min(30, s);
    }
    template.speed[speedKey] = s;
  }

  const strMod = Dice.calculateModifier(template.strength);
  const dexMod = Dice.calculateModifier(template.dexterity);
  const pb = crToPb(template.challenge_rating);
  const sizeIncrease = Math.max(0, getSizeNumber(template.size) - 2);
  const dc = 8 + pb + Math.max(strMod, dexMod);

  const biteAttackDice = new Dice(1 + sizeIncrease, 10, strMod);
  const biteAttack: Action = {
    isMelee: true,
    isRanged: false,
    isWeapon: true,
    isSpell: false,
    reach: 5,
    toHitBonus: strMod + pb,
    numberTargets: 1,
    damageAverage: biteAttackDice.Average,
    damageDice: biteAttackDice,
    damageType: "piercing"
  }
  if (options.infectiousBite) {
    const [infectiousExtra] = [...buildZombieAbilities({ infectiousBite: options.infectiousBite }, dc)];
    addPlusDamage(biteAttack, new Dice(1, 4, 0), "necrotic");
    biteAttack.extraText = ". " + infectiousExtra.desc;
  }
  if (options.vileDischarge) {
    addPlusDamage(biteAttack, new Dice(1, 4, 0), "poison");
  }
  const biteAction = { name: "Bite", desc: formatDescription(biteAttack) };

  const grabAttackDice = new Dice(1 + sizeIncrease, 6, strMod);
  const grabAttack: Action = {
    isMelee: true,
    isRanged: false,
    isWeapon: true,
    isSpell: false,
    reach: 5,
    toHitBonus: strMod + pb,
    numberTargets: 1,
    damageAverage: grabAttackDice.Average,
    damageDice: grabAttackDice,
    damageType: "bludgeoning",
    extraText: ` and the target is grappled if its Medium or smaller (escape DC ${dc}) and until the grapple ends the ${newName} can't grab another target.`
  };
  if (options.vileDischarge) {
    addPlusDamage(grabAttack, new Dice(1, 4, 0), "poison");
  }
  const grabAction = { name: "Grab", desc: formatDescription(grabAttack) };

  const [multiattack] = stats.actions?.filter(a => a.name === "Multiattack") ?? [];
  if (multiattack) {
    multiattack.desc += ` The ${newName} can replace one weapon attack with a bite or grab.`
  }

  const filteredActions = stats.actions?.filter(a => h.and(() => notMagic(a), () => a.desc.indexOf("Ranged") === -1)) ?? [];
  const oldName = new RegExp(`${stats.name}(?! zombie)`, "gi");
  for (let action of filteredActions) {
    action.desc.replaceAll(oldName, newName);
    if (options.vileDischarge) {
      const toUpdate = parseAttack(action.desc);
      if (toUpdate?.isMelee) {
        addPlusDamage(toUpdate, new Dice(1, 4, 0), "poison");
        action.desc = formatDescription(toUpdate);
      }
    }
  }
  template.actions = [
    ...filteredActions
  ];
  addOrReplaceIfBetter(template.actions, biteAction, biteAttack);
  addOrReplaceIfBetter(template.actions, grabAction, grabAttack);

  template.legendary_actions = [];
  template.bonus_actions = [];

  template.skills = {};

  template.damage_immunities = appendList(stats.damage_immunities, "poison");
  template.condition_immunities = appendList(stats.condition_immunities, "fatigue, poisoned");

  template.senses = modifyDarkvision(stats.senses, 60);

  template.languages = "understands the languages it knew in life but can't speak";

  template.special_abilities = [
    ...buildZombieAbilities(options, dc),
    {
      name: "Undead Nature",
      desc: "A zombie doesn't require air, sustenance, or sleep."
    }
  ];

  return template;
}
