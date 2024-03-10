<template>
  <v-card>
    <v-card-item><v-card-title>Clocks</v-card-title></v-card-item>
    <v-card-text>
      <clock-list :clocks="clocks" @update-slice="updateSlice" @move-clock="moveClock" @edit-clock="openEdit"
        @delete-clock="removeClock" />
    </v-card-text>
    <v-card-actions>
      <v-btn @click="clearClocks">Clear Clocks</v-btn>
      <v-btn @click="openAdd">Add Clock</v-btn>
      <v-btn :disabled="!executor.canUndo.value" @click="() => executor.undo()">
        <v-icon icon="mdi-undo" />
      </v-btn>
      <v-btn :disabled="!executor.canRedo.value" @click="() => executor.redo()">
        <v-icon icon="mdi-redo" />
      </v-btn>
    </v-card-actions>
  </v-card>

  <v-dialog v-model="addEditClockDisplay" width="25%" min-width="400px">
    <add-clock-vue class="pa-2 ma-6" :clock-values="addEditClockValues" @new-clock="addClock"
      @update-clock="updateClock" @close="addEditClockDisplay = false" />
  </v-dialog>
</template>

<script setup lang="ts">
import { Clock, NewClock, getClockSize } from '@/types/Clock';
import AddClockVue from '@/components/clocks/AddEditClock.vue';
import ClockList from '@/components/clocks/ClockList.vue';
import { ref } from 'vue';
import { Executor } from '@/utils/Executor';

type Clocks = Clock[];

const clocks = ref<Clocks>([]);
const addEditClockDisplay = ref(false);
const addEditClockValues = ref<NewClock | null>(null);

const executor = new Executor(saveClocks);

function updateSlice(id: number, amount: number) {
  if (amount < 0) return;
  if (amount > clocks.value[id].totalSlices) return;

  const oldAmount = clocks.value[id].filledSlices;
  executor.runCommand(() => clocks.value[id].filledSlices = amount,
    () => clocks.value[id].filledSlices = oldAmount);
}

function moveClock(id: number, newIndex: number) {
  if (id < newIndex) {
    newIndex--;
  }
  const toMove = clocks.value[id];

  executor.runCommand(
    () => {
      clocks.value.splice(id, 1);
      clocks.value.splice(newIndex, 0, toMove);
      setIds();
    },
    () => {
      clocks.value.splice(newIndex, 1);
      clocks.value.splice(id, 0, toMove);
      setIds();
    });
}

function removeClock(id: number) {
  if (id < 0) return;
  if (id > clocks.value.length - 1) return;

  const removed = clocks.value[id];

  executor.runCommand(() => {
    clocks.value.splice(id, 1);
    setIds(id);
  }, () => {
    clocks.value.splice(id, 0, removed);
    setIds(id);
  });
}

function clearClocks() {
  const removedClocks = [...clocks.value];
  executor.runCommand(() => clocks.value.splice(0, clocks.value.length),
    () => clocks.value.splice(0, 0, ...removedClocks));
}

function openAdd() {
  addEditClockValues.value = null;
  addEditClockDisplay.value = true;
}

function openEdit(id: number) {
  addEditClockValues.value = { ...clocks.value[id] };
  addEditClockDisplay.value = true;
}

function setIds(id: number = 0) {
  for (let i = id; i < clocks.value.length; i++) {
    clocks.value[i].id = i;
  }
}

function updateClock(toUpdate: Clock) {
  const updated: Clock = { ...toUpdate };
  const oldValue = clocks.value[updated.id];

  executor.runCommand(() => clocks.value[updated.id] = updated,
    () => clocks.value[updated.id] = oldValue);

  addEditClockDisplay.value = false;
}

function addClock(toAdd: NewClock) {
  const added: Clock = { ...toAdd, id: clocks.value.length, size: getClockSize() };

  executor.runCommand(() => clocks.value.push(added),
    () => clocks.value.pop());

  addEditClockDisplay.value = false;
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