<template>
  <v-app>
    <v-main>
      <v-sheet class="mx-2 rounded-b-lg d-flex align-center">
        <span class="text-h2 ml-2">GM Tools</span>
        <v-spacer />
        <settings class="ma-2" />
      </v-sheet>

      <v-card class="ma-2 position-relative" v-for="[name, t] in activeTiles" :key="name">
        <v-card-title>{{ t.title }}</v-card-title>
        <v-expand-transition>
          <v-sheet v-if="t.visible">
            <component :is="t.component" />
          </v-sheet>
        </v-expand-transition>
        <v-btn density="comfortable" :icon="t.visible ? 'mdi-chevron-up' : 'mdi-chevron-down'"
          class="position-absolute top-0 right-0 mt-1 mr-3" @click="toggle(name)" />
      </v-card>

    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, shallowRef, watch } from "vue";

import Clocks from "@/pages/Clocks.vue";
import Encounters from "@/pages/Encounters.vue";
import Timer from "@/pages/Timers.vue";
import WordFormatter from "@/pages/WordFormatter.vue";
import MoonTracker from "@/pages/MoonTracker.vue";

import Tile from "@/types/Tile";
import { clearCaches } from "@/utils/Cache";
import Settings from "@/components/settings/Settings.vue";
import { useTilesStore, tileIds } from "@/stores/tiles";
import { getUnique } from "./utils/helpers";

const tilesStore = useTilesStore();

function* buildTiles() {
  function buildTile(id: string, shallow: any) {
    const t = {
      id: id,
      visible: tilesStore.openTiles.includes(id),
      title: tilesStore.tileIdToName(id)!,
      component: shallow
    };
    return [id, t] as const;
  }

  yield buildTile(tileIds.Timer, shallowRef(Timer));
  yield buildTile(tileIds.Clock, shallowRef(Clocks));
  yield buildTile(tileIds.Encounter, shallowRef(Encounters));
  yield buildTile(tileIds.WordFormatter, shallowRef(WordFormatter));
  yield buildTile(tileIds.MoonTracker, shallowRef(MoonTracker));
}

const allTiles = new Map(buildTiles());

const activeTiles = ref<Map<string, Tile>>(new Map());
setActiveTiles();

watch(() => tilesStore.selectedTiles, setActiveTiles);

function setActiveTiles() {
  activeTiles.value.clear();
  const tilesOrder = tilesStore.allTiles();
  const sortedTiles = tilesStore.selectedTiles.toSorted((x, y) => tilesOrder.indexOf(x) - tilesOrder.indexOf(y));
  for (const tileId of sortedTiles) {
    const tile = allTiles.get(tileId);
    if (tile) {
      activeTiles.value.set(tileId, tile);
    }
  }
}

function toggle(name: string) {
  const tile = activeTiles.value.get(name)!;
  tile.visible = !tile.visible;

  const openTiles = [...activeTiles.value.values()].filter(t => t.visible).map(t => t.title);
  tilesStore.openTiles = getUnique(...openTiles);
}

clearCaches();
</script>