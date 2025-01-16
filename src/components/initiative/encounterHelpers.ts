import { computed, Ref } from "vue";

import * as i from "./initiativeHelpers";

export const PartyNamePrefix = "party";
export const MonsterNamePrefix = "monster";

export function usePrefixes(prefix: Ref<string, string>) {
  const GroupNamePrefix = computed(() => prefix + "-");
  const FullPrefix = computed(() => i.makeKey(GroupNamePrefix.value));

  return { GroupNamePrefix, FullPrefix };
}