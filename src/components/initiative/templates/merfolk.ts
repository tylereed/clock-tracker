import { MonsterO5e } from "@/utils/Open5e";
import { MerfolkOptions } from "./types";
import { addOrReplaceIfBetter, crToPb, formatDescription, modifyDarkvision, stringToCr } from "./utils";
import Dice from "@/utils/Dice";
import { AttackDetails } from "@/utils/Attack";


export function applyMerfolkTemplate(stats: MonsterO5e, options: MerfolkOptions): MonsterO5e  {
  const template = { ...stats };

  template.name = "Merfolk " + stats.name;

  template.speed = {
    walk: 10,
    swim: 40
  };

  template.senses = modifyDarkvision(stats.senses, 30);

  template.languages = "Aquan, Common";

  template.special_abilities ??= [];
  template.special_abilities.push({
    name: "Amphibious",
    desc: "The merfolk can breathe air and water."
  });

  const strMod = Dice.calculateModifier(template.strength);
  const damageDice = new Dice(1, 6, strMod);
  const versatileDice = new Dice(1, 8, strMod);

  if (options.includeTrident) {
    const trident: AttackDetails = {
      isMelee: true,
      isRanged: true,
      isWeapon: true,
      isSpell: false,
      toHitBonus: crToPb(template.challenge_rating) + strMod,
      reach: 5,
      range: 20,
      rangeMax: 60,
      numberTargets: 1,
      damageAverage: damageDice.Average,
      damageDice: damageDice,
      damageType: "piercing",
      twoHandedDamageAverage: versatileDice.Average,
      twoHandedDamageDice: versatileDice,
      twoHandedDamageType: "piercing"
    };
    template.actions ??= [];
    addOrReplaceIfBetter(template.actions, { name: "Trident", desc: formatDescription(trident) }, trident);
  }

  if (stringToCr(stats.challenge_rating) >= 2 && (template.actions?.findIndex(a => a.name === "Trident") ?? -1) > -1) {
    template.bonus_actions ??= [];
    template.bonus_actions.push({
      name: "Trident",
      desc: "The merfolk makes a trident attack"
    });
  }

  return template;
}