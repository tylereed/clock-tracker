<template>
  <v-app>
    <v-main>
      <v-card>
        <v-card-title>Clocks</v-card-title>
        <v-container fluid>
          <v-row v-resize="resizeClocks" dense>
            <v-col v-for="clock in clocks" :key="'Clock' + clock.id" cols="3" lg="2" xxl="1">
              <clock-vue v-bind="clock" @update-slice="updateSlice" @delete-clock="removeClock" />
            </v-col>
          </v-row>
        </v-container>
      </v-card>
      <v-card>
        <add-clock-vue @new-clock="addClock" />
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { Clock, NewClock } from '@/types/Clock';
import ClockVue from '@/components/Clock.vue';
import AddClockVue from '@/components/AddClock.vue';
import { ref } from 'vue';
import { useDisplay } from 'vuetify';

const display = useDisplay();
const MAX_CLOCK_WIDTH = 200;

type Clocks = Clock[];

const clocks = ref<Clocks>([]);
addClock({
  totalSlices: 8,
  filledSlices: 3,
  color: 'green'
});

function getClockSize() {
  return Math.min(display.width.value / 4 - 20, MAX_CLOCK_WIDTH);
}

function updateSlice(id: number, amount: number) {
  if (amount < 0) return;
  if (amount > clocks.value[id].totalSlices) return;
  clocks.value[id].filledSlices = amount;
}

function addClock(toAdd: NewClock) {
  let c: Clock;
  if (!toAdd) {
    const totalSlices = Math.ceil(Math.random() * 6) + 2;
    const filledSlices = Math.floor(Math.random() * (totalSlices + 1));
    c = {
      id: clocks.value.length,
      totalSlices,
      filledSlices,
      color: "purple",
      size: getClockSize()
    };
  } else {
    c = { ...toAdd, id: clocks.value.length, size: getClockSize() };
  }
  clocks.value.push(c);
}

function removeClock(id: number) {
  clocks.value.splice(id, 1);
  for (let i = id; i < clocks.value.length; i++) {
    clocks.value[i].id = i;
  }
}

function resizeClocks() {
  const clockSize = getClockSize();

  for (const clock of clocks.value) {
    clock.size = clockSize;
  }
}

</script>