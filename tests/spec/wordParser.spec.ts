import { describe, expect, test } from "vitest";
import formatParagraph from "../../src/utils/wordParser";
import Typo from "typo-js";
import { createReadStream } from "node:fs";
import { readFile } from "node:fs/promises";
import readline from "node:readline/promises";

type State = "Name" | "Custom" | "Test" | "Expected";

async function* iterateFile(reader: readline.Interface) {
  let name: string = "";
  let customWords: string = "";
  let test: string = "";
  let expected: string = "";
  let state: State = "Name";

  for await (const line of reader) {
    switch (state) {
      case "Name":
        name = line;
        state = "Custom";
        break;

      case "Custom":
        customWords = line;
        state = "Test";
        break;

      case "Test":
        if (line) {
          test += line + "\n";
        } else {
          state = "Expected";
        }
        break;

      case "Expected":
        if (line) {
          expected += line + "\n";
        } else {
          yield [name, customWords, test, expected] as const;
          name = customWords = test = expected = "";
          state = "Name";
        }
        break;
    }
  }

  if (name && customWords && test && expected) {
    yield [name, customWords, test, expected] as const;
  }
}

async function loadData() {
  try {
    const reader = readline.createInterface({
      input: createReadStream("tests/spec/data/wordParser_data.txt"),
      crlfDelay: Infinity,
    });

    let result: [string, string, string, string][] = [];
    for await (const i of iterateFile(reader)) {
      result.push([...i]);
    }
    return result;
  } catch (e) {
    console.error(e);
  }
}

describe.skip("wordParser", async () => {
  const data = await loadData();

  test.skipIf(!data?.length).each(data ?? [["No tests found", "", "", ""]])(
    "formatParagraph(%s)",
    async (_name: string, sCustom: string, test: string, expected: string) => {
      const customWords = sCustom.split(",");

      const loadDictionaryLocal = async () => {
        const aff = await readFile(
          "public/dictionaries/en_US_FiveE_35/en_US_FiveE_35.aff",
        );
        const words = await readFile(
          "public/dictionaries/en_US_FiveE_35/en_US_FiveE_35.dic",
        );

        return new Typo("en_US", aff.toString(), words.toString());
      };

      const actual = await formatParagraph(
        test,
        customWords,
        loadDictionaryLocal,
      );
      expect(actual).toBe(expected);
    },
  );
});
