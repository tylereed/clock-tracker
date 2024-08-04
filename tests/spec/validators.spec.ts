import { describe, expect, test } from "vitest";
import * as v from "../../src/utils/validators";

describe("isRequiredRule", () => {
  const RequiredString = "Required";

  test.each([
    null, undefined, "", " "
  ])('isRequired(%o) is false', (value) => {
    const result = v.isRequiredRule(value);
    expect(result).toStrictEqual(RequiredString);
  });

  test.each([
    0, 1, "a", "0", true, false
  ])('isRequired(%o) is true', (value) => {
    const result = v.isRequiredRule(value);
    expect(result).toStrictEqual(true);
  });
});

describe("isNumericRule", () => {
  const NumericRuleFailed = "Must be a number";

  test.each([
    "a", "1.1", "-1"
  ])("isNumericRule(%o) is false", (value) => {
    const result = v.isNumericRule(value);
    expect(result).toStrictEqual(NumericRuleFailed);
  });

  test.each([
    null, undefined, "", " ", "0", "1"
  ])("inNumeric(%o) is true", (value) => {
    const result = v.isNumericRule(value!);
    expect(result).toStrictEqual(true);
  });

});

describe("inRangeRule", () => {
  function formatFailedMessage(min: number, max: number) {
    return `Must be between ${min} and ${max}`;
  }

  test.each([
    ["a", 0, 10],
    ["", 1, 10],
    [" ", 2, 11],
    [0, 1, 10],
    [11, 1, 10],
    ["0", 1, 10],
    ["11", 1, 10]
  ])("inRange(%o, %d, %d) fails", (test, min, max) => {
    const expected = formatFailedMessage(min, max);

    const actual = v.inRangeRule(min, max)(test);
    expect(actual).toStrictEqual(expected);
  });

  test.each([
    [1, 1, 5],
    [2, 1, 5],
    [3, 1, 5],
    [4, 1, 5],
    [5, 1, 5],
    [6, 1, 6],
    ["1", 1, 5],
    ["2", 1, 5],
    ["5", 1, 5]
  ])("inRange(%o, %d, %d) passes", (test, min, max) => {
    const actual = v.inRangeRule(min, max)(test);
    expect(actual).toStrictEqual(true);
  });
});

describe("isColor", () => {
  const ColorRuleFailed = "Not a valid color";

  test.each([
    "asdf",
    "blurple",
    " ",
    "AAAAA",
    "aaaaaaaaa"
  ])("isColor(%o) fails", (value) => {
    const actual = v.isColor(value as any);
    expect(actual).toStrictEqual(ColorRuleFailed);
  });

  test.each([
    "green",
    "000000",
    "FFFFFF",
    "ffffff",
    "00FFFFFF",
    "#000000"
  ])("isColor(%o) passed", (value) => {
    const actual = v.isColor(value as any);
    expect(actual).toStrictEqual(true);
  });
});