import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

const tiles = ["Timers", "Clocks", "Encounters", "Word Formatter"];

export const useTilesStore = defineStore("tiles", () => {

  const selectedTiles = useStorage("tiles", tiles);
  // Fixes bug where the app would fail to render if name in storage didn't exist (e.g. switching branches)
  selectedTiles.value = selectedTiles.value.filter(name => tiles.includes(name));
  if (!selectedTiles.value.length) {
    selectedTiles.value = tiles;
  }

  const openTiles = useStorage<string[]>("openTiles", [], sessionStorage);
  openTiles.value = openTiles.value.filter(name => tiles.includes(name));

  function allTiles() {
    return tiles;
  }

  return { allTiles, openTiles, selectedTiles };
});