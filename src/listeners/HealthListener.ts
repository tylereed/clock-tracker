import Dice from "@/utils/Dice";
import { CountContext, ModifierContext, RollContext, SidesContext } from "@/generated/parsers/RollParser";
import RollListener from "@/generated/parsers/RollListener";

export default class HealthListener extends RollListener {

  #roll: { count: number, sides: number, modifier: number };

  constructor() {
    super();
    this.#roll = {
      count: 1,
      sides: 0,
      modifier: 0
    };
  }

  enterCount = (ctx: CountContext) => {
    this.#roll.count = parseInt(ctx.NUMBER().getText());
  };

  enterSides = (ctx: SidesContext) => {
    this.#roll.sides = parseInt(ctx.NUMBER().getText());
  };

  enterModifier = (ctx: ModifierContext) => {
    this.#roll.modifier = parseInt(ctx.getText());
  };

  build(): Dice {
    return new Dice(this.#roll.count, this.#roll.sides, this.#roll.modifier);
  }

}