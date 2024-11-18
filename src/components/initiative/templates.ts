import pluralize from "pluralize";

import { Action, parse as parseAttack } from "@/utils/Attack";
import Dice from "@/utils/Dice";
import { MonsterO5e, Size } from "@/utils/Open5e";

export function applyTemplate(template: string, stats: MonsterO5e) {
  if (template === "Squad") {
    return applySquadTemplate(stats);
  }
  throw "Unknown template: " + template;
}

function increaseSquadDamage(dice: Dice) {
  const damageDice = new Dice(5 * dice.Count, dice.Sides, dice.Modifier);
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

  result += attack.extraText;

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

function crToPb(cr?: number) {
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
