import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const tileIds = {
  get Timer() { return "Timers" },
  get Clock() { return "Clocks" },
  get Encounter() { return "Encounters" },
  get WordFormatter() { return "WordFormatter" },
  get MoonTracker() { return "MoonTracker" },
};

const tiles = [tileIds.Timer, tileIds.Clock, tileIds.Encounter, tileIds.WordFormatter, tileIds.MoonTracker];
const tilesName = new Map([
  [tileIds.Timer, "Timers"],
  [tileIds.Clock, "Clocks"],
  [tileIds.Encounter, "Encounters"],
  [tileIds.WordFormatter, "Word Formatter"],
  [tileIds.MoonTracker, "Krynn Moon Tracker"],
]);

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

  function tileIdToName(id: string) {
    return tilesName.get(id);
  }

  return { allTiles, openTiles, selectedTiles, tileIdToName };
});