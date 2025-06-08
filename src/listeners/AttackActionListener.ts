import AttackListener from "@/generated/parsers/AttackListener";
import { AttackContext, DamageContext, MeleeRangedContext, PlusDamageContext, RangeContext, ReachContext, TargetsContext, ToHitContext, VersatileDamageContext, WeaponSpellContext } from "@/generated/parsers/AttackParser";
import { AttackDetails } from "@/utils/Attack";
import Dice from "@/utils/Dice";

export default class AttackActionListener extends AttackListener {

  #action: AttackDetails;

  constructor() {
    super();
    this.#action = {
      isMelee: false,
      isRanged: false,
      isWeapon: false,
      isSpell: false,
      toHitBonus: 0,
      numberTargets: 0,
      damageAverage: 0,
      damageDice: new Dice(0, 0, 0),
      damageType: "",
    };
  }

  build() {
    return { ...this.#action };
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

  enterRange = (ctx: RangeContext) => {
    this.#action.range = parseInt(ctx.NUMBER(0).getText());

    if (ctx.NUMBER_list().length > 1) {
      this.#action.rangeMax = parseInt(ctx.NUMBER(1).getText());
    }
  };

  enterTargets = (ctx: TargetsContext) => {
    this.#action.numberTargets = this.wordToInt(ctx.NUMBER_TEXT().getText());
  };

  enterDamage = (ctx: DamageContext) => {
    this.#action.damageAverage = parseInt(ctx.NUMBER().getText());
    this.#action.damageDice = Dice.parse(ctx.DICE().getText())!;
    this.#action.damageType = ctx.DAMAGE_TYPE().getText();
  };

  enterPlusDamage = (ctx: PlusDamageContext) => {
    this.#action.plusDamageAverage = parseInt(ctx.NUMBER().getText());
    this.#action.plusDamageDice = Dice.parse(ctx.DICE().getText())!;
    this.#action.plusDamageType = ctx.DAMAGE_TYPE().getText();
  };

  enterVersatileDamage = (ctx: VersatileDamageContext) => {
    this.#action.twoHandedDamageAverage = parseInt(ctx.NUMBER().getText());
    this.#action.twoHandedDamageDice = Dice.parse(ctx.DICE().getText())!;
    this.#action.twoHandedDamageType = ctx.DAMAGE_TYPE().getText();
  }

  exitAttack = (ctx: AttackContext) => {
    const extraText = ctx.extraText()?.getText();
    if (extraText) {
      this.#action.extraText = extraText;
    }
  };

}