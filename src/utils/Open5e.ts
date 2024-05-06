import { BuildAsyncCache } from "./Cache";

const baseUrl = "https://api.open5e.com";
const monsterApi = `${baseUrl}/monsters/`;

type DocumentSlug = "o5e" | "wotc-srd" | "tob" | "cc" | "tob2" | "dmag" | "menagerie" | "tob3" | "a5e" | "kp" | "dmag-e" | "warlock" | "vom" | "toh" | "taldorei" | "blackflag" | "tob-2023";

interface Open5eListResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

interface Ability {
  name: string;
  desc: string;
}

interface Action extends Ability {
  attack_bonus?: number;
  damage_dice?: string;
}

export interface MonsterO5e {
  slug: string;
  name: string;
  size: string;
  type: string;
  subtype: string;
  group?: string;
  alignment: string;
  armor_class: number;
  armor_desc?: string;
  hit_points: number;
  hit_dice: string;
  speed: { [key: string]: number };
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  strength_save?: number;
  dexterity_save?: number;
  constitution_save?: number;
  intelligence_save?: number;
  wisdom_save?: number;
  charisma_save?: number;
  perception?: number;
  skills: { [key: string]: number };
  damage_vulnerabilities: string;
  damage_resistances: string;
  damage_immunities: string;
  condition_immunities: string;
  senses: string;
  languages: string;
  challenge_rating: string;
  cr?: number;
  actions?: Action[];
  bonus_actions?: Ability[];
  reactions?: Ability[];
  legendary_desc?: string;
  legendary_actions?: Ability[];
  special_abilities: Ability[];
  spell_list: string[];
  page_no?: number;
  environments: string[];
  img_main?: string;
  document__slug: DocumentSlug;
  document__title: string;
  document__license_url: string;
  document__url: string;
}

const monsterNameO5eStrings = ["slug", "name", "document__slug"] as const;
export type MonsterNameO5e = Pick<MonsterO5e, typeof monsterNameO5eStrings[number]>;

const monsterInitiativeO5eString = ["name"] as const;

async function* fetchList<T>(endpoint: string) {
  let url: string | undefined = endpoint;

  do {
    const response = await fetch(url);
    const json: Open5eListResponse<T> = await response.json();

    yield* json.results;
    url = json.next;
  } while (url);
}

const monsteListCache = BuildAsyncCache("localStorage", async (url) => {
  const result: MonsterNameO5e[] = [];
  for await (let monster of fetchList<MonsterNameO5e>(url)) {
    result.push(monster);
  }
  return result;
});

export async function getMonsterListCached(clearCache?: boolean) {
  const parameters = "fields=" + monsterNameO5eStrings.join(",") + "&limit=5000";
  const url = `${monsterApi}?${parameters}`;
  return await monsteListCache.getCachedItem(url, clearCache);
}

const monsterCache = BuildAsyncCache("localStorage", async (url) => {
  const response = await fetch(url);
  const json: MonsterO5e = await response.json();
  return json;
});
export async function getMonsterCached(name: string, clearCache?: boolean) {
  const url = `${monsterApi}${name}`;
  return await monsterCache.getCachedItem(url, clearCache);
}