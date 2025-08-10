export interface NameDescription {
  name: string;
  description: string;
}

export interface StatBlock {
  name: string;
  type: string;
  alignment: string;
  ac: number;
  acSource: string;
  initiative?: number;
  hitpoints: number;
  hitDice: string;
  speed: string;
  str: number;
  strMod: number;
  strSave?: number;
  dex: number;
  dexMod: number;
  dexSave?: number;
  con: number;
  conMod: number;
  conSave?: number;
  int: number;
  intMod: number;
  intSave?: number;
  wis: number;
  wisMod: number;
  wisSave?: number;
  cha: number;
  chaMod: number;
  chaSave?: number;
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

interface HeaderTexts {
  name: string;
  type: string;
  alignment: string;
  ac: number;
  acSource: string;
  initiative?: number;
  hitpoints: number;
  hitDice: string;
  speed: string;
}

function getHeader(text: string): HeaderTexts {
  const lines = text.split(/\s*\n\s*/g);

  const result: Partial<HeaderTexts> = {};

  for (const line of lines) {
    if (!result.name) {
      result.name = line.trim();
      continue;
    }

    const typeMatch = line.match(/^\s*((?:Tiny|Small|Medium|Large|Huge|Gargantuan|Titanic)\s*[^,]+),\s*(.+?)\s*$/i);
    if (typeMatch) {
      result.type = typeMatch[1].trim();
      result.alignment = typeMatch[2].trim();
      continue;
    }

    const acMatch = line.match(/^\s*(?:AC|Armor Class)\s*(\d+)\s*(?:\((.+?)\))?/);
    if (acMatch) {
      result.ac = parseInt(acMatch[1]);
      result.acSource = acMatch[2]?.trim();
      continue;
    }

    const initMatch = line.match(/^\s*Initiative\s*\+(\d+)/i);
    if (initMatch) {
      result.initiative = parseInt(initMatch[1]);
      continue;
    }

    const hpMatch = line.match(/^\s*(?:HP|Hit Points)\s*(\d+)\s*\((.+?)\)/);
    if (hpMatch) {
      result.hitpoints = parseInt(hpMatch[1]);
      result.hitDice = hpMatch[2].trim();
      continue;
    }

    const speedMatch = line.match(/^\s*(?:Speed)\s*(\d+)\s*ft\./i);
    if (speedMatch) {
      result.speed = speedMatch[1].trim();
      continue;
    }
  }

  return {
    name: result.name ?? "",
    type: result.type ?? "",
    alignment: result.alignment ?? "",
    ac: result.ac ?? 0,
    acSource: result.acSource ?? "",
    initiative: result.initiative,
    hitpoints: result.hitpoints ?? 0,
    hitDice: result.hitDice ?? "",
    speed: result.speed ?? ""
  };
}

function buildAbilityScoreRegex(a1: string, a2?: string) {
  const end = a2 ? `\\D+\\b${a2}\\b` : '';
  const regexStr = `\\b${a1}\\b(?:[^0-9\\+\\-]+(?:[\\+-]?\\d+))+${end}`;
  return new RegExp(regexStr, "i");
}

interface AbilityScores {
  str: number;
  strMod: number;
  strSave?: number;
  dex: number;
  dexMod: number;
  dexSave?: number;
  con: number;
  conMod: number;
  conSave?: number;
  int: number;
  intMod: number;
  intSave?: number;
  wis: number;
  wisMod: number;
  wisSave?: number;
  cha: number;
  chaMod: number;
  chaSave?: number;
}

type ScoreName = "str" | "dex" | "con" | "int" | "wis" | "cha";
function setAbilityScores(result: any, text: string, scoreStart: ScoreName, scoreEnd?: ScoreName) {
  const getNumbers = /(\+|-)?\d+/g;

  const r = buildAbilityScoreRegex(scoreStart, scoreEnd);
  const rMatch = text.match(r);
  if (rMatch) {
    const numbers = [...rMatch[0].matchAll(getNumbers).map(x => x[0])];
    result[scoreStart] = numbers.length > 0 ? parseInt(numbers[0]) : undefined;
    result[scoreStart + "Mod"] = numbers.length > 1 ? parseInt(numbers[1]) : undefined;
    result[scoreStart + "Save"] = numbers.length > 2 ? parseInt(numbers[2]) : undefined;
  }
}

function getAbilityScores(text: string) {
  const result: Partial<AbilityScores> = {};

  const beginMatch = text.match(/\bSTR\b/i);
  const skillsMatch = text.match(/\bSkills\b/i);

  const abilityScoresText = text.slice(beginMatch?.index, skillsMatch?.index);

  setAbilityScores(result, abilityScoresText, "str", "dex");
  setAbilityScores(result, abilityScoresText, "dex", "con");
  setAbilityScores(result, abilityScoresText, "con", "int");
  setAbilityScores(result, abilityScoresText, "int", "wis");
  setAbilityScores(result, abilityScoresText, "wis", "cha");
  setAbilityScores(result, abilityScoresText, "cha");

  return result as AbilityScores;
}

interface SkillBlock {
  skills: string;
  senses: string;
  languages: string;
  cr: number;
  xp: number;
}

function getSkills(text: string) {
  const result: Partial<SkillBlock> = {};

  const beginMatch = text.match(/\bSkills\b/);
  const endMatch = text.match(/\b(?:CR|Challenge)\b.*?$/);

  const endIndex = endMatch?.index ? endMatch.index + endMatch[0].length : undefined;
  const skillBlock = text.slice(beginMatch?.index, endIndex);

  const lines = skillBlock.split(/\s*\n\s*/g);

  for (const line of lines) {

    if (/^Skills/i.test(line)) {
      result.skills = line.slice(6).trim();
      continue;
    }

    if (/^Senses/i.test(line)) {
      result.senses = line.slice(6).trim();
      continue;
    }

    if (/^Languages/i.test(line)) {
      result.languages = line.slice(9).trim();
      continue;
    }

    const crMatch = line.match(/^\s*(?:CR|Challenge)\s*(\d+)/i);
    if (crMatch) {
      result.cr = parseInt(crMatch[1]);
    }
  }

  return result as SkillBlock;
}

export default function parseCustomMonster(text: string): StatBlock {

  const header = getHeader(text);

  const abilityScores = getAbilityScores(text);

  const skills = getSkills(text);

  const endMatch = text.match(/\b(?:CR|Challenge)\b.*?\n/);
  const traitStart = endMatch?.index ? endMatch.index + endMatch[0].length : 0;

  const abilityRanges = getAbilityRanges(text);
  const traitEnd = Math.min(abilityRanges.action?.start ?? Number.MAX_SAFE_INTEGER,
    abilityRanges.bonusAction?.start ?? Number.MAX_SAFE_INTEGER,
    abilityRanges.reaction?.start ?? Number.MAX_SAFE_INTEGER,
    abilityRanges.legendaryAction?.start ?? Number.MAX_SAFE_INTEGER);

  const traits = extractAbility(text, { start: traitStart, end: traitEnd });
  const actions = extractAbility(text, abilityRanges.action);
  const bonusActions = extractAbility(text, abilityRanges.bonusAction);
  const legendaryActions = extractAbility(text, abilityRanges.legendaryAction);
  const reactions = extractAbility(text, abilityRanges.reaction);

  return {
    ...header,
    ...abilityScores,
    ...skills,
    traits,
    actions,
    bonusActions,
    legendaryActions,
    reactions
  } as StatBlock;
}