import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";

import Initiative, { Initiatives, InitWithId } from "@/types/Initiative";

export const useInitiativeStore = defineStore("initiative", () => {
  const initiatives = ref<Initiatives>([]);

  function addInitiative(init: InitWithId) {
    initiatives.value.push(init);
  }

  //const all

  return { initiatives, addInitiative };
});