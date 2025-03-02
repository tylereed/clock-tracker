import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

const tiles = ["Timers", "Clocks", "Encounters", "Word Formatter"];

export const useTilesStore = defineStore("tiles", () => {

  const selectedTiles = useStorage("tiles", tiles);
  const openTiles = useStorage<string[]>("openTiles", [], sessionStorage);

  function allTiles() {
    return tiles;
  }

  return { allTiles, openTiles, selectedTiles };
});