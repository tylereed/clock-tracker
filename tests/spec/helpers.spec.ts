import { describe, expect, test } from "vitest";
import * as i from "../../src/utils/helpers";

describe("Iterables", () => {

  describe("chunk", () => {

    test("even size", () => {
      const target = [1, 2, 3, 4, 5, 6];
      const expected = [[1, 2, 3], [4, 5, 6]];

      const actual = [...i.chunk(3, target)];

      expect(actual).toStrictEqual(expected);
    });

    test("different size", () => {
      const target = [1, 2, 3, 4, 5, 6];
      const expected = [[1, 2, 3, 4, 5], [6]];

      const actual = [...i.chunk(5, target)];

      expect(actual).toStrictEqual(expected);
    });

  });

});