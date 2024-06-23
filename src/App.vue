<template>
  <v-app>
    <v-main>
      <timer />
      <clocks />
      <initiative-tracker />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import Clocks from "@/pages/Clocks.vue";
import Timer from "@/pages/Timers.vue";
import InitiativeTracker from "@/pages/InitiativeTracker.vue";
</script>