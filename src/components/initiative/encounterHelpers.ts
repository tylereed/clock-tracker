import { computed, Ref } from "vue";

import { InitWithId } from "@/types/Initiative";
import * as i from "./initiativeHelpers";

export const PartyNamePrefix = "party";
export const MonsterNamePrefix = "monster";

export function usePrefixes(prefix: Ref<string, string>) {
  const GroupNamePrefix = computed(() => prefix.value + "-");
  const FullPrefix = computed(() => i.makeKey(GroupNamePrefix.value  + "-"));

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