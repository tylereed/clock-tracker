import { describe, expect, test } from "vitest";
import parseCustomMonster, { StatBlock } from "../../src/utils/statblockParser";
import { createReadStream } from "node:fs";
import readline from "node:readline/promises";

type State = "Name" | "Test" | "Expected";

async function* iterateFile(reader: readline.Interface) {
  let name: string = "";
  let test: string = "";
  let expected: string = "";
  let state: State = "Name";

  for await (const line of reader) {
    switch (state) {
      case "Name":
        if (line) {
          name = line;
          state = "Test";
        }
        break;

      case "Test":
        if (!line.match(/^\s*\{\s*$/)) {
          test += line + "\n";
        } else {
          expected += line + "\n";
          state = "Expected";
        }
        break;

      case "Expected":
        expected += line + "\n";
        if (line.match(/^\s*\}\s*$/)) {
          const stats = JSON.parse(expected) as StatBlock;
          yield [name, test, stats] as const;
          name = test = expected = "";
          state = "Name";
        }
        break;
    }
  }

}

async function loadDataFromFile() {
  try {
    const reader = readline.createInterface({
      input: createReadStream("tests/spec/data/statblock_data.txt"),
      crlfDelay: Infinity,
    });

    let result: [string, string, StatBlock][] = [];
    for await (const i of iterateFile(reader)) {
      result.push([...i]);
    }
    return result;
  } catch (e) {
    console.error(e);
  }
}

const statblockTestData = await loadDataFromFile();

describe("statblock parser", () => {
  test.skipIf(!statblockTestData).each(statblockTestData ?? [["No test data", "", {} as StatBlock]])(
    "parseCustomMonster(%s)",
    (_testName: string, input: string, expected: StatBlock) => {
      const actual = parseCustomMonster(input);
      expect(actual).toEqual(expected);
    },
  );
});
