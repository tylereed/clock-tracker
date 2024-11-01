import { describe, expect, test } from "vitest";
import RollLexer from "../../src/generated/parsers/RollLexer";
import RollParser from "../../src/generated/parsers/RollParser";
import HealthListener from "../../src/listeners/HealthListener";
import { CharStream, CommonTokenStream, ParseTreeListener, ParseTreeWalker } from "antlr4";

describe("HealthListener", () => {

  test.each([
    ["2d20+2", 2, 20, 2],
    ["3d6", 3, 6, 0],
    ["d4+5", 1, 4, 5],
    ["d12", 1, 12, 0]
  ])("Parses %s", (input, count, sides, modifier) => {

    const chars = new CharStream(input, true);
    const lexer = new RollLexer(chars);
    const tokens = new CommonTokenStream(lexer);
    const parser = new RollParser(tokens);

    const tree = parser.roll();
    const listener = new HealthListener();

    ParseTreeWalker.DEFAULT.walk(listener as unknown as ParseTreeListener, tree);

    const actual = listener.build();
    expect.soft(actual.Count).toBe(count);
    expect.soft(actual.Sides).toBe(sides);
    expect.soft(actual.Modifier).toBe(modifier);
  });

});