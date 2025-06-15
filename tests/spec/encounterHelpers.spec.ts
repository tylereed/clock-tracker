import { describe, expect, test } from "vitest";
import * as e from "../../src/components/initiative/encounterHelpers";

describe("getEncounterDice", () => {

  test("getEncounterdDice", () => {
    const monsters = [
      {
        actions: [
          { desc: "2d12" },
          { desc: "2d8" },
          { desc: "3d6" }
        ]
      }
    ];

    const actual = e.getEncounterDice(monsters);

    expect(actual.d12).toBe(2);
    expect(actual.d8).toBe(2);
    expect(actual.d6).toBe(3);
  });

});