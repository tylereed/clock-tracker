import { describe, expect, test } from "vitest";

import AttackActionListener from "../../src/listeners/AttackActionListener";

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
});