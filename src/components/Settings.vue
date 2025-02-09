<template>
  <v-menu :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-btn icon="mdi-cog" v-bind="props" class="mx-2" />
    </template>

    <v-list>
      <v-list-item>
        <dark-mode-toggle class="mx-2" />
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import DarkModeToggle from "@/components/DarkModeToggle.vue";
</script>