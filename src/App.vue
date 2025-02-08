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
import Timer from "@/pages/Timers.vue";
import Encounters from "@/pages/Encounters.vue";

import Tile from "@/types/Tile";
import { clearCaches } from "@/utils/Cache";
import Settings from "@/components/settings/Settings.vue";
import { useTilesStore } from "@/stores/tiles";

const tilesStore = useTilesStore();

const tiles = [
  { visible: false, title: "Timers", component: shallowRef(Timer) },
  { visible: false, title: "Clocks", component: shallowRef(Clocks) },
  { visible: false, title: "Encounters", component: shallowRef(Encounters) }
];
const allTiles = new Map(tiles.map(t => [t.title, t]));

const activeTiles = ref<Map<string, Tile>>(new Map());
setActiveTiles();

watch(() => tilesStore.selectedTiles, setActiveTiles);

function setActiveTiles() {
  activeTiles.value.clear();
  const tilesOrder = tilesStore.allTiles();
  const sortedTiles = tilesStore.selectedTiles.toSorted((x, y) => tilesOrder.indexOf(x) - tilesOrder.indexOf(y));
  for (const t of sortedTiles) {
    activeTiles.value.set(t, allTiles.get(t)!);
  }
}

function toggle(name: string) {
  const tile = activeTiles.value.get(name)!;
  tile.visible = !tile.visible;
}

clearCaches();
</script>