import { computed, Ref, ref, watch } from "vue";
import { defineStore, storeToRefs } from "pinia";

import Initiative, { Initiatives, InitKey, InitWithId } from "@/types/Initiative";

import * as i from "@/components/initiative/initiativeHelpers";
import { newEntry } from "@/components/initiative/encounterHelpers";

let entryId = 0;

function* loadAllGroups(prefix: InitKey): Generator<readonly [string, Initiatives], void, unknown> {
  let returned = false;

  for (const [groupKey, displayName] of loadGroupNameKeys(prefix)) {
    returned = true;
    const group = i.loadInits(groupKey);
    yield [displayName, group] as const;
  }

  if (!returned) {
    yield ["Default", [newEntry(0)]] as const;
  }
}

function* loadGroupNameKeys(prefix: InitKey) {
  const count = localStorage.length;
  const prefixLength = prefix.length;

  for (let i = 0; i < count; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(prefix)) {
      yield [key, key.substring(prefixLength)] as [InitKey, string];
    }
  }
}

export function useGroupStoreNamed(name: string) {
  const key = i.makeKey(name + "-");
  const useStore = defineStore(key, () => {
    const groups = loadAllGroups(key);

    const allInitiatives = ref<Map<string, Initiatives>>(new Map<string, Initiatives>(groups));
    const names = computed(() => allInitiatives.value ? [...allInitiatives.value.keys()] : []);
    entryId = [...allInitiatives.value.values()].flatMap(x => x).map(x => x.order).reduce((x, y) => x > y ? x : y, 0);

    function nextEntryId() {
      return entryId++;
    }

    return { allInitiatives, names, nextEntryId };
  });
  return useStore();
}