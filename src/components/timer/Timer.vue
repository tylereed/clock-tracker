<template>
  <v-card>
    <v-card-title>Timer</v-card-title>
    <v-card-text>{{ timerDisplay }}</v-card-text>
    <v-card-actions>
      <v-btn :disabled="!!time" @click="startTimer">Start</v-btn>
      <v-btn :disabled="!time" @click="stopResetTimer">{{ timer ? "Stop" : "Reset" }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const timer = ref<number | null>(null);
const time = ref(0);

const timerDisplay = computed(() => {
  const minutes = Math.floor(time.value / 60).toString().padStart(2, "0");
  const seconds = (time.value % 60).toFixed(2).padStart(5, "0");

  return `${minutes}:${seconds}`;
});

function startTimer() {
  if (timer.value) return;

  const startTime = Date.now();
  let currentTime = 0;
  function timerCallback() {
    const now = Date.now();
    const diff = (now - startTime) / 1000;
    if (diff > currentTime) {
      time.value = diff;
      currentTime = diff;
    }
  }
  timer.value = setInterval(timerCallback, 27) as unknown as number;
}

function stopResetTimer() {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  } else {
    time.value = 0;
  }
}

</script>