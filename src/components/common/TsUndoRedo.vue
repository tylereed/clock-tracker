<template>
  <v-btn :disabled="!executor.canUndo.value" @click="() => executor.undo()">
    <v-icon icon="mdi-undo" />
  </v-btn>
  <v-btn :disabled="!executor.canRedo.value" @click="() => executor.redo()">
    <v-icon icon="mdi-redo" />
  </v-btn>
</template>

<script setup lang="ts">
import { Executor } from "@/utils/Executor";

const props = defineProps<{ executor: Executor }>();
</script>
