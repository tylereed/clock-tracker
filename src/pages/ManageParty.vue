<template>
  <v-combobox label="Party" v-model="search" @update:model-value="setSelected" :items="partyNames"
    @keyup.enter="createNewParty" :hide-no-data="false">
    <template v-slot:no-data>
      <v-list-item>
        <v-list-item-title>
          No results matching "<strong>{{ search }}</strong>". Press
          <kbd>enter</kbd> to create a new one
        </v-list-item-title>
      </v-list-item>
    </template>
  </v-combobox>

  <initiative-table :initiatives="initiatives" @delete-initiative="deleteInitiative"
    @insert-init-command="insertInitCommand" />
  <v-container fluid>
    <v-row>
      <v-col cols="3">
        <v-btn variant="elevated" color="primary" @click="addPc">Add</v-btn>
      </v-col>
    </v-row>
  </v-container>
  <v-card-actions>
    <v-btn :disabled="!executor.canUndo.value" @click="() => executor.undo()">
      <v-icon icon="mdi-undo" />
    </v-btn>
    <v-btn :disabled="!executor.canRedo.value" @click="() => executor.redo()">
      <v-icon icon="mdi-redo" />
    </v-btn>
  </v-card-actions>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

import InitiativeTable from "@/components/initiative/InitiativeTable.vue";
import * as i from "@/components/initiative/initiativeHelpers";

import { Executor } from "@/utils/Executor";
import Initiative, { Initiatives, InitWithId } from "@/types/Initiative";

let pcId = 0;
const PartyNamePrefix = "party-";
const FullPrefix = i.makeKey(PartyNamePrefix)


const allInitiatives = ref<Map<string, Initiatives>>();
const initiatives = ref<Initiatives>([]);
const partyNames = computed(() => allInitiatives.value ? [...allInitiatives.value.keys()] : []);
const search = ref<string>("Default");
const selectedParty = ref<string>("Default");

watch(selectedParty, (value) => {
  if (value && allInitiatives.value) {
    initiatives.value = allInitiatives.value?.get(value) ?? [];
  } else {
    initiatives.value = [];
  }
});

const executor = new Executor(() => i.saveInits(initiatives.value, `${PartyNamePrefix}${selectedParty.value}`));

onMounted(() => {
  allInitiatives.value = new Map<string, Initiatives>(loadAllParties());
  pcId = [...allInitiatives.value.values()].flatMap(x => x).map(x => x.order).reduce((x, y) => x > y ? x : y);
  
  const i = allInitiatives.value.keys();
  const first = i.next();
  if (!first.done) {
    setSelected(first.value);
  }
});

function newPc(): InitWithId {
  return {
    id: pcId++,
    order: 0,
    name: "",
    conditions: {},
  };
}

function setSelected(selected: string) {
  if (allInitiatives.value?.has(selected)) {
    search.value = selectedParty.value = selected;
  }
}

function createNewParty() {
  if (!allInitiatives.value?.has(search.value)) {
    const selectedPartyName = selectedParty.value;
    const newPartyName = search.value;
    const newParty = [newPc()];

    executor.runCommand(() => {
      allInitiatives.value!.set(newPartyName, [...newParty]);
      search.value = selectedParty.value = newPartyName;
    }, () => {
      search.value = selectedParty.value = selectedPartyName;
      allInitiatives.value!.delete(newPartyName);
    });
  }
}

function addPc() {
  const toAdd = newPc();
  const selected = selectedParty.value;

  executor.runCommand(() => {
    search.value = selectedParty.value = selected;
    initiatives.value.push({ ...toAdd });
  },
    () => {
      search.value = selectedParty.value = selected;
      initiatives.value.pop();
    });
}

function deleteInitiative(id: number) {
  const removed = initiatives.value[id];
  const selected = selectedParty.value;

  executor.runCommand(() => {
    search.value = selectedParty.value = selected;
    initiatives.value.splice(id, 1);
  },
    () => {
      search.value = selectedParty.value = selected;
      initiatives.value.splice(id, 0, removed);
    });
}

function insertInitCommand(index: number, propName: keyof Initiative, newValue: any, oldValue: any) {
  const selected = selectedParty.value;
  i.insertInitCommand(executor, initiatives.value, index, propName, newValue, oldValue,
    () => {
      search.value = selectedParty.value = selected;
    });
}

function* loadAllParties(): Generator<readonly [string, Initiatives], void, unknown> {
  let returned = false;

  for (const partyName of loadPartyNameKeys()) {
    const party = i.loadInits(PartyNamePrefix + partyName);
    returned = true;
    yield [partyName, party] as const;
  }

  if (!returned) {
    yield ["Default", [newPc()]] as const;
  }
}

function* loadPartyNameKeys() {
  const count = localStorage.length;
  const prefixLength = FullPrefix.length;

  for (let i = 0; i < count; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(FullPrefix)) {
      yield key.substring(prefixLength);
    }
  }
}
</script>