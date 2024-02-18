<template>
  <v-card-title>Clocks</v-card-title>
  <v-container fluid>
    <v-row v-resize="resizeClocks" dense>
      <v-col v-for="clock in clocks" :key="'Clock' + clock.id" cols="3" lg="2" xxl="1">
        <clock-vue v-bind="clock" @update-slice="(...a) => e('updateSlice', ...a)"
          @delete-clock="(...a) => e('deleteClock', ...a)" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { Clock, getClockSize } from '@/types/Clock';
import ClockVue from '@/components/clocks/Clock.vue';

const e = defineEmits<{
  (e: "updateSlice", id: number, filledSlices: number): void,
  (e: "deleteClock", id: number): void
}>();

const props = defineProps<{ clocks: Clock[] }>();
const clocks = props.clocks;

function resizeClocks() {
  const clockSize = getClockSize();

  for (const clock of clocks) {
    clock.size = clockSize;
  }
}

</script>