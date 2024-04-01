<template>
  <div id="dropDisplay" :style="dropDisplayStyle" />
  <v-container fluid>
    <v-row class="clock-list" @drop="(e) => drop(e)" @dragover="showDrop" @dragleave="clearDrop" @dragenter.prevent
      v-resize="resizeClocks" dense>
      <v-col v-for="clock in clocks" :key="'Clock' + clock.id" cols="3" lg="2" xxl="1">
        <div draggable="true" @dragstart="startDrag(clock)" @dragend="clearDrag">
          <clock-vue v-bind="clock" @update-slice="(...a) => e('updateSlice', ...a)"
            @edit-clock="(...a) => e('editClock', ...a)" @delete-clock="(...a) => e('deleteClock', ...a)" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
#dropDisplay {
  pointer-events: none;
  position: absolute;
  width: 20px;
  background-color: v-bind('vTheme.current.value.colors.info');
  z-index: -1;
}
</style>

<script setup lang="ts">
import { Clock } from "@/types/Clock";
import ClockVue from "@/components/clocks/Clock.vue";
import { getClockSize } from "./helpers";
import { useDisplay, useTheme } from "vuetify";
import { reactive } from "vue";

const display = useDisplay();
const vTheme = useTheme();

const e = defineEmits<{
  (e: "updateSlice", id: number, filledSlices: number): void,
  (e: "moveClock", id: number, newIndex: number): void,
  (e: "editClock", id: number): void,
  (e: "deleteClock", id: number): void
}>();
const emit = e;

const props = defineProps<{ clocks: Clock[] }>();
const clocks = props.clocks;

interface MovableDropDisplay {
  display: "none" | "block",
  top: string,
  left: string,
  height: string
}

const dropDisplayStyle = reactive<MovableDropDisplay>({
  display: "none",
  top: "0px",
  left: "0px",
  height: "2em"
});

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

function getDropLocation(e: MouseEvent) {
  const dropTarget = e.currentTarget as HTMLElement;
  const clockList = dropTarget.closest(".clock-list") as HTMLElement;
  const childHeight = clockList.children.item(0)!.clientHeight;
  const numberCols = getNumberCols();
  const colWidth = clockList.offsetWidth / numberCols;

  const col = Math.round(e.pageX / colWidth);
  const row = Math.floor((e.pageY - (window.scrollY + clockList.getBoundingClientRect().top)) / childHeight);

  const index = Math.min(row * numberCols + col, clocks.length);

  return { index, row, col, numberCols, clockList };
}

function showDrop(e: DragEvent) {
  e.preventDefault();
  if (draggedClock && e.buttons > 0) {
    const { index, col, numberCols, clockList } = getDropLocation(e);
    if (index !== draggedClock.id && index - 1 !== draggedClock.id) {
      const isLastCol = col == numberCols || index == clocks.length;
      const dIndex = isLastCol ? index - 1 : index;

      const clockElement = clockList.children.item(dIndex)! as HTMLElement;
      const gap = (clockList.clientWidth - (clockElement.clientWidth * numberCols)) / numberCols / 2;

      dropDisplayStyle.display = "block";
      dropDisplayStyle.top = clockElement.offsetTop + "px";
      const left = (isLastCol ? clockElement.offsetLeft + clockElement.offsetWidth : clockElement.offsetLeft) - gap - 10;
      dropDisplayStyle.left = left + "px";
      dropDisplayStyle.height = clockElement.clientHeight + "px";
    }
  }
}

function drop(e: DragEvent) {
  try {
    if (draggedClock) {
      const { index } = getDropLocation(e);
      if (index !== draggedClock.id && index - 1 !== draggedClock.id) {
        emit("moveClock", draggedClock.id, index);
      }
    }
  }
  finally {
    clearDrag()
  }
}

function clearDrag() {
  draggedClock = null;
  clearDrop();
}

function clearDrop() {
  dropDisplayStyle.display = "none";
}

</script>