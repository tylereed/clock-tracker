<template>
  <v-hover @update:model-value="updateHover">
    <template v-slot:default="{ isHovering, props }">
      <v-card v-bind="props" class="d-flex justify-center" elevation="5">
        <v-sheet>
          <v-card elevation="0">
            <v-card-item><v-card-title>Timer</v-card-title></v-card-item>
            <v-card-text :style="timerDisplayStyle">{{ timerDisplay }}</v-card-text>
            <v-card-actions>
              <v-btn @click="emit('startTimer', timer.id)" variant="elevated" color="primary" v-if="!isRunning">
                {{ time ? "Resume" : "Start" }}
              </v-btn>
              <v-btn @click="emit('pauseTimer', timer.id)" variant="elevated" color="primary"
                v-if="isRunning">Pause</v-btn>
              <v-btn :disabled="!time" @click="emit('resetTimer', timer.id)" variant="outlined"
                color="error">Reset</v-btn>
            </v-card-actions>
          </v-card>
        </v-sheet>
        <v-sheet v-show="isHovering" class="topright text-center">
          <v-btn @click.stop="emit('deleteTimer', timer.id)" style="width: 8px;">
            <v-icon icon="mdi-delete-forever" color="error" />
          </v-btn>
        </v-sheet>
      </v-card>
    </template>
  </v-hover>
</template>

<style scoped>
.topright {
  position: absolute;
  top: 8px;
  right: 16px;
  widows: 8px;
}
</style>

<script setup lang="ts">
import { computed } from "vue";
import { Timer } from "@/types/Timer";

const timer = defineProps<Timer>();

let isHover = false;

const emit = defineEmits<{
  (e: "deleteTimer", id: number): void,
  (e: "startTimer", id: number): void,
  (e: "pauseTimer", id: number): void,
  (e: "resetTimer", id: number): void
}>();

const timerDisplay = computed(() => {
  const minutes = Math.floor(timer.time / 60).toString().padStart(2, "0");
  const seconds = (timer.time % 60).toFixed(2).padStart(5, "0");

  return `${minutes}:${seconds}`;
});

const timerDisplayStyle = computed<{ visibility: "visible" | "hidden" }>(() => {
  return { visibility: timer.isTimerDisplay ? "visible" : "hidden" };
});

function updateHover(value: boolean) {
  isHover = value;
}

</script>