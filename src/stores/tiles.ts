import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

const tiles = ["Timers", "Clocks", "Encounters"];

export const useTilesStore = defineStore("tiles", () => {

  const selectedTiles = useStorage("tiles", tiles);

  function allTiles() {
    return tiles;
  }

  return { allTiles, selectedTiles };
});