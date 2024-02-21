<template>
  <v-card-title>Clocks</v-card-title>
  <v-container fluid>
    <v-row class="clock-list" @drop="(e) => drop(e)" @dragover.prevent @dragenter.prevent v-resize="resizeClocks" dense>
      <v-col v-for="clock in clocks" :key="'Clock' + clock.id" cols="3" lg="2" xxl="1">
        <div draggable="true" @dragstart="startDrag(clock)">
          <clock-vue v-bind="clock" @update-slice="(...a) => e('updateSlice', ...a)"
            @delete-clock="(...a) => e('deleteClock', ...a)" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { Clock, getClockSize } from '@/types/Clock';
import ClockVue from '@/components/clocks/Clock.vue';
import { useDisplay } from 'vuetify';

const display = useDisplay();

const e = defineEmits<{
  (e: "updateSlice", id: number, filledSlices: number): void,
  (e: "moveClock", id: number, newIndex: number): void
  (e: "deleteClock", id: number): void
}>();
const emit = e;

const props = defineProps<{ clocks: Clock[] }>();
const clocks = props.clocks;

function resizeClocks() {
  const clockSize = getClockSize();

  for (const clock of clocks) {
    clock.size = clockSize;
  }
}



let draggedClock: Clock | null;
function startDrag(clock: Clock) {
  draggedClock = clock;
}

function getNumberCols() {
  if (display.xxl.value) {
    return 12;
  }
  if (display.lgAndUp.value) {
    return 6;
  }
  return 4;
}

function drop(e: DragEvent) {
  try {
    if (draggedClock) {
      const dropTarget = e.currentTarget as HTMLElement;
      const clockList = dropTarget.closest(".clock-list") as HTMLElement;
      const numberCols = getNumberCols();
      const colWidth = clockList.offsetWidth / numberCols;

      const col = Math.round(e.pageX / colWidth);
      const row = Math.floor((e.pageY - clockList.offsetTop) / draggedClock.size);
      const index = Math.min(row * numberCols + col, clocks.length);

      emit("moveClock", draggedClock.id, index);
    }
  }
  finally {
    draggedClock = null;
  }
}

</script>