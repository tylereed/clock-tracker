<template>
  <v-card>
    <clock-list :clocks="clocks" @update-slice="updateSlice" @move-clock="moveClock" @delete-clock="removeClock" />
  </v-card>
  <v-card>
    <add-clock-vue @new-clock="addClock" />
  </v-card>
</template>

<script setup lang="ts">
import { Clock, NewClock, getClockSize } from '@/types/Clock';
import AddClockVue from '@/components/clocks/AddClock.vue';
import ClockList from '@/components/clocks/ClockList.vue';
import { ref } from 'vue';

type Clocks = Clock[];

const clocks = ref<Clocks>([]);
addClock({
  totalSlices: 8,
  filledSlices: 3,
  color: 'green'
});

function updateSlice(id: number, amount: number) {
  if (amount < 0) return;
  if (amount > clocks.value[id].totalSlices) return;
  clocks.value[id].filledSlices = amount;
}

function moveClock(id: number, newIndex: number) {
  if (id < newIndex) {
    newIndex--;
  }
  const toMove = clocks.value[id];
  clocks.value.splice(id, 1);
  clocks.value.splice(newIndex, 0, toMove);
  setIds();
}

function removeClock(id: number) {
  clocks.value.splice(id, 1);
  setIds(id);
}

function setIds(id: number = 0) {
  for (let i = id; i < clocks.value.length; i++) {
    clocks.value[i].id = i;
  }
}



function addClock(toAdd: NewClock) {
  let c: Clock;
  c = { ...toAdd, id: clocks.value.length, size: getClockSize() };
  clocks.value.push(c);
}

</script>