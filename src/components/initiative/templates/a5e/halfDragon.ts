import { getMonsterCached, MonsterO5e } from "@/utils/Open5e";
import { HalfDragonOptions } from "../types";
import { appendList, modifyBlindSight, modifyDarkvision, stringToCr } from "../utils";

// The template says that it's the lowest cr of that age group, but we cheat a bit and just take the average
const ancientCr = 24;
const adultCr = 18;
const youngCr = 9;

function buildSlug(age: string, color: string) {
  if (age === "wyrmling") {
    return `${color}-dragon-${age}-a5e`.toLocaleLowerCase()
  }
  return `${age}-${color}-dragon-a5e`.toLocaleLowerCase();
}

// instead of taking all the breath weapons and duplicating the contents, we just pull from the O5e api
async function getBreathWeapon(cr: number, color: string) {

  let age;
  if (cr >= ancientCr) {
    age = "ancient";
  } else if (cr >= adultCr) {
    age = "adult";
  } else if (cr >= youngCr) {
    age = "young"
  } else {
    age = "wyrmling"
  }

  const slug = buildSlug(age, color);
  const monster = await getMonsterCached(slug);
  const [breath] = monster.actions?.filter(a => a.name.match(/Breath/))!;
  return breath;
}

export async function applyHalfDragonTemplate(stats: MonsterO5e, options: HalfDragonOptions): Promise<MonsterO5e>  {
  const template = { ...stats };

  template.name = "Half-Dragon " + stats.name;

  if (stats.languages.length > 1) {
    template.languages = appendList(stats.languages, "Draconic");
  }

  const withDarkVision = modifyDarkvision(stats.senses, 60);
  template.senses = modifyBlindSight(withDarkVision, 10);

  const cr = stringToCr(stats.challenge_rating);
  if (cr >= 9 && (template.speed.fly ?? 0) < 60) {
    template.speed.fly = 60;

    template.special_abilities ??= [];
    template.special_abilities.push({
      name: "Wings",
      desc: "The half-dragon gains wings and a fly speed of 60."
    });
  }

  const breath = await getBreathWeapon(cr, options.type);
  template.actions ??= [];
  template.actions.push(breath);

  return template;
}