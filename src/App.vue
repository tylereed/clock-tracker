<template>
  <v-app>
    <v-main>
      <timer />
      <clocks />
      <encounters />

      <dark-mode-toggle class="position-absolute top-0 right-0 mr-3" />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import Clocks from "@/pages/Clocks.vue";
import Timer from "@/pages/Timers.vue";
import Encounters from "@/pages/Encounters.vue";
import DarkModeToggle from "@/components/DarkModeToggle.vue";
</script>