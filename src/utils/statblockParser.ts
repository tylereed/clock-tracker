
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
  traits: NameDescription[];
  actions: NameDescription[];
  bonusActions: NameDescription[];
  reactions: NameDescription[];
  legendaryActions: NameDescription[];
}

interface Range {
  start: number;
  end: number;
}

function* scoreActionMatch(text: string, matches: IterableIterator<RegExpMatchArray>) {
  for (const match of matches) {
    if (match[0] === "ACTIONS" && match.index) {
      yield [match, 1.0];
    } else if (match[0].toLocaleLowerCase() === "actions") {

    }
  }
}

function getActionRange(text: string): Range {
  const matches = text.matchAll(/ACTIONS/igd);

  return { start: 0, end: 0 };
}

export default function parseCustomMonster(text: string) {
  getActionRange(text);
}