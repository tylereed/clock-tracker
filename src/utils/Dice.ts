import RollLexer from "@/generated/parsers/RollLexer";
import RollParser from "@/generated/parsers/RollParser";
import HealthListener from "@/listeners/HealthListener";
import { CharStream, CommonTokenStream, ParseTreeListener, ParseTreeWalker } from "antlr4";

export default class Dice {
  #count: number;
  #sides: number;
  #modifier: number;

  constructor(count: number, sides: number, modifier: number) {
    this.#count = count;
    this.#sides = sides;
    this.#modifier = modifier;
  }

  static parse(input: string) {
    const chars = new CharStream(input, true);
    const lexer = new RollLexer(chars);
    const tokens = new CommonTokenStream(lexer);
    const parser = new RollParser(tokens);

    const tree = parser.roll();
    const listener = new HealthListener();

    ParseTreeWalker.DEFAULT.walk(listener as unknown as ParseTreeListener, tree);

    return listener.build();
  }

  get Count() {
    return this.#count;
  }

  get Sides() {
    return this.#sides;
  }

  get Modifier() {
    return this.#modifier;
  }

  get Min() {
    return this.#count + this.#modifier;
  }

  get Max() {
    return this.#count * this.#sides + this.#modifier;
  }
  
  throw() {
    let result = this.#modifier;
    for (let i = 0; i < this.#count; i++) {
      result += Math.floor(Math.random() * this.#sides) + 1;
    }
    return result;
  }
}