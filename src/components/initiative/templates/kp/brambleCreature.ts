import { MonsterO5e } from "@/utils/Open5e";

export function canApplyBrambleTemplate(stats: MonsterO5e) {
  return stats.type === "Beast";
}

export function applyBrambleTemplate(stats: MonsterO5e) {
  const template = { ...stats };


}