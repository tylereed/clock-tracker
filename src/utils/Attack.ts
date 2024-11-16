import ActionListener from "@/listeners/ActionListener";
import Dice from "./Dice";
import { CharStream, CommonTokenStream, ParseTreeWalker } from "antlr4";
import AttackLexer from "@/generated/parsers/AttackLexer";
import AttackParser from "@/generated/parsers/AttackParser";
import AttackListener from "@/generated/parsers/AttackListener";

interface Action {
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
}

export function parse(text: string): Action | undefined {

  
  const chars = new CharStream(text, true);
  const lexer = new AttackLexer(chars);
  const tokens = new CommonTokenStream(lexer);
  const parser = new AttackParser(tokens);

  const tree = parser.attack();
  const listener = new ActionListener();

  try {
    ParseTreeWalker.DEFAULT.walk(listener, tree);
    return listener.build();
  } catch (e) {
    console.error(e);
    return;
  }

}