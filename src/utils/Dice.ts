import { CharStream, CommonTokenStream, ParseTreeWalker } from "antlr4";
import HealthListener from "@/listeners/HealthListener";
import RollLexer from "@/generated/parsers/RollLexer";
import RollParser from "@/generated/parsers/RollParser";

export default class Dice {
  private count: number;
  private sides: number;
  private modifier: number;

  constructor(count: number, sides: number, modifier: number) {
    this.count = count;
    this.sides = sides;
    this.modifier = modifier;
  }

  static D20 = {
    ofStat(stat: number) {
      const mod = Dice.calculateModifier(stat);
      return new Dice(1, 20, mod);
    },

    ofModifier(mod: number) {
      return new Dice(1, 20, mod);
    }
  }

  static calculateModifier(stat: number) {
    return Math.floor((stat - 10) / 2);
  }

  static parse(input: string) {
    if (!input) {
      return;
    }

    const chars = new CharStream(input, true);
    const lexer = new RollLexer(chars);
    const tokens = new CommonTokenStream(lexer);
    const parser = new RollParser(tokens);

    const tree = parser.roll();
    const listener = new HealthListener();

    try {
      ParseTreeWalker.DEFAULT.walk(listener, tree);
    } catch (e) {
      console.error(e);
      return;
    }

    return listener.build();
  }

  get Count() {
    return this.count;
  }

  get Sides() {
    return this.sides;
  }

  get Modifier() {
    return this.modifier;
  }

  get Min() {
    return this.count + this.modifier;
  }

  get Max() {
    return this.count * this.sides + this.modifier;
  }

  get Average() {
    return Math.floor((this.sides + 1) / 2 * this.count + this.modifier);
  }

  throw(multiplier?: number) {
    let result = this.modifier;

    const dice: number[] = [];
    if (multiplier) {
      const count = Math.ceil(this.count * multiplier);
      for (let i = 0; i < count; i++) {
        dice.push(Math.floor(Math.random() * this.sides) + 1);
      }
      result += dice.sort((a, b) => b - a).slice(0, this.count).reduce((a, b) => a + b);
    } else {
      for (let i = 0; i < this.count; i++) {
        result += Math.floor(Math.random() * this.sides) + 1;
      }
    }
    return result;
  }

  toString(): string {
    return `${this.count > 1 ? this.count : ""}d${this.sides}${this.modifier <= 0 ? "" : "+"}${this.modifier !== 0 ? this.modifier : ""}`
  }
}