import { CharStream, CommonTokenStream, ParseTreeWalker } from "antlr4";

import AttackActionListener from "@/listeners/AttackActionListener";
import AttackLexer from "@/generated/parsers/AttackLexer";
import AttackParser from "@/generated/parsers/AttackParser";
import Dice from "./Dice";

export interface AttackDetails {
  isMelee: boolean;
  isRanged: boolean;
  isWeapon: boolean;
  isSpell: boolean;
  toHitBonus: number;
  reach?: number;
  range?: number;
  rangeMax?: number;
  numberTargets: number;
  damageAverage: number;
  damageDice: Dice;
  damageType: string;
  plusDamageAverage?: number;
  plusDamageDice?: Dice;
  plusDamageType?: string;
  twoHandedDamageAverage?: number;
  twoHandedDamageDice?: Dice;
  twoHandedDamageType?: string;
  extraText?: string;
}

export function parse(text: string): AttackDetails | undefined {

  const chars = new CharStream(text, true);
  const lexer = new AttackLexer(chars);
  const tokens = new CommonTokenStream(lexer);
  const parser = new AttackParser(tokens);
  parser.removeErrorListeners();

  const tree = parser.attack();
  const listener = new AttackActionListener();

  try {
    ParseTreeWalker.DEFAULT.walk(listener, tree);
    return listener.build();
  } catch (e) {
    console.error(e);
    return;
  }

}