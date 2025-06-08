import { AttackDetails, parse as parseAttack } from "@/utils/Attack";
import Dice from "@/utils/Dice";
import { Size } from "@/utils/Open5e";
import pluralize from "pluralize";


export function stringToCr(text: string) {
  if (text === "1/8") return 1 / 8;
  if (text === "1/4") return 1 / 4;
  if (text === "1/2") return 1 / 2;
  return parseInt(text);
}

export function crToPb(cr: string): number;
export function crToPb(cr?: number): number;
export function crToPb(cr: number | string): number;
export function crToPb(cr?: number | string) {
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



const sizes: Size[] = ["Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan", "Titanic"];
export function increaseSize(size: Size, steps: number): Size {
  let newSizeIndex = sizes.indexOf(size) + steps;
  if (newSizeIndex >= sizes.length) {
    newSizeIndex = sizes.length - 1;
  }
  return sizes[newSizeIndex];
}

export function getSizeNumber(size: Size) {
  return sizes.indexOf(size);
}



export function formatDamage(prefix: string, damageAverage: number, damageDice: Dice, damageType: string) {
  let text = prefix;
  text += damageAverage;

  text += " (";
  text += damageDice.toString();
  text += ") ";
  text += damageType;
  text += " damage";

  return text;
}

const intWords = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
export function intToWord(n: number) {
  return intWords[n];
}

export function formatDescription(attack: AttackDetails) {
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

export function addPlusDamage(action: AttackDetails, plus: Dice, damageType: string) {

  if ((action.plusDamageAverage ?? 0) > plus.Average) {
    // existing plus damage is better.  Leave it.
    return;
  }

  action.plusDamageAverage = plus.Average;
  action.plusDamageDice = plus;
  action.plusDamageType = damageType;
}

export function addOrReplaceIfBetter(actions: { name: string; desc: string }[], newAction: { name: string; desc: string; }, newAttack: AttackDetails) {
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



export function notMagic(ability: { name: string, desc: string }): boolean {
  return ability.desc.search(/magic|spell/i) === -1 &&
    ability.name.search(/Spellcasting|-Level|Cantrip/) === -1;
}

function modifyVision(senses: string, type: string, distance: number) {
  // looks like senses always has Passive Perception listed
  if (senses.indexOf(type) === -1) {
    return `${type} ${distance} ft., ${senses}`;
  } else {
    const visionRegex = new RegExp(`${type} (\\d+) (ft\.|')`);
    const result = senses.match(visionRegex)!;
    if (parseInt(result[1]) < distance) {
      return senses.replace(visionRegex, `${type} ${distance} ft.`);
    }
  }

  return senses; // already has vision at or better than distance
}

export function modifyBlindSight(senses: string, distance: number) {
  return modifyVision(senses, "blindsight", distance);
}

export function modifyDarkvision(senses: string, distance: number) {
  return modifyVision(senses, "darkvision", distance);
}

export function appendList(current: string, toAppend: string): string;
export function appendList(current: string, toAppendList: string[]): string;
export function appendList(current: string, ...toAppendList: string[]): string;
export function appendList(current: string, toAppend: string | string[]) {

  if (!current) {
    if (typeof toAppend === "string") {
      return toAppend;
    } else {
      return toAppend.join(", ");
    }
  }

  let toAppendList: string[];
  if (typeof toAppend === "string") {
    toAppendList = toAppend.split(", ");
  } else {
    toAppendList = toAppend;
  }

  toAppendList = toAppendList.filter(x => current.indexOf(x) === -1);
  return [current, ...toAppendList].join(", ");
}