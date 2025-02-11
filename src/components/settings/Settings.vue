<template>
  <v-menu :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-btn icon="mdi-cog" v-bind="props" class="mx-2" />
    </template>

    <v-list>
      <v-list-item>
        <dark-mode-toggle class="mx-2" />
      </v-list-item>
      <v-list-item v-for="t in tilesStore.allTiles()">
        <v-checkbox v-model="tilesStore.selectedTiles" :label="t" :value="t" true-icon="mdi-check-circle"
          color="primary" false-icon="mdi-close-circle" base-color="error" hide-details density="compact" />
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import DarkModeToggle from "@/components/settings/DarkModeToggle.vue";

import { useTilesStore } from "@/stores/tiles";

const tilesStore = useTilesStore();
</script>