<template>
  <v-card class="ma-2">
    <v-card-item><v-card-title>Timers</v-card-title></v-card-item>
    <v-card-text>
      <v-container fluid>
        <v-row dense>
          <v-col cols="2" v-for="(timer, index) in timers" :key="'Timer' + index">
            <timer-vue v-bind="timer" @delete-timer="deleteTimer" @start-timer="startTimer" @pause-timer="pauseTimer"
              @reset-timer="resetTimer" />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="clearTimers" variant="outlined" color="error">Clear Timers</v-btn>
      <ts-expando-button :actions="addTimerButtons" />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import TimerVue from "@/components/timer/Timer.vue";
import TsExpandoButton from "@/components/common/TsExpandoButton.vue";
import { reactive, ref } from "vue";
import { Timer } from "@/types/Timer";

type Timers = Timer[];

const timers = ref<Timers>([]);

function clearTimers() {
  timers.value.length = 0;
  addTimer();
}

const addTimerButtons = reactive([
  { label: "Add Timer", action: addTimer }
]);

function addTimer() {
  timers.value.push({
    id: timers.value.length,
    runningId: null,
    pausedId: null,
    time: 0,
    isRunning: false,
    timePauses: 0,
    isTimerDisplay: true
  });
}

function deleteTimer(id: number) {
  if (id < 0) return;
  if (id >= timers.value.length) return;

  const toRemove = timers.value.splice(id, 1)[0];
  for (let i = id; i < timers.value.length; i++) {
    timers.value[i].id = i;
  }
  if (toRemove.runningId) {
    clearInterval(toRemove.runningId);
  }
  if (toRemove.pausedId) {
    clearInterval(toRemove.pausedId);
  }
  if (timers.value.length === 0) {
    addTimer();
  }
}

function startTimer(id: number) {
  const timer = timers.value[id];
  if (timer.isRunning) return;

  if (timer.pausedId) {
    clearInterval(timer.pausedId);
    timer.isTimerDisplay = true;
    timer.pausedId = null;
  }

  const startTime = Date.now();
  let currentTime = 0;

  timer.isRunning = true;
  timer.runningId = setInterval(function () {
    const now = Date.now();
    const diff = (now - startTime) / 1000;
    if (diff > currentTime) {
      timer.time = timer.timePauses + diff;
      currentTime = diff;
    }
  }, 27) as unknown as number;
}

function pauseTimer(id: number) {
  const timer = timers.value[id];
  if (timer.runningId) {
    clearInterval(timer.runningId);
    timer.timePauses = timer.time;
    timer.isRunning = false;

    timer.pausedId = setInterval(() => timer.isTimerDisplay = !timer.isTimerDisplay, 500) as unknown as number;
  }
}

function resetTimer(id: number) {
  const timer = timers.value[id];
  if (timer.runningId) {
    clearInterval(timer.runningId);
    timer.runningId = null;
    timer.isRunning = false;

    if (timer.pausedId) {
      clearInterval(timer.pausedId);
      timer.isTimerDisplay = true;
      timer.pausedId = null;
    }

    timer.time = 0;
    timer.timePauses = 0;
  }
}

addTimer();

</script>