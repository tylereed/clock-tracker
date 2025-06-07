import { MonsterO5e } from "@/utils/Open5e";

import { HalfDragonOptions, MerfolkOptions, TemplateOptions, TemplateType, ZombieOptions } from "./types";
import { applySquadTemplate } from "./a5e/squad";
import { appplySkeletonTemplate } from "./a5e/skeleton";
import { applyZombieTemplate } from "./a5e/zombie";
import { applyMerfolkTemplate } from "./a5e/merfolk";
import { applySahuaginTemplate } from "./a5e/sahuagin";
import { applyHalfDragonTemplate } from "./a5e/halfDragon";

export async function applyTemplate(template: TemplateType, stats: MonsterO5e, options?: TemplateOptions): Promise<MonsterO5e> {
  switch (template) {
    case "Squad":
      return applySquadTemplate(stats);
    case "Skeleton":
      return appplySkeletonTemplate(stats);
    case "Zombie":
      return applyZombieTemplate(stats, options as ZombieOptions);
    case "Merfolk":
      return applyMerfolkTemplate(stats, options as MerfolkOptions);
    case "Sahuagin":
      return applySahuaginTemplate(stats);
    case "Half-Dragon":
      return await applyHalfDragonTemplate(stats, options as HalfDragonOptions);
    default:
      throw "Unknown template: " + template;
  }
}
