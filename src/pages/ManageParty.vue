<template>
  <v-combobox label="Party" v-model="selectedParty" :items="partyNames" @update:focused="updateSelectedParty"
    @keyup.enter.stop="updateSelectedParty(false)" />
  <initiative-table :initiatives="initiatives" @delete-initiative="deleteInitiative" @has-conditions="false" />
  <v-container fluid>
    <v-row>
      <v-col cols="3">
        <v-btn variant="elevated" color="primary" @click="addPc">Add</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";

import InitiativeTable from "@/components/initiative/InitiativeTable.vue";

import { Executor } from "@/utils/Executor";
import { Initiatives, InitWithId } from "@/types/Initiative";

const allInitiatives = reactive(new Map<string, Initiatives>());
const initiatives = ref<Initiatives>([]);

const selectedParty = ref<string>(null!);
const partyNames = computed(() => [...allInitiatives.keys()]);

function newPc(): InitWithId {
  return {
    id: 0,
    order: 0,
    name: "",
    conditions: {},
  };
}

function updateSelectedParty(focused: boolean) {
  if (!focused && selectedParty.value) {
    if (!allInitiatives.has(selectedParty.value)) {
      allInitiatives.set(selectedParty.value, [newPc()]);
    }
    initiatives.value = allInitiatives.get(selectedParty.value)!;
  }
}

function addPc() {
  initiatives.value.push(newPc());
}

function deleteInitiative(id: number) {
  initiatives.value.splice(id, 1);
}

</script>