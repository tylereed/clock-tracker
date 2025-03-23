<template>
  <div>
    <initiative-table :initiatives="initiatives" :turn="turn" :round="round" :columns="columns"
      @apply-condition="applyCondition" @remove-condition="removeCondition" @delete-initiative="deleteInitiative"
      @increment-turn="incrementTurn" @decrement-turn="decrementTurn" @reset-turn="resetTurn"
      @insert-init-command="insertInitCommand" />
    <v-container fluid>
      <v-row>
        <v-col><v-btn @click="addInitiative()" variant="elevated" color="primary">Add
            Initiative</v-btn></v-col>
        <v-col cols="8"><v-btn @click="clearInitiative()" variant="outlined" color="error">Clear</v-btn></v-col>
      </v-row></v-container>
    <monster-search @add-monster="addMonster" />
    <v-card-actions>
      <ts-undo-redo :executor="executor" />
    </v-card-actions>
    <v-dialog v-model="addInitiativeDisplay" width="50%" min-width="400px">
      <add-edit-initiative class="pa-2 ma-6" @add-init="addInit" @close="addInitiativeDisplay = false" />
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

import AddEditInitiative from "@/components/initiative/AddEditInitiative.vue";
import InitiativeTable from "@/components/initiative/InitiativeTable.vue";
import MonsterSearch from "@/components/initiative/MonsterSearch.vue";
import TsUndoRedo from "@/components/common/TsUndoRedo.vue";

import Conditions from "@/types/Conditions";
import { Executor, Command } from "@/utils/Executor";
import Initiative, { Initiatives } from "@/types/Initiative";
import * as i from "@/components/initiative/initiativeHelpers";
import { useInitiativeStoreNamed } from "@/stores/initiativeStore";

const initiatives = useInitiativeStoreNamed("encounter"); // ref<Initiatives>([]);

const columns = i.buildInitiativeColumns({ hasInitiative: true, hasHp: true, hasConditions: true });

const encounterKey = i.makeKey("encounter");
const executor = new Executor(() => i.saveInits(initiatives.value, encounterKey));

function addInit(init: Initiative) {
  insertInitiative(init);
  addInitiativeDisplay.value = false;
}

let initId = 0;
function insertInitiative(init: Initiative) {
  const newInit = { ...init, id: initId++ };

  executor.runCommand(() => {
    setInitiatives([...initiatives.value, newInit]);
  }, (): void => {
    setInitiatives(initiatives.value.filter(x => x.id !== newInit.id));
  });
}

function insertInitiatives(inits: Initiatives, clear: boolean = false) {
  const newInits = inits.map(x => ({ ...x, id: initId++ }));
  const previous = [...initiatives.value];

  executor.runCommand(() => {
    if (clear) {
      setInitiatives(newInits);
    } else {
      setInitiatives([...initiatives.value, ...newInits]);
    }
  },
    () => {
      setInitiatives(previous);
    });
}

function resort() {
  setInitiatives([...initiatives.value]);
}

function setInitiatives(inits: Initiatives) {
  initiatives.value = inits.sort((a, b) => b.order - a.order || (b.dex ?? 0) - (a.dex ?? 0));
}

function deleteInitiative(index: number) {
  const removed = initiatives.value[index];
  const incrementTurn = turn.value > index;

  executor.runCommand(() => {
    initiatives.value.splice(index, 1);
    if (turn.value > index) {
      turn.value--;
    }
  }, () => {
    initiatives.value.splice(index, 0, removed);
    if (incrementTurn) {
      turn.value++;
    }
  });
}

const turn = ref(0);
const round = ref(1);

const turnChanger: Command = {
  execute: () => {
    turn.value++;
    if (turn.value === initiatives.value.length) {
      turn.value = 0;
      round.value++;
    }
  },
  undo: () => {
    turn.value--;
    if (turn.value < 0) {
      turn.value = initiatives.value.length - 1;
      round.value--;
    }
  }
}

function decrementTurn() {
  if (turn.value == 0 && round.value == 1) {
    return;
  }
  executor.invertCommand(turnChanger);
}

function incrementTurn() {
  executor.runCommand(turnChanger);
}

function resetTurn() {
  const oldTurn = turn.value;
  const oldRound = round.value;

  executor.runCommand(() => {
    turn.value = 0;
    round.value = 1;
  }, () => {
    turn.value = oldTurn;
    round.value = oldRound;
  });
}

const addInitiativeDisplay = ref(false);
function addInitiative() {
  addInitiativeDisplay.value = true;
}

function clearInitiative() {
  const oldInits = [...initiatives.value];
  const oldTurn = turn.value;
  const oldRound = round.value;

  executor.runCommand(() => {
    initiatives.value = [];
    turn.value = 0;
    round.value = 1;
  },
    () => {
      initiatives.value = oldInits;
      turn.value = oldTurn;
      round.value = oldRound;
    });
}

function addMonster(monster: Initiative) {
  insertInitiative(monster);
}

function insertInitCommand(index: number, propName: keyof Initiative, newValue: any, oldValue: any) {
  i.insertInitCommand(executor, initiatives.value, index, propName, newValue, oldValue,
    function () {
      if (propName === "order") {
        resort();
      }
    }
  );
}

function applyCondition(index: number, name: keyof Conditions) {
  executor.runCommand(() => { initiatives.value[index].conditions[name] = true; },
    () => { initiatives.value[index].conditions[name] = false; });
}

function removeCondition(index: number, name: keyof Conditions) {
  executor.runCommand(() => { initiatives.value[index].conditions[name] = false; },
    () => { initiatives.value[index].conditions[name] = true; });
}

function loadInits() {
  let result = i.loadInits();
  const key = i.makeKey("encounter");
  if (result.length) {
    i.saveInits(result, key);
    i.deleteInits();
  } else {
    result = i.loadInits(key);
  }
  return result;
}

onMounted(() => {
  setInitiatives(loadInits());
  if (initiatives.value?.length) {
    initId = initiatives.value.map(x => x.id).reduce((x, y) => x > y ? x : y) + 1;
  } else {
    initId = 1;
  }
});

defineExpose({
  insertInitiatives
});

</script>