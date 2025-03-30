import { computed, Ref } from "vue";

import { InitWithId } from "@/types/Initiative";
import * as i from "./initiativeHelpers";

export const PartyNamePrefix = "party";
export const MonsterNamePrefix = "monster";

export function usePrefixes(prefix: Ref<string, string>) {
  const GroupNamePrefix = computed(() => prefix.value + "-");
  const FullPrefix = computed(() => i.makeKey(GroupNamePrefix.value + "-"));

  return { GroupNamePrefix, FullPrefix };
}

export function newEntry(entryId: number): InitWithId {
  return {
    id: entryId++,
    order: 0,
    name: "",
    conditions: {},
  };
}


const xpByCr = [0, 25, 50, 100, 200, 450, 700, 1100, 1800, 2300, 2900, 3900, 5000, 5900, 7200, 8400, 10000, 11500, 13000, 15000, 18000, 20000,
  22000, 25000, 33000, 41000, 50000, 62000, 75000, 90000, 105000, 120000, 135000, 155000];

export function crToIndex(cr: string) {
  if (cr === "0") return 0;
  if (cr === "1/8") return 1;
  if (cr === "1/4") return 2;
  if (cr === "1/2") return 3;
  return parseInt(cr) + 4;
}

export function indexToCr(index: number) {
  if (index === 0) return "0";
  if (index === 1) return "1/8";
  if (index === 2) return "1/4";
  if (index === 3) return "1/2";
  return (index - 4).toString();
}

export function crToXp(cr: string) {
  const index = crToIndex(cr);
  return xpByCr[index];
}