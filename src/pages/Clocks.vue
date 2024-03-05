<template>
  <v-card>
    <v-card-item><v-card-title>Clocks</v-card-title></v-card-item>
    <v-card-text>
      <clock-list :clocks="clocks" @update-slice="updateSlice" @move-clock="moveClock" @delete-clock="removeClock" />
    </v-card-text>
    <v-card-actions>
      <v-btn @click="clearClocks">Clear Clocks</v-btn>
    </v-card-actions>
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

function updateSlice(id: number, amount: number) {
  if (amount < 0) return;
  if (amount > clocks.value[id].totalSlices) return;
  clocks.value[id].filledSlices = amount;
  saveClocks();
}

function moveClock(id: number, newIndex: number) {
  if (id < newIndex) {
    newIndex--;
  }
  const toMove = clocks.value[id];
  clocks.value.splice(id, 1);
  clocks.value.splice(newIndex, 0, toMove);
  setIds();
  saveClocks();
}

function removeClock(id: number) {
  clocks.value.splice(id, 1);
  setIds(id);
  saveClocks();
}

function clearClocks() {
  clocks.value.splice(0, clocks.value.length);
  saveClocks();
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
  saveClocks();
}

function saveClocks() {
  try {
    const toSave = [...clocks.value];
    const saveData = JSON.stringify(toSave);
    localStorage.setItem("clocks", saveData);
  } catch (e) {
    console.log(e);
  }
}

function loadClocks() {
  try {
    const clockJson = localStorage.getItem("clocks");
    if (clockJson) {
      const restoredClocks = JSON.parse(clockJson) as Clocks;
      clocks.value = restoredClocks;
    }
  } catch (e) {
    console.log(e);
  }
}

loadClocks();
</script>