<template>
  <v-card class="ma-2">
    <v-card-item><v-card-title>Clocks</v-card-title></v-card-item>
    <v-card-text>
      <v-tabs v-model="selectedTab">
        <v-tab v-for="(clockTab, index) in clockTabs" :key="index" @click.middle.prevent="removeTab(index)">
          {{ clockTab.name }}
        </v-tab>
        <v-tab @click.native.prevent.stop.capture="addTab" width=".5em"><v-icon icon="mdi-plus" /></v-tab>
      </v-tabs>
      <v-window v-model="selectedTab">
        <v-window-item v-for="(clockTab, index) in clockTabs" :key="index">
          <clock-list :clocks="clockTab.clocks" @update-slice="updateSlice" @move-clock="moveClock"
            @edit-clock="openEdit" @delete-clock="removeClock" />
        </v-window-item>
      </v-window>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="clearClocks" variant="outlined" color="error">Clear Clocks</v-btn>

      <ts-expando-button :actions="addClockButtons" />

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
import { Clock, ClockTab, NewClock } from "@/types/Clock";
import AddClockVue from "@/components/clocks/AddEditClock.vue";
import ClockList from "@/components/clocks/ClockList.vue";
import { createClock, getClockSize } from "@/components/clocks/helpers";
import { computed, reactive, ref } from "vue";
import { Executor } from "@/utils/Executor";
import TsExpandoButton from "@/components/common/TsExpandoButton.vue";

type Clocks = Clock[];
type ClockTabs = ClockTab[];

const clockTabs = ref<ClockTabs>([]);
const selectedTab = ref(0);
const clocks = computed<Clocks>(() => clockTabs.value[selectedTab.value].clocks);

const addEditClockDisplay = ref(false);
const addEditClockValues = ref<NewClock | null>(null);
const addClockButtons = reactive([
  { label: "Add Clock", action: openAdd },
  { label: "Quick Add 4-Clock", action: () => quickAdd(4) },
  { label: "Quick Add 6-Clock", action: () => quickAdd(6) },
  { label: "Quick Add 8-Clock", action: () => quickAdd(8) },
]);

const executor = new Executor(saveClocks);

function updateSlice(id: number, amount: number) {
  if (amount < 0) return;
  if (amount > clocks.value[id].totalSlices) return;
  const tab = selectedTab.value;

  const oldAmount = clocks.value[id].filledSlices;
  executor.runCommand(() => {
    selectedTab.value = tab;
    clocks.value[id].filledSlices = amount;
  }, () => {
    selectedTab.value = tab;
    clocks.value[id].filledSlices = oldAmount
  });
}

function moveClock(id: number, newIndex: number) {
  if (id < newIndex) {
    newIndex--;
  }
  const toMove = clocks.value[id];
  const tab = selectedTab.value;

  executor.runCommand(
    () => {
      selectedTab.value = tab;
      clocks.value.splice(id, 1);
      clocks.value.splice(newIndex, 0, toMove);
      setIds();
    },
    () => {
      selectedTab.value = tab;
      clocks.value.splice(newIndex, 1);
      clocks.value.splice(id, 0, toMove);
      setIds();
    });
}

function removeClock(id: number) {
  if (id < 0) return;
  if (id > clocks.value.length - 1) return;

  const removed = clocks.value[id];
  const tab = selectedTab.value;

  executor.runCommand(() => {
    selectedTab.value = tab;
    clocks.value.splice(id, 1);
    setIds(id);
  }, () => {
    selectedTab.value = tab;
    clocks.value.splice(id, 0, removed);
    setIds(id);
  });
}

function clearClocks() {
  const removedClocks = [...clocks.value];
  const tab = selectedTab.value;

  executor.runCommand(() => {
    selectedTab.value = tab;
    clocks.value.splice(0, clocks.value.length)
  }, () => {
    selectedTab.value = tab;
    clocks.value.splice(0, 0, ...removedClocks)
  });
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
  const tab = selectedTab.value;

  executor.runCommand(() => {
    selectedTab.value = tab;
    clocks.value[updated.id] = updated
  }, () => {
    selectedTab.value = tab;
    clocks.value[updated.id] = oldValue;
  });

  addEditClockDisplay.value = false;
}

function quickAdd(totalSlices: number) {
  const toAdd = createClock({ totalSlices });
  addClock(toAdd);
}

function addClock(toAdd: NewClock) {
  const added: Clock = { ...toAdd, id: clocks.value.length, size: getClockSize() };
  const tab = selectedTab.value;

  executor.runCommand(() => {
    selectedTab.value = tab;
    clocks.value.push(added);
  }, () => {
    selectedTab.value = tab;
    clocks.value.pop();
  });

  addEditClockDisplay.value = false;
}

function addTab() {
  const tab = selectedTab.value;
  const nameRegex = /New Tab (\d+)/;

  executor.runCommand(() => {
    const indexes = clockTabs.value.map(t => {
      const match = t.name.match(nameRegex);
      if (match?.length ?? 0 > 1) {
        return +match![1];
      } else {
        return 0;
      }
    });
    const max = Math.max(0, ...indexes);

    clockTabs.value.push({
      name: "New Tab " + (max + 1),
      clocks: []
    });
    selectedTab.value = clockTabs.value.length - 1;
  }, () => {
    selectedTab.value = tab;
    clockTabs.value.pop();
  });
}

function removeTab(remove: number) {
  const index = remove;
  const toRemove = clockTabs.value[index];
  const tab = selectedTab.value;

  executor.runCommand(async (): Promise<void> => {
    const clonedTabs = clockTabs.value.splice(0, clockTabs.value.length);
    await 1;
    clonedTabs.splice(index, 1);
    clockTabs.value = clonedTabs;

    if (index <= tab && tab !== 0) {
      selectedTab.value = tab - 1;
    }
  }, async (): Promise<void> => {
    const clonedTabs = clockTabs.value.splice(0, clockTabs.value.length);
    await 1;
    clonedTabs.splice(index, 0, toRemove);
    clockTabs.value = clonedTabs;

    selectedTab.value = index;
  });
}

function saveClocks() {
  try {
    const toSave = [...clockTabs.value];
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
      const restoredClocks = JSON.parse(clockJson) as ClockTabs;
      if (restoredClocks.length > 0 && restoredClocks[0].clocks) {
        clockTabs.value = restoredClocks;
      }
    }
  } catch (e) {
    console.log(e);
  } finally {
    if (!clockTabs.value?.length) {
      clockTabs.value = [];
      clockTabs.value.push({
        name: "Default",
        clocks: []
      });
    }
  }
}

loadClocks();
</script>