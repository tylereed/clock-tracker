import { ref } from "vue";
import { defineStore } from "pinia";

const tiles = ["Timers", "Clocks", "Encounters"];

export const useTilesStore = defineStore("tiles", () => {

  const selectedTiles = ref<string[]>([...tiles]);

  function allTiles() {
    return tiles;
  }

  return { allTiles, selectedTiles };
});