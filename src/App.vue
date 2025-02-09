<template>
  <v-app>
    <v-main>
      <v-sheet class="mx-2 rounded-b-lg d-flex align-center">
        <span class="text-h2 ml-2">GM Tools</span>
        <v-spacer />
        <settings class="ma-2" />
      </v-sheet>

      <v-card class="ma-2 position-relative" v-for="(t, i) in activeTiles" :key="i">
        <v-card-title>{{ t.title }}</v-card-title>
        <v-expand-transition>
          <v-sheet v-if="t.visible">
            <component :is="t.component" />
          </v-sheet>
        </v-expand-transition>
        <v-btn density="comfortable" :icon="t.visible ? 'mdi-chevron-up' : 'mdi-chevron-down'"
          class="position-absolute top-0 right-0 mt-1 mr-3" @click="toggle(i)" />
      </v-card>

    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, shallowRef } from "vue";

import Clocks from "@/pages/Clocks.vue";
import Timer from "@/pages/Timers.vue";
import Encounters from "@/pages/Encounters.vue";

import Tile from "./types/Tile";
import { clearCaches } from "@/utils/Cache";
import Settings from "./components/Settings.vue";

const activeTiles = ref<Tile[]>([]);

activeTiles.value.push(
  { visible: true, title: "Timers", component: shallowRef(Timer) },
  { visible: true, title: "Clocks", component: shallowRef(Clocks) },
  { visible: true, title: "Encounters", component: shallowRef(Encounters) }
);

function toggle(i: number) {
  activeTiles.value[i].visible = !activeTiles.value[i].visible;
}

clearCaches();
</script>