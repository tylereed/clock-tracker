<template>
  <v-card flat>
    <v-card-text>
      <v-container fluid>
        <v-row dense>
          <v-col cols="2" v-for="(timer, index) in timers" :key="'Timer' + index">
            <timer-vue v-bind="timer" @delete-timer="deleteTimer" @start-timer="startTimer" @pause-timer="pauseTimer"
              @reset-timer="resetTimer" @elapsed-timer="elapsedTimer" />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="clearTimers()" variant="outlined" color="error">Clear Timers</v-btn>
      <ts-expando-button :actions="addTimerButtons" />
    </v-card-actions>
  </v-card>

  <v-dialog v-model="addCountdownDisplay" width="25%" min-width="400px">
    <add-countdown class="pa-2 ma-6" @new-countdown="addTimer" @close="addCountdownDisplay = false" />
  </v-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useToast } from "vue-toast-notification";

import AddCountdown from "@/components/timer/AddCountdown.vue";
import TimerVue from "@/components/timer/Timer.vue";
import TsExpandoButton from "@/components/common/TsExpandoButton.vue";

import { storeToRefs } from "pinia";
import { useTimersStore } from "@/stores/timers";

const { timers } = storeToRefs(useTimersStore());
const addCountdownDisplay = ref(false);

function clearTimers() {
  timers.value.length = 0;
  addTimer();
}

const addTimerButtons = reactive([
  { label: "Add Timer", action: addTimer },
  { label: "Add Countdown", action: () => addCountdownDisplay.value = true }
]);

function addTimer(max?: number) {
  timers.value.push({
    id: timers.value.length,
    runningId: null,
    pausedId: null,
    elapsedId: null,
    time: 0,
    max: max,
    elapsed: false,
    isRunning: false,
    timePauses: 0,
    isTimerDisplay: true
  });
  addCountdownDisplay.value = false;
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
  if (toRemove.elapsedId) {
    clearInterval(toRemove.elapsedId);
  }
  toRemove.toast?.dismiss();
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
    if (timer.elapsedId) {
      clearInterval(timer.elapsedId);
      timer.elapsed = false;
      timer.isTimerDisplay = true;
      timer.elapsedId = null;
    }
    timer.toast?.dismiss();

    timer.time = 0;
    timer.timePauses = 0;
  }
}

const toast = useToast();

function elapsedTimer(id: number) {
  const timer = timers.value[id];
  if (!timer.elapsed) {
    timer.elapsed = true;
    timer.toast = toast.info(`Countdown ${id + 1} has finished`, { duration: 0 });
    let state = 0;

    timer.elapsedId = setInterval(function () {
      state++;
      switch (state) {
        case 1:
          timer.isTimerDisplay = true;
          break;
        case 3:
          timer.isTimerDisplay = false;
          break;
        case 4:
          timer.isTimerDisplay = true;
          break;
        case 6:
          timer.isTimerDisplay = false;
          break;
        case 7:
          state = 0;
      }
    }, 200) as unknown as number;
  }
}

if (timers.value.length === 0) {
  addTimer();
}

</script>