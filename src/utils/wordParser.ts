import Typo from "typo-js";

function addCustomWords(dict: Typo, ...words: string[]) {
  const d: any = dict;
  for (const w of words) {
    d.dictionaryTable[w] = null;
  }
}

const dictionary = new Typo("en_US-custom", null, null, { dictionaryPath: "dictionaries" });

interface SpecialChar {
  symbol: symbol,
  regex: RegExp,
  text: string
}

interface IndexedWord {
  start: number,
  end: number,
  word: string
}

const newline = Symbol("newline");
const period = Symbol("period");
const plus = Symbol("+");
const minus = Symbol("-");
const comma = Symbol(",");
const colon = Symbol(":");
const possessive = Symbol("possessive");
const openParen = Symbol("openParen");
const closeParen = Symbol("closeParen");

const specialChars: SpecialChar[] = [
  { symbol: newline, regex: /^\r?\n$/, text: "\n" },
  { symbol: period, regex: /^\.$/, text: "." },
  { symbol: plus, regex: /^\+$/, text: "+" },
  { symbol: minus, regex: /^-$/, text: "-" },
  { symbol: comma, regex: /^,$/, text: "," },
  { symbol: colon, regex: /^:$/, text: ":" },
  { symbol: possessive, regex: /^(?:'|’)s$/i, text: "'s" },
  { symbol: openParen, regex: /\(/, text: "(" },
  { symbol: closeParen, regex: /\)/, text: ")" },
];

function splitInput(text: string): string[] {
  return text.split(/(\r?\n|\.|,|\+|-|:|(?:'|’)s|\(|\))/i);
}

function* findUnused(covered: boolean[]) {
  let start = 0;

  while (true) {
    let firstFalse = covered.indexOf(false, start);
    if (firstFalse === -1) {
      return;
    }

    let next = covered.indexOf(true, firstFalse);
    if (next === -1) {
      yield { start: firstFalse, end: covered.length };
      return;
    }
    yield { start: firstFalse, end: next };
    start = next;
  }
}

function* combine(used: IndexedWord[], unused: IndexedWord[]) {
  used = used.toReversed();
  unused = unused.toReversed();

  while (used.length && unused.length) {
    if (used[used.length - 1].start < unused[unused.length - 1].start) {
      yield used.pop()!.word;
    } else {
      yield unused.pop()!.word;
    }
  }

  while (used.length) yield used.pop()!.word;
  while (unused.length) yield unused.pop()!.word;
}

function testWord(possiblyWord: string) {
  return dictionary.check(possiblyWord) || isNumber(possiblyWord) || isThrow(possiblyWord);
}

function buildWords(text: string): string {

  const letters = text.split(/\s+/).filter(x => x !== "");
  const size = letters.length;

  let currentWord = "";
  let currentEndIndex = -1;

  //new Boolean[size][size];

  // Array.apply()

  const covered = Array(size).fill(false);
  //const matrix: Array<Array<boolean | undefined> | undefined> = Array.from({ length: size }, () => undefined);
  const words: IndexedWord[] = [];
  //const indexes = [];

  let start = 0
  let end = 1;

  //matrix[0] = Array(size).fill(undefined);

  while (true) {
    let possiblyWord = letters.slice(start, end).join('');

    if (testWord(possiblyWord)) {
      //matrix[start]![end] = true;
      currentWord = possiblyWord;
      currentEndIndex = end;
      //words.push(possiblyWord);
    } else {
      //matrix[start]![end] = false;
    }

    end++;
    if ((end > size) || (end - start > 13)) {
      if (currentWord) {
        words.push({ start, end: currentEndIndex, word: currentWord });
        //indexes.push({ start, end: start + currentWord.length });

        for (let i = start; i < currentEndIndex; i++) {
          covered[i] = true;
        }
      }

      //let wordEnd = currentEndIndex; // matrix[start]!.lastIndexOf(true);
      start = currentEndIndex === -1 ? start + 1 : currentEndIndex;
      end = start + 1;

      currentWord = "";
      currentEndIndex = -1;
      if (start >= size || start === -1) {
        break;
      }

      //matrix[start] ??= Array(size).fill(undefined);
    }
  }

  // const y = matrix.map(x => x ? (x.map(z => z ? "T" : z === false ? "x" : ".")).join("") : ".".repeat(size)).join("\n");
  // console.log(y);

  const unusedIndexes = [...findUnused(covered)];
  const unusedWords: IndexedWord[] = [];
  for (const u of unusedIndexes) {
    const w = letters.slice(u.start, u.end).join("");
    unusedWords.push({ ...u, word: w });
  }

  const allWords: string[] = [...combine(words, unusedWords)];
  return allWords.join(" ");
}

function findSpecialChars(text: string): string | symbol {

  for (let special of specialChars) {
    if (text.match(special.regex)) {
      return special.symbol;
    }
  }

  return text;
}

function format(text: string | symbol): string | SpecialChar {
  const type = typeof text;

  if (type === "string") {
    return buildWords(text as string);
  }

  for (let special of specialChars) {
    if (text === special.symbol) {
      return special;
    }
  }

  throw `did not match text ${text.toString()} to anything`;
}

function isNumber(text: string) {
  return !!text.match(/^\d+$/);
}

function isThrow(text: string) {
  return !!text.match(/^(\d+)?d(\d+)((\+|-)\d+)?$/);
}

function endsWithNumber(text: string | null) {
  if (text) {
    return !!text.match(/\d+$/);
  }
  return false;
}

function buildParagraph(words: (string | SpecialChar)[]): string[] {
  const paragraph: string[] = [];

  let previousString = null;
  for (const w of words) {
    if (typeof w === "string") {
      if (previousString) {
        paragraph.push(" ");
      }
      paragraph.push(w);
      previousString = w;
    } else {
      if (w.symbol === openParen || (w.symbol === plus && !endsWithNumber(previousString))) {
        paragraph.push(" ");
      }
      paragraph.push(w.text);

      switch (w.symbol) {
        case period:
        case comma:
        case colon:
        case possessive:
        case closeParen:
          previousString = w.text;
          break;
        default:
          previousString = null;
      }
    }
  }

  return paragraph;
}

function fixupWords(words: string[]) {

}

export default function formatParagraph(text: string): string {
  const lines = splitInput(text).map(findSpecialChars).filter(x => x !== "");
  const words = lines.map(l => format(l));

  return buildParagraph(words).join("");
}