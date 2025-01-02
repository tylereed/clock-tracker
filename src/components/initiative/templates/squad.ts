import pluralize from "pluralize";

import { parse as parseAttack } from "@/utils/Attack";
import Dice from "@/utils/Dice";
import { MonsterO5e, } from "@/utils/Open5e";
import { crToPb, formatDescription, increaseSize, stringToCr } from "./utils";

function increaseSquadDamage(dice: Dice) {
  const damageDice = new Dice(5 * dice.Count, dice.Sides, 5 * dice.Modifier);
  return [damageDice.Average, damageDice] as const;
}

export function applySquadTemplate(stats: MonsterO5e): MonsterO5e  {
  const template: MonsterO5e = { ...stats };

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

  template.special_abilities = [
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
  ];

  return template;
}