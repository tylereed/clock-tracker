import pluralize from "pluralize";

import { Action, parse as parseAttack } from "@/utils/Attack";
import Dice from "@/utils/Dice";
import * as h from "@/utils/helpers";
import { MonsterO5e, Size } from "@/utils/Open5e";

export const templates = ["Squad", "Skeleton", "Zombie"] as const;
export type TemplateType = typeof templates[number];

export interface ZombieOptions {
  undeadFortitude: boolean,
  infectiousBite: boolean,
  vileDischarge: boolean,
  vigorMortis: boolean
};

export function applyTemplate(template: TemplateType, stats: MonsterO5e, options?: ZombieOptions): MonsterO5e {
  switch (template) {
    case "Squad":
      return applySquadTemplate(stats);
    case "Skeleton":
      return appplySkeletonTemplate(stats);
    case "Zombie":
      return applyZombieTemplate(stats, options as ZombieOptions);
    default:
      throw "Unknown template: " + template;
  }
}

function increaseSquadDamage(dice: Dice) {
  const damageDice = new Dice(5 * dice.Count, dice.Sides, 5 * dice.Modifier);
  return [damageDice.Average, damageDice] as const;
}

function applySquadTemplate(stats: MonsterO5e) {
  const template = { ...stats };

  template.name = stats.name + " Squad";
  template.size = increaseSize(stats.size, 2);
  template.type = "Group of " + pluralize(stats.type);
  template.cr = Math.floor((stringToCr(stats.challenge_rating)) * 2 + 2);
  template.challenge_rating = template.cr.toString();

  template.hit_points = stats.hit_points * 5;
  if (stats.hit_dice) {
    const hit_dice = Dice.parse(stats.hit_dice);
    if (hit_dice) {
      const squad_hit_dice = new Dice(5 * hit_dice.Count, hit_dice.Sides, 5 * hit_dice.Modifier);
      template.hit_dice = squad_hit_dice.toString();
    }
  }

  if (!template.special_abilities) {
    template.special_abilities = [];
  }

  template.actions = [];
  const pbDiff = crToPb(template.cr) - crToPb(stats.cr);
  if (stats.actions) {
    for (let statAction of stats.actions) {
      const templateActionDesc = parseAttack(statAction.desc);
      if (templateActionDesc && (templateActionDesc.isWeapon || templateActionDesc.isSpell)) {
        templateActionDesc.extraText = " or half damage if the squad is bloodied" + (templateActionDesc.extraText ?? "");

        [templateActionDesc.damageAverage, templateActionDesc.damageDice] = increaseSquadDamage(templateActionDesc.damageDice);
        if (templateActionDesc.plusDamageDice) {
          [templateActionDesc.plusDamageAverage, templateActionDesc.plusDamageDice] = increaseSquadDamage(templateActionDesc.plusDamageDice);
        }
        if (templateActionDesc.twoHandedDamageDice) {
          [templateActionDesc.twoHandedDamageAverage, templateActionDesc.twoHandedDamageDice] = increaseSquadDamage(templateActionDesc.twoHandedDamageDice);
        }

        templateActionDesc.toHitBonus += pbDiff;
        template.actions.push({ name: pluralize(statAction.name), desc: formatDescription(templateActionDesc) });
      } else {
        template.actions.push({ ...statAction });
      }
    }
  }

  const creaturePlural: string = pluralize(stats.name);

  template.special_abilities.push(
    {
      name: "Area Vulnerability",
      desc: "The squad takes double damage from any effect that targets an area."
    },
    {
      name: "Squad Dispersal",
      desc: `When the squad is reduced to 0 hit points, it turns into 2 (1d4) ${creaturePlural}, each of which are bloodied.`
    },
    {
      name: "Squad",
      desc: `The squad is composed of 5 or more ${creaturePlural}. If it is subjected to a spell, attack, or other effect that affects only one target, it takes any damage but ignores other effects. It can share its space with ${stats.size} or smaller creatures or objects. The squad can move through any opening large enough for one ${stats.name} without squeezing.`
    }
  );

  return template;
}

const sizes: Size[] = ["Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan", "Titanic"];
function increaseSize(size: Size, steps: number): Size {
  let newSizeIndex = sizes.indexOf(size) + steps;
  if (newSizeIndex >= sizes.length) {
    newSizeIndex = sizes.length - 1;
  }
  return sizes[newSizeIndex];
}

function getSizeNumber(size: Size) {
  return sizes.indexOf(size);
}

function formatDamage(prefix: string, damageAverage: number, damageDice: Dice, damageType: string) {
  let text = prefix;
  text += damageAverage;

  text += " (";
  text += damageDice.toString();
  text += ") ";
  text += damageType;
  text += " damage";

  return text;
}

function formatDescription(attack: Action) {
  let result = "";

  if (attack.isMelee && attack.isRanged) {
    result += "Melee or Ranged";
  } else if (attack.isMelee) {
    result += "Melee";
  } else {
    result += "Ranged";
  }

  result += attack.isWeapon ? " Weapon" : " Spell";

  result += " Attack: +";
  result += attack.toHitBonus;
  result += " to hit, ";

  if (attack.reach) {
    result += "reach ";
    result += attack.reach;
    result += " ft.";
  }

  if (attack.reach && attack.range) {
    result += " or ";
  }

  if (attack.range) {
    result += "range ";
    result += attack.range;
    if (attack.rangeMax) {
      result += "/";
      result += attack.rangeMax;
    }
    result += " ft.";
  }

  result += ", ";

  result += intToWord(attack.numberTargets);
  result += " ";
  result += pluralize("target", attack.numberTargets);
  result += ". ";

  result += formatDamage("Hit: ", attack.damageAverage, attack.damageDice, attack.damageType);

  let plusDamage: string | null = null;
  if (attack.plusDamageAverage && attack.plusDamageDice && attack.plusDamageType) {
    plusDamage = formatDamage(" plus ", attack.plusDamageAverage, attack.plusDamageDice, attack.plusDamageType);
    result += plusDamage;
  }

  if (attack.twoHandedDamageAverage && attack.twoHandedDamageDice && attack.twoHandedDamageType) {
    result += formatDamage(", or ", attack.twoHandedDamageAverage, attack.twoHandedDamageDice, attack.twoHandedDamageType);
    if (plusDamage) {
      result += plusDamage;
    }
    result += " if used with two hands";
    if (attack.isMelee && attack.isRanged) {
      result += " to make a melee attack";
    }
  }

  result += attack.extraText ?? ".";

  return result;
}

function stringToCr(text: string) {
  if (text === "1/8") return 1 / 8;
  if (text === "1/4") return 1 / 4;
  if (text === "1/2") return 1 / 2;
  return parseInt(text);
}

const intWords = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
function intToWord(n: number) {
  return intWords[n];
}

function crToPb(cr: string): number;
function crToPb(cr?: number): number;
function crToPb(cr?: number | string) {
  if (typeof cr === "string") {
    cr = stringToCr(cr);
  }
  if (cr == null) {
    return 0;
  }
  if (cr < 5) {
    return 2;
  }
  if (cr < 9) {
    return 3;
  }
  if (cr < 13) {
    return 4;
  }
  if (cr < 17) {
    return 5;
  }
  if (cr < 21) {
    return 6;
  }
  if (cr < 25) {
    return 7;
  }
  if (cr < 29) {
    return 8;
  }
  return 9;
}

function notMagic(ability: { name: string, desc: string }): boolean {
  return ability.desc.indexOf("magic") === -1 &&
    ability.desc.indexOf("spell") === -1 &&
    ability.name !== "Spellcasting" &&
    ability.name.indexOf("-Level") === -1 &&
    ability.name.indexOf("Cantrip") === -1;
}

function appendList(current: string, toAppend: string) {
  if (!current) {
    return toAppend;
  }

  if (current.indexOf(toAppend) > -1) {
    return current;
  }

  return `${current}, ${toAppend}`;
}

function modifyDarkvision(senses: string, distance: number) {
  // looks like senses always has Passive Perception listed
  if (senses.indexOf("darkvision") === -1) {
    return `darkvision ${distance} ft., ${senses}`;
  } else {
    const result = senses.match(/darkvision (\d+) (ft\.|')/)!;
    if (parseInt(result[1]) < distance) {
      return senses.replace(/darkvision \d+ (ft\.|')/, `darkvision ${distance} ft.`);
    }
  }

  return senses; // already has darkvision at or better than distance
}

function addOrReplaceIfBetter(actions: { name: string; desc: string }[], newAction: { name: string; desc: string; }, newAttack: Action) {
  const index = actions.findIndex(a => a.name === newAction.name);
  if (index === -1) {
    actions.push(newAction);
    return;
  }

  const oldAction = actions[index];
  const oldAttack = parseAttack(oldAction.desc);

  const oldDamage = oldAttack?.damageAverage ?? 0;
  const oldPlus = oldAttack?.plusDamageAverage ?? 0;

  const newDamage = newAttack.damageAverage;
  const newPlus = newAttack.plusDamageAverage ?? 0;
  if (oldDamage + oldPlus < newDamage + newPlus) {
    actions[index] = newAction;
    return;
  }

  // Old attack is stronger, so leave it
}

function addPlusDamage(action: Action, plus: Dice, damageType: string) {

  if (action.plusDamageAverage ?? 0 > plus.Average) {
    // existing plus damage is better.  Leave it.
    return;
  }

  action.plusDamageAverage = plus.Average;
  action.plusDamageDice = plus;
  action.plusDamageType = damageType;
}


function appplySkeletonTemplate(stats: MonsterO5e) {
  const template = { ...stats };

  template.name = stats.name + " Skeleton";
  template.type = "Undead";
  template.intelligence = Math.min(stats.intelligence, 6);
  template.wisdom = Math.min(stats.wisdom, 8);
  template.charisma = Math.min(stats.charisma, 5);

  const pb = crToPb(template.challenge_rating);
  if (stats.intelligence_save != null) {
    template.intelligence_save = Dice.calculateModifier(template.intelligence) + pb;
  }
  if (stats.wisdom_save != null) {
    template.wisdom_save = Dice.calculateModifier(template.wisdom) + pb;
  }
  if (stats.charisma_save != null) {
    template.charisma_save = Dice.calculateModifier(template.charisma) + pb;
  }

  const nonMagicActions = stats.actions?.filter(notMagic) ?? [];
  template.actions = nonMagicActions;

  const nonMagicBonusActions = stats.bonus_actions?.filter(notMagic) ?? [];
  template.bonus_actions = nonMagicBonusActions;

  template.skills = {};

  template.damage_vulnerabilities = appendList(stats.damage_vulnerabilities, "bludgeoning");
  template.damage_immunities = appendList(stats.damage_immunities, "poison");
  template.condition_immunities = appendList(stats.condition_immunities, "fatigue, poisoned");

  template.senses = modifyDarkvision(stats.senses, 60);

  template.languages = "understands the languages it knew in life but can't speak";

  const magiclessAbilities = stats.special_abilities?.filter(notMagic) ?? [];
  template.special_abilities = [
    ...magiclessAbilities,
    {
      name: "Undead Nature",
      desc: "A skeleton doesn't require air, sustenance, or sleep."
    }
  ];

  template.spell_list = [];

  return template;
}

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

function applyZombieTemplate(stats: MonsterO5e, options: ZombieOptions) {
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
