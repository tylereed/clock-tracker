import { describe, expect, test } from "vitest";
import Dice from "../../src/utils/Dice";

describe("Dice", () => {

  test.each([
    [1, 6, 0, 1, 6],
    [2, 12, -1, 1, 23],
    [3, 10, 3, 6, 33]
  ])
    ("Dice (%dd%d+%d)", (count, sides, modifier, min, max) => {
      const target = new Dice(count, sides, modifier);
      expect.soft(target.Count).toBe(count);
      expect.soft(target.Sides).toBe(sides);
      expect.soft(target.Modifier).toBe(modifier);
      expect.soft(target.Min).toBe(min);
      expect.soft(target.Max).toBe(max);
    });

  test.each([
    [1, 6, 0],
    [2, 12, -1],
    [3, 10, 3]
  ])("throws in range (%dd%d+%d)", (count, sides, modifier) => {
    const target = new Dice(count, sides, modifier);

    for (let i = 0; i < 100; i++) {
      const actual = target.throw();
      expect.soft(actual).toBeGreaterThanOrEqual(target.Min);
      expect.soft(actual).toBeLessThanOrEqual(target.Max);
    }
  });

  test.each([
    [1, 6, 0],
    [2, 12, -1],
    [3, 10, 3]
  ])("throws in range (2*%dd%d+%d)dl", (count, sides, modifier) => {
    const target = new Dice(count, sides, modifier);

    for (let i = 0; i < 100; i++) {
      const actual = target.throw(2);
      expect.soft(actual).toBeGreaterThanOrEqual(target.Min);
      expect.soft(actual).toBeLessThanOrEqual(target.Max);
    }
  });

  test("D20.ofStat", () => {
    const expected = new Dice(1, 20, 4);
    const actual = Dice.D20.ofStat(19);
    expect(actual).toStrictEqual(expected);
  });

  test("D20.ofModifier", () => {
    const expected = new Dice(1, 20, 3);
    const actual = Dice.D20.ofModifier(3);
    expect(actual).toStrictEqual(expected);
  });

  test.each([
    [1, -5],
    [2, -4],
    [3, -4],
    [4, -3],
    [5, -3],
    [6, -2],
    [7, -2],
    [8, -1],
    [9, -1],
    [10, 0],
    [11, 0],
    [12, 1],
    [13, 1],
    [14, 2],
    [15, 2],
    [16, 3],
    [17, 3],
    [18, 4],
    [19, 4],
    [20, 5]
  ])("calculateModifier", (stat: number, expected: number) => {
    const actual = Dice.calculateModifier(stat);
    expect(actual).toBe(expected);
  });

  test.each([
    ["2d20+5", 2, 20, 5],
    ["2d20 +5", 2, 20, 5],
    ["2d20+ 5", 2, 20, 5],
    ["2d20 + 5", 2, 20, 5]
  ])("parse %s", (text, count, sides, modifier) => {
    const expected = new Dice(count, sides, modifier);

    const actual = Dice.parse(text);

    expect(actual).toStrictEqual(expected);
  });

});