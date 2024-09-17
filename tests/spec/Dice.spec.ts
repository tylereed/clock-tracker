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

});