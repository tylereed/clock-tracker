import { describe, expect, test } from "vitest";
import AttackActionListener from "../../src/listeners/AttackActionListener";
import { AttackDetails } from "../../src/utils/Attack";
import AttackLexer from "../../src/generated/parsers/AttackLexer";
import AttackParser from "../../src/generated/parsers/AttackParser";
import { CharStream, CommonTokenStream, ParseTreeListener, ParseTreeWalker } from "antlr4";
import Dice from "../../src/utils/Dice";

describe("AttackActionListener", () => {
  const target = new AttackActionListener();

  test.each([
    ["one", 1],
    ["two", 2],
    ["three", 3],
    ["four", 4],
    ["five", 5],
    ["six", 6],
    ["seven", 7],
    ["eight", 8],
    ["nine", 9],
    ["ten", 0], // ten targets is unsupported
  ])("wordToInt(%s): %s", (word: string, expected: number) => {
    const actual = target.wordToInt(word);
    expect(actual).toBe(expected);
  });

  test.skip("Saving Throw parsing", () => {
    const text = "";

    const expected: AttackDetails = {
      isMelee: false,
      isRanged: false,
      isWeapon: false,
      isSpell: false,
      toHitBonus: 0,
      numberTargets: 0,
      damageAverage: 14,
      damageDice: new Dice(2, 6, 7),
      damageType: "bludgeoning"
    };

    const chars = new CharStream(text, true);
    const lexer = new AttackLexer(chars);
    const tokens = new CommonTokenStream(lexer);
    const parser = new AttackParser(tokens);
    parser.removeErrorListeners();

    const tree = parser.attack();
    const listener = new AttackActionListener();

    ParseTreeWalker.DEFAULT.walk(listener as unknown as ParseTreeListener, tree);
    const actual = listener.build();

    expect(actual).toBe(expected);
  });
});