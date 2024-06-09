<template>
  <v-app>
    <v-main>
      <v-card class="ma-2">
        <timer />
      </v-card>
      <clocks />
      <initiative-tracker />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import Clocks from "@/pages/Clocks.vue";
import Timer from "@/components/timer/Timer.vue";
import InitiativeTracker from "@/pages/InitiativeTracker.vue";
</script>