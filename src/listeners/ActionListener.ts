import AttackListener from "@/generated/parsers/AttackListener";
import { AttackContext, AttackTypeContext, DamageContext, MeleeRangedContext, ReachContext, TargetsContext, ToHitContext, WeaponSpellContext } from "@/generated/parsers/AttackParser";
import Dice from "@/utils/Dice";

export default class ActionListener extends AttackListener {

  #action: {
    isMelee: boolean;
    isRanged: boolean;
    isWeapon: boolean;
    isSpell: boolean;
    toHitBonus: number;
    reach: number;
    numberTargets: number;
    damageAverage: number;
    damageDice: Dice;
    damageType: string;
    extraText?: string;
  };

  constructor() {
    super();
    this.#action = {
      isMelee: false,
      isRanged: false,
      isWeapon: false,
      isSpell: false,
      toHitBonus: 0,
      reach: 0,
      numberTargets: 0,
      damageAverage: 0,
      damageDice: new Dice(0, 0, 0),
      damageType: "",
    };
  }

  build() {
    return { ... this.#action };
  }

  wordToInt(word: string): number {
    switch (word.toLowerCase()) {
      case "one": return 1;
      case "two": return 2;
      case "three": return 3;
      case "four": return 4;
      case "five": return 5;
      case "six": return 6;
      case "seven": return 7;
      case "eight": return 8;
      case "nine": return 9;
      default: return 0;
    }
  }

  // enterAttackType = (ctx: AttackTypeContext) => {
  //   this.#action.attackType = ctx.meleeRanged().getText() + " " + ctx.weaponSpell().getText();
  // };

  enterMeleeRanged = (ctx: MeleeRangedContext) => {
    const meleeRanged = ctx.getText();
    if (meleeRanged === "Melee") {
      this.#action.isMelee = true;
    } else if (meleeRanged === "Ranged") {
      this.#action.isRanged = true;
    } else if (meleeRanged === "Melee or Ranged") {
      this.#action.isMelee = true;
      this.#action.isRanged = true;
    }
  };

  enterWeaponSpell = (ctx: WeaponSpellContext) => {
    const weaponSpell = ctx.getText();
    if (weaponSpell === "Weapon") {
      this.#action.isWeapon = true;
    } else if (weaponSpell === "Spell") {
      this.#action.isSpell = true;
    }
  };

  enterToHit = (ctx: ToHitContext) => {
    this.#action.toHitBonus = parseInt(ctx.NUMBER().getText());
  };

  enterReach = (ctx: ReachContext) => {
    this.#action.reach = parseInt(ctx.NUMBER().getText());
  };

  enterTargets = (ctx: TargetsContext) => {
    this.#action.numberTargets = this.wordToInt(ctx.NUMBER_TEXT().getText());
  };

  enterDamage = (ctx: DamageContext) => {
    this.#action.damageAverage = parseInt(ctx.NUMBER().getText());
    this.#action.damageDice = Dice.parse(ctx.DICE().getText())!;
    this.#action.damageType = ctx.DAMAGE_TYPE().getText();
  };

  exitAttack = (ctx: AttackContext) => {
    const extraText = ctx.TEXT_list().join("");
    if (extraText) {
      this.#action.extraText = extraText;
    }
  };

}