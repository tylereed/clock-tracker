import { react } from "@babel/types";

interface NameDescription {
  name: string;
  description: string;
}

export interface StatBlock {
  name: string;
  type: string;
  alignment: string;
  ac: number;
  acSource: string;
  hitpoints: number;
  hitDice: string;
  speed: string;
  str: number;
  strMod: number;
  dex: number;
  dexMod: number;
  con: number;
  conMod: number;
  int: number;
  intMod: number;
  wis: number;
  wisMod: number;
  cha: number;
  chaMod: number;
  skills: string;
  senses: string;
  languages: string;
  cr: number;
  xp: number;
  traits?: NameDescription[];
  actions?: NameDescription[];
  bonusActions?: NameDescription[];
  reactions?: NameDescription[];
  legendaryActions?: NameDescription[];
}

interface Range {
  start: number;
  end: number;
}

function createScoreAbilityMatchFunc(header: string) {
  const headerLower = header.toLocaleLowerCase();
  return (text: string, match: RegExpExecArray) => {
    let score = 0;
    if (match[0] === header) {
      score += 0.5;
    } else if (match[0] === headerLower) {
      score += 0.125;
    } else if (match[0].toLocaleLowerCase() === headerLower) {
      // Mixed case, assuming it's 'Header', which should score better than all lower
      score += 0.25;
    }

    if ((match.indices?.length ?? 0) >= 1) {
      const wholeMatch = match.indices![0];
      if (text.charAt(wholeMatch[0] - 1) === "\n") {
        score += 0.25;
      }
      if (text.charAt(wholeMatch[1]) === "\n") {
        score += 0.25;
      }
    }

    return { match, score } as const;
  };
}

function* scoreMatches(text: string, regex: RegExp,
  scoreMethod: (text: string, match: RegExpExecArray) => { match: RegExpExecArray, score: number }) {

  const matches = text.matchAll(regex);

  for (const match of matches) {
    yield scoreMethod(text, match);
  }
}

function getBestMatch(text: string, regex: RegExp,
  scoreMethod: (text: string, match: RegExpExecArray) => { match: RegExpExecArray, score: number }) {
  if (!regex.hasIndices) throw "scoreActionMatch requires 'd' flag to be set.";

  // Score threshold of 0.25 is so really bad matches aren't parsed
  const matches = [...scoreMatches(text, regex, scoreMethod)].filter(m => m.score >= 0.25);

  if (matches.length === 0) return null;

  return matches.reduce((best, next) => best.score > next.score ? best : next);
}

interface AbilitityTextRanges {
  action?: Range;
  bonusAction?: Range;
  legendaryAction?: Range;
  reaction?: Range;
}

function preceedes(text: string, p: string, end: number) {
  return text.slice(end - p.length, end).toLocaleLowerCase() === p;
}

function getAbilityRanges(text: string): AbilitityTextRanges {
  // "Actions" is contained within other header types, so make sure they don't preceede this match
  const scoreActionsBase = createScoreAbilityMatchFunc("ACTIONS");
  const scoreActions = (text: string, match: RegExpExecArray) => {
    const baseResult = scoreActionsBase(text, match);
    const end = baseResult.match.index;
    if (preceedes(text, "bonus ", end) ||
      preceedes(text, "legendary ", end) ||
      preceedes(text, "re", end)) {
      return { match: baseResult.match, score: 0 };
    }
    return baseResult;
  };


  const actionMatch = getBestMatch(text, /ACTIONS/igd, scoreActions);
  const bonusMatch = getBestMatch(text, /BONUS ACTIONS/igd, createScoreAbilityMatchFunc("BONUS ACTIONS"));
  const legendaryMatch = getBestMatch(text, /LEGENDARY ACTIONS/igd, createScoreAbilityMatchFunc("LEGENDARY ACTIONS"));
  const reactionMatch = getBestMatch(text, /REACTIONS/igd, createScoreAbilityMatchFunc("REACTIONS"));

  const abilities: { match: RegExpExecArray, score: number, type: keyof AbilitityTextRanges }[] = [];

  if (actionMatch != null) abilities.push({ ...actionMatch, type: "action" });
  if (bonusMatch != null) abilities.push({ ...bonusMatch, type: "bonusAction" });
  if (legendaryMatch != null) abilities.push({ ...legendaryMatch, type: "legendaryAction" });
  if (reactionMatch != null) abilities.push({ ...reactionMatch, type: "reaction" });

  if (abilities.length === 0) return {};

  abilities.sort((a, b) => a.match.index - b.match.index);

  const result: AbilitityTextRanges = {};
  for (let i = 0; i < abilities.length - 1; i++) {
    const a = abilities[i];
    const b = abilities[i + 1];

    result[a.type] = { start: a.match.index + a.match[0].length, end: b.match.index };
  }
  const last = abilities.at(-1)!;
  result[last.type] = { start: last.match.index + last.match[0].length, end: text.length };

  return result;
}

function countSpaces(match: RegExpMatchArray) {
  return [...match[1].matchAll(/\s+/g)].length;
}

function* extractNameDescLines(text: string) {
  text = text.trim();

  const lines = text.split(/\s*\n\s*/g);

  let previous: string[] = [];
  for (const line of lines) {
    // /^(.+?)(?:\s*\(.+?\))?\.\s*/
    // /^(.+?)\./
    const nameMatch = line.match(/^(.+?)(?:\s*\(.+?\))?\.\s*/);
    if (nameMatch && nameMatch[0].length != line.length && countSpaces(nameMatch) < 3 && previous?.at(-1)?.at(-1) === ".") {
      if (previous.length) {
        yield previous.join(" ");
        previous = [];
      }
    }
    previous.push(line);
  }

  if (previous.length) yield previous.join(" ");
}

function* buildNameDescList(lines: Iterable<string>) {
  for (const line of lines) {
    const nameMatch = line.match(/^(.+?)\.\s*/);
    const name = nameMatch![1];
    const description = line.substring(nameMatch![0].length);

    yield { name, description };
  }
}

function extractAbility(text: string, range?: Range) {
  if (range) {
    const abilityText = text.slice(range.start, range.end);
    const abilityLines = extractNameDescLines(abilityText);
    const abilities = buildNameDescList(abilityLines);
    return [...abilities];
  }

  return undefined;
}

export default function parseCustomMonster(text: string): StatBlock {

  const abilityRanges = getAbilityRanges(text);

  const actions = extractAbility(text, abilityRanges.action);
  const bonusActions = extractAbility(text, abilityRanges.bonusAction);
  const legendaryActions = extractAbility(text, abilityRanges.legendaryAction);
  const reactions = extractAbility(text, abilityRanges.reaction);

  return {
    actions,
    bonusActions,
    legendaryActions,
    reactions
  } as StatBlock;
}