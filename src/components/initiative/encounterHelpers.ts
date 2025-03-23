import { computed, Ref } from "vue";

import * as i from "./initiativeHelpers";
import { Initiatives } from "@/types/Initiative";

export const PartyNamePrefix = "party";
export const MonsterNamePrefix = "monster";

export function usePrefixes(prefix: Ref<string, string>) {
  const GroupNamePrefix = computed(() => prefix.value + "-");
  const FullPrefix = computed(() => i.makeKey(GroupNamePrefix.value));

  return { GroupNamePrefix, FullPrefix };
}