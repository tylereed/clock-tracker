import { CharStream, CommonTokenStream, ParseTreeWalker } from "antlr4";
import RollLexer from "./generated/parsers/RollLexer";
import AttackListener from "./generated/parsers/AttackListener";
import AttackParser from "./generated/parsers/AttackParser";

const input = "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 12 (2d6 + 5) piercing damage.";

const chars = new CharStream(input, true);
const lexer = new RollLexer(chars);
const tokens = new CommonTokenStream(lexer);
const parser = new AttackParser(tokens);

const tree = parser.attack();
const listener = new AttackListener();

try {
  ParseTreeWalker.DEFAULT.walk(listener, tree);
  //listener.
} catch (e) {
  console.error(e);
}