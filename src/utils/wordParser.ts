import Typo from "typo-js";
import { sleep } from "./helpers";

function addCustomWords(dict: Typo, ...words: string[]) {
  const d: any = dict;
  for (const w of words) {
    d.dictionaryTable[w] = null;
  }
}

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
const upperPossessive = Symbol("upperPossessive");
const openParen = Symbol("openParen");
const closeParen = Symbol("closeParen");
const openQuote = Symbol("openQuote");
const closeQuote = Symbol("closeQuote");

const specialChars: SpecialChar[] = [
  { symbol: newline, regex: /^\r?\n$/, text: "\n" },
  { symbol: period, regex: /^\.$/, text: "." },
  { symbol: plus, regex: /^\+$/, text: "+" },
  { symbol: minus, regex: /^-$/, text: "-" },
  { symbol: comma, regex: /^,$/, text: "," },
  { symbol: colon, regex: /^:$/, text: ":" },
  { symbol: possessive, regex: /^(?:'|’)s$/, text: "'s" },
  { symbol: upperPossessive, regex: /^(?:'|’)S$/, text: "'S" },
  { symbol: openParen, regex: /\(/, text: "(" },
  { symbol: closeParen, regex: /\)/, text: ")" },
  { symbol: openQuote, regex: /“/, text: '“' },
  { symbol: closeQuote, regex: /”/, text: '”' }
];

function splitInput(text: string): string[] {
  return text.split(/(\r?\n|\.|,|\+|-|:|(?:'|’)s|\(|\)|“|”)/i);
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

function splitWords(word1: string, word2: string, testWord: (w: string) => IsWordSource) {
  const newWords = word1 + word2;

  for (let i = 1; i < newWords.length; i++) {
    const first = newWords.substring(0, i);
    const second = newWords.substring(i);
    if (testWord(first) && testWord(second)) {
      return [first, second];
    }
  }

  return [word1, word2];
}

function* fixupWords(words: string[], testWord: (w: string) => IsWordSource) {
  if (words.length === 0) {
    return;
  }
  if (words.length === 1) {
    yield words[0];
    return;
  }
  words = [...words];

  let previousWord = words[0];
  let isPreviousValid = testWord(previousWord);

  for (let i = 1; i < words.length; i++) {
    let isCurrentValid = testWord(words[i]);
    if (isPreviousValid && !isCurrentValid) {
      const [first, second] = splitWords(previousWord, words[i], testWord);
      yield first;
      words[i] = second;
      isCurrentValid = testWord(words[i]);
    } else {
      yield previousWord;
    }
    previousWord = words[i];
    isPreviousValid = isCurrentValid;
  }

  yield previousWord;
}

function buildWordsForward(text: string, testWord: (w: string) => IsWordSource): string[] {

  const letters = text.split(/\s+/).filter(x => x !== "");
  const size = letters.length;

  let currentWord = "";
  let currentEndIndex = -1;

  const covered = Array(size).fill(false);
  const words: IndexedWord[] = [];

  let start = 0
  let end = 1;

  while (true) {
    let possiblyWord = letters.slice(start, end).join('');

    if (testWord(possiblyWord)) {
      currentWord = possiblyWord;
      currentEndIndex = end;
    }

    end++;
    if ((end > size) || (end - start > 13)) {
      if (currentWord) {
        words.push({ start, end: currentEndIndex, word: currentWord });

        for (let i = start; i < currentEndIndex; i++) {
          covered[i] = true;
        }
      }

      start = currentEndIndex === -1 ? start + 1 : currentEndIndex;
      end = start + 1;

      currentWord = "";
      currentEndIndex = -1;
      if (start >= size || start === -1) {
        break;
      }

    }
  }

  const unusedIndexes = [...findUnused(covered)];
  const unusedWords: IndexedWord[] = [];
  for (const u of unusedIndexes) {
    const w = letters.slice(u.start, u.end).join("");
    unusedWords.push({ ...u, word: w });
  }

  if (unusedWords.length) {
    const allWords: string[] = [...combine(words, unusedWords)];
    return [...fixupWords(allWords, testWord)];
  } else {
    return words.map(x => x.word);
  }
}

function buildWordsBackwards(text: string, testWord: (w: string) => IsWordSource): string[] {

  const letters = text.split(/\s+/).filter(x => x !== "");
  const size = letters.length;

  let currentWord = "";
  let currentStartIndex = -1;

  const covered = Array(size).fill(false);
  const words: IndexedWord[] = [];

  let start = size - 1;
  let end = size;

  while (true) {
    let possiblyWord = letters.slice(start, end).join('');

    if (testWord(possiblyWord)) {
      currentWord = possiblyWord;
      currentStartIndex = start;
    }

    start--;
    if ((start < 0) || (end - start > 13)) {
      if (currentWord) {
        words.push({ start: currentStartIndex, end, word: currentWord });

        for (let i = currentStartIndex; i < end; i++) {
          covered[i] = true;
        }
      }

      end = currentStartIndex === -1 ? end - 1 : currentStartIndex;
      start = end - 1;

      currentWord = "";
      currentStartIndex = -1;
      if (end <= 0) {
        break;
      }

    }
  }
  words.reverse();

  const unusedIndexes = [...findUnused(covered)];
  const unusedWords: IndexedWord[] = [];
  for (const u of unusedIndexes) {
    const w = letters.slice(u.start, u.end).join("");
    unusedWords.push({ ...u, word: w });
  }

  if (unusedWords.length) {
    const allWords: string[] = [...combine(words, unusedWords)];
    return [...fixupWords(allWords, testWord)];
  } else {
    return words.map(x => x.word);
  }
}

function toScore(source: IsWordSource): number {
  switch (source) {
    case false:
      return -1;
    case "number":
      return 2;
    case "dictionary":
      return 3;
    case "dice":
      return 1;
  }
}

function whichMin(first: number, ...x: number[]) {
  let index = 0;
  let value = first;

  for (let i = 0; i < x.length; i++) {
    if (x[i] < value) {
      index = i + 1;
      value = x[i];
    }
  }

  return { index, value };
}

type Alignment = "=" | "S" | "I" | "D";
function getModifications(forwards: string[], backwards: string[]): Alignment[] {
  const matrix = Array.from({ length: forwards.length }).map(_ => Array.from({ length: backwards.length }).fill(0)) as number[][];
  for (let i = 1; i < backwards.length; i++) {
    matrix[0][i] = i;
  }
  for (let i = 1; i < forwards.length; i++) {
    matrix[i][0] = i;
  }

  for (let i = 1; i < forwards.length; i++) {
    for (let j = 1; j < backwards.length; j++) {
      const subsitutionCost = forwards[i] === backwards[j] ? 0 : 1;

      const min = whichMin(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + subsitutionCost);
      matrix[i][j] = min.value;
    }
  }

  let modifications: Alignment[] = [];
  let x = forwards.length - 1, y = backwards.length - 1;
  while (x > 0 && y > 0) {
    if (forwards[x] === backwards[y]) {
      modifications.push("=");
    }
    const min = whichMin(matrix[x - 1][y], matrix[x][y - 1], matrix[x - 1][y - 1]);
    if (min.index === 0) {
      x--;
      modifications.push("I");
    } else if (min.index === 1) {
      y--;
      modifications.push("D");
    } else {
      if (forwards[x] !== backwards[y]) {
        modifications.push("S");
      }
      x--;
      y--;
    }
  }

  if (x == 0 && y == 0 && forwards[x] === backwards[y]) {
    modifications.push("=");
  }

  while (x-- > 0) {
    modifications.push("I");
  }
  while (y-- > 0) {
    modifications.push("D");
  }

  return modifications.reverse();
}

type WordWithSource = { word: string; source: IsWordSource; };

function getBestByScore(fMismatch: WordWithSource[], bMismatch: WordWithSource[]) {
  const fScore = fMismatch.map(f => toScore(f.source)).reduce((x, y) => x + y, 0) / fMismatch.length;
  const bScore = bMismatch.map(b => toScore(b.source)).reduce((x, y) => x + y, 0) / bMismatch.length;

  return fScore > bScore ? fMismatch.map(f => f.word) : bMismatch.map(b => b.word);
}

function* buildConsensus(mods: Alignment[], forwards: string[], backwards: string[],
  fWordSource: IsWordSource[], bWordSource: IsWordSource[]) {

  forwards = forwards.toReversed();
  fWordSource = fWordSource.toReversed();
  backwards = backwards.toReversed();
  bWordSource = bWordSource.toReversed();

  let fMismatch: WordWithSource[] = [];
  let bMismatch: WordWithSource[] = [];

  for (const m of mods) {
    if (m === "=") {

      if (fMismatch.length || bMismatch.length) {
        yield* getBestByScore(fMismatch, bMismatch);
        fMismatch = [];
        bMismatch = [];
      }

      backwards.pop();
      bWordSource.pop();
      yield forwards.pop()!;
      fWordSource.pop();
    } else if (m === "S") {
      fMismatch.push({
        word: forwards.pop()!,
        source: fWordSource.pop()!
      });
      bMismatch.push({
        word: backwards.pop()!,
        source: bWordSource.pop()!
      });
    } else if (m === "D") {
      bMismatch.push({
        word: backwards.pop()!,
        source: bWordSource.pop()!
      });
    } else if (m === "I") {
      fMismatch.push({
        word: forwards.pop()!,
        source: fWordSource.pop()!
      });
    } else {
      throw "Unknown modification type: " + m;
    }
  }

  if (fMismatch.length || bMismatch.length) {
    yield* getBestByScore(fMismatch, bMismatch);
  }

}

function getBest(forwards: string[], backwards: string[], testWord: (w: string) => IsWordSource): string[] {
  const fWordSource = forwards.map(testWord);
  const bWordSource = backwards.map(testWord);

  const fAllWords = fWordSource.every(x => x);
  const bAllWords = bWordSource.every(x => x);

  if (fAllWords != bAllWords) {
    return fAllWords ? forwards : backwards;
  }

  if (forwards.length === backwards.length) {
    let score = 0;
    for (let i = 0; i < forwards.length; i++) {
      score += toScore(fWordSource[i]) - toScore(bWordSource[i]);
    }
    return score > 0 ? forwards : backwards;
  }

  const mods = getModifications(forwards, backwards);
  return [...buildConsensus(mods, forwards, backwards, fWordSource, bWordSource)];
}

function buildWords(text: string, testWord: (w: string) => IsWordSource): string {
  const forwards = buildWordsForward(text, testWord);
  const backwards = buildWordsBackwards(text, testWord);

  const forwardsResult = forwards.join(" ");

  if (forwards.length != backwards.length || forwardsResult != backwards.join(" ")) {
    const bestResult = getBest(forwards, backwards, testWord);
    return bestResult.join(" ");
  } else {
    return forwardsResult;
  }

}

function findSpecialChars(text: string): string | symbol {
  if (!text) return "";

  for (let special of specialChars) {
    if (text.match(special.regex)) {
      return special.symbol;
    }
  }

  return text;
}

function format(text: string | symbol, testWord: (w: string) => IsWordSource): string | SpecialChar {
  const type = typeof text;

  if (type === "string") {
    return buildWords(text as string, testWord);
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

function isDiceThrow(text: string) {
  return !!text.match(/^(?:\d+)?d(?:\d+)(?:(?:\+|-)\d+)?$/);
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
        case upperPossessive:
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

let cacheKey: string | null = null;
let cachedDictionary: Typo | null = null;

async function loadDictionary(customWords: string[]) {
  const key = customWords.join("|");
  if (cachedDictionary != null && cacheKey === key) {
    return cachedDictionary;
  }

  const dictionary = new Typo("en_US_FiveE_10", null, null, { dictionaryPath: "dictionaries", asyncLoad: true });
  while (!dictionary.loaded) {
    await sleep(100);
  }
  addCustomWords(dictionary, ...customWords);
  cacheKey = key;
  cachedDictionary = dictionary;
  return dictionary;
}

type IsWordSource = false | "dictionary" | "number" | "dice";

export default async function formatParagraph(text: string, customWords: string[]) {
  const dictionary = await loadDictionary(customWords);

  // let log = "";
  // for (const w of words.split("\n")) {
  //   if (!dictionary.check(w)) {
  //     log += w + "\n";
  //   }
  // }

  // console.log(log);

  const testWord = function (possiblyWord: string): IsWordSource {
    if (dictionary.check(possiblyWord)) {
      return "dictionary"
    }
    if (isNumber(possiblyWord)) {
      return "number";
    }
    if (isDiceThrow(possiblyWord)) {
      return "dice";
    }
    return false;
  }

  const lines = splitInput(text).map(findSpecialChars).filter(x => x !== "");
  const words = lines.map(l => format(l, testWord));

  return buildParagraph(words).join("");
}

