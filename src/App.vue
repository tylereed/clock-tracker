<template>
  <v-app>
    <v-main>
    <v-card>
      <timer />
    </v-card>
      <clocks />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import Clocks from './pages/Clocks.vue';
import Timer from '@/components/timer/Timer.vue';
</script>