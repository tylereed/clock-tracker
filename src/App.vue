<template>
  <v-app>
    <v-main>

      <v-expansion-panels>
        <v-expansion-panel>

        </v-expansion-panel>
      </v-expansion-panels>

      <template v-for="t in activeTiles">
        <v-card class="ma-2 position-relative">
          <v-card-title>{{ t.title }}</v-card-title>
          <v-slide-y-transition>
            <v-sheet v-if="t.visible">
              <component :is="t.component" />
            </v-sheet>
          </v-slide-y-transition>
          <v-switch v-model:model-value="t.visible" class="position-absolute top-0 right-0 mr-3" />
        </v-card>
      </template>

      <!-- <timer />
      <clocks />
      <encounters /> -->
      <!-- 
      <dark-mode-toggle class="position-absolute top-0 right-0 mr-3" /> -->
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue";

import Clocks from "@/pages/Clocks.vue";
import Timer from "@/pages/Timers.vue";
import Encounters from "@/pages/Encounters.vue";
import DarkModeToggle from "@/components/DarkModeToggle.vue";

import Tile from "./types/Tile";
import { clearCaches } from "@/utils/Cache";

const activeTiles = ref<Tile[]>([]);

activeTiles.value.push(
  { visible: true, title: "Timers", component: Timer },
  { visible: true, title: "Clocks", component: Clocks },
  { visible: true, title: "Encounters", component: Encounters }
);

clearCaches();
</script>