<template>
  <v-card>
    <v-card-text>
      <p>{{ name }}: {{ dayDisplay }}</p>
      <p>Phase: {{ phase }}</p>
      <p>Bonus: {{ bonus.value > 0 ? "+" : "" }}{{ bonus }}</p>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { MoonState } from "./moon";

defineProps<MoonState>();

</script>