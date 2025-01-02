import { Action } from "@/utils/Attack";
import Dice from "@/utils/Dice";
import { MonsterO5e } from "@/utils/Open5e";
import { addOrReplaceIfBetter, crToPb, formatDescription, modifyDarkvision } from "./utils";


export function applySahuaginTemplate(stats: MonsterO5e): MonsterO5e  {
  const template = { ...stats };

  template.name = "Sahuagin " + stats.name;

  if ((template.speed.swim ?? 0) < 40) {
    template.speed.swim = 40;
  }

  template.senses = modifyDarkvision(stats.senses, 120);

  template.languages = "Sahuagin";

  template.special_abilities ??= [];
  template.special_abilities.push(
    {
      name: "Blood Frenzy",
      desc: "The sahuagin has advantage on melee attack rolls against creatures that don't have all their hit points."
    },
    {
      name: "Limited Amphibiousness",
      desc: "The sahuagin can breathe air and water. When breathing air, it must immerse itself in water once every 4 hours or begin to suffocate."
    },
    {
      name: "Shark Telepathy",
      desc: "The sahuagin can command any shark within 120 feet of it using magical telepathy."
    });

  const strBonus = Dice.calculateModifier(template.strength);
  const pb = crToPb(template.cr);

  template.actions ??= [];
  const clawDice = new Dice(1, 8, strBonus);
  const clawAction: Action = {
    isMelee: true,
    isRanged: false,
    isWeapon: true,
    isSpell: false,
    toHitBonus: pb + strBonus,
    reach: 5,
    numberTargets: 1,
    damageAverage: clawDice.Average,
    damageDice: clawDice,
    damageType: "slashing"
  };
  addOrReplaceIfBetter(template.actions, { name: "Claw", desc: formatDescription(clawAction) }, clawAction);

  template.bonus_actions ??= [];
  const biteDice = new Dice(1, 4, strBonus);
  const biteAction: Action = {
    isMelee: true,
    isRanged: false,
    isWeapon: true,
    isSpell: false,
    toHitBonus: pb + strBonus,
    reach: 5,
    numberTargets: 1,
    damageAverage: biteDice.Average,
    damageDice: biteDice,
    damageType: "piercing"
  };
  addOrReplaceIfBetter(template.bonus_actions, { name: "Bite", desc: formatDescription(biteAction) }, biteAction);

  return template;
}