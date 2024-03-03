<template>
  <v-card>
    <v-card-title>Timer</v-card-title>
    <v-card-text :style="timerDisplayStyle">{{ timerDisplay }}</v-card-text>
    <v-card-actions>
      <v-btn @click="startTimer" v-if="!isRunning">{{ time ? "Resume" : "Start" }}</v-btn>
      <v-btn @click="pauseTimer" v-if="isRunning">Pause</v-btn>
      <v-btn :disabled="!time" @click="resetTimer">Reset</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';

const runningId = ref<number | null>(null);
const pausedId = ref<number | null>(null);
const time = ref(0);
const isRunning = ref(false);
let timePauses = 0

const timerDisplay = computed(() => {
  const minutes = Math.floor(time.value / 60).toString().padStart(2, "0");
  const seconds = (time.value % 60).toFixed(2).padStart(5, "0");

  return `${minutes}:${seconds}`;
});

const timerDisplayStyle = reactive<{ visibility: "visible" | "hidden" }>({
  visibility: "visible"
});

function startTimer() {
  if (isRunning.value) return;

  if (pausedId.value) {
    clearInterval(pausedId.value);
    timerDisplayStyle.visibility = "visible";
    pausedId.value = null;
  }

  const startTime = Date.now();
  let currentTime = 0;
  function timerCallback() {
    const now = Date.now();
    const diff = (now - startTime) / 1000;
    if (diff > currentTime) {
      time.value = timePauses + diff;
      currentTime = diff;
    }
  }

  isRunning.value = true;
  runningId.value = setInterval(timerCallback, 27) as unknown as number;
}

function pauseTimer() {
  if (runningId.value) {
    clearInterval(runningId.value);
    timePauses = time.value;
    isRunning.value = false;
    //timerDisplayStyle.visibility = "hidden";
    pausedId.value = setInterval(() => timerDisplayStyle.visibility = (timerDisplayStyle.visibility == "visible" ? "hidden" : "visible"), 500) as unknown as number;
  }
}

function resetTimer() {
  if (runningId.value) {
    clearInterval(runningId.value);
    runningId.value = null;
    isRunning.value = false;

    if (pausedId.value) {
      clearInterval(pausedId.value);
      timerDisplayStyle.visibility = "visible";
      pausedId.value = null;
    }

    time.value = 0;
    timePauses = 0;
  }
}

</script>