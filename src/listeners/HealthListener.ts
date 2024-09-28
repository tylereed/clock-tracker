import Dice from "@/utils/Dice";
import { RollContext } from "@/generated/parsers/RollParser";
import RollListener from "@/generated/parsers/RollListener";

export default class HealthListener extends RollListener {

  #roll: { count: number, sides: number, modifier: number };

  constructor() {
    super();
    this.#roll = {
      count: 0,
      sides: 0,
      modifier: 0
    };
  }

  enterRoll = (ctx: RollContext) => {
    const max = ctx.getChildCount();
    let nextChild;

    if (ctx.getChild(0).getText() === "d") {
      this.#roll.count = 1;
      nextChild = 1;
    } else {
      this.#roll.count = +ctx.getChild(0).getText();
      nextChild = 2;
    }

    this.#roll.sides = +ctx.getChild(nextChild).getText();

    if (++nextChild >= max) {
      return;
    }

    if (ctx.getChild(nextChild).getText() === '+') {
      this.#roll.modifier = +ctx.getChild(nextChild+1).getText();
    }

  };

  build(): Dice {
    return new Dice(this.#roll.count, this.#roll.sides, this.#roll.modifier);
  }

}