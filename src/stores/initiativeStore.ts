import { computed, Ref, ref, watch } from "vue";
import { defineStore, storeToRefs } from "pinia";

import Initiative, { Initiatives, InitWithId } from "@/types/Initiative";

// export const useInitiativeStore = defineStore("initiative", () => {
//   const initiatives = ref<Initiatives>([]);

//   return { initiatives };
// });

export function useInitiativeStoreNamed(name: string): Ref<Initiatives> {
  const useStore = defineStore(name, () => {
    const initiatives = ref<Initiatives>([]);
    return { initiatives };
  });
  const { initiatives } = storeToRefs(useStore());
  return initiatives;
};