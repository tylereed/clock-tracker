import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { Initiatives, InitKey } from "@/types/Initiative";

import { newEntry } from "@/components/initiative/encounterHelpers";
import * as i from "@/components/initiative/initiativeHelpers";

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
    entryId = [...allInitiatives.value.values()].flatMap(x => x).map(x => x.order).reduce((x, y) => x > y ? x : y, 0) + 1;

    function nextEntryId() {
      return entryId++;
    }

    function getInitiative(name?: string) {
      if (!name) {
        return null;
      }

      const init = allInitiatives.value.get(name);
      if (!init) {
        return null;
      }

      return init;
    }

    return { allInitiatives, names, nextEntryId, getInitiative };
  });
  return useStore();
}