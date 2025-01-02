import Dice from "@/utils/Dice";
import { MonsterO5e } from "@/utils/Open5e";
import { appendList, crToPb, modifyDarkvision, notMagic } from "./utils";

export function appplySkeletonTemplate(stats: MonsterO5e): MonsterO5e {
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

