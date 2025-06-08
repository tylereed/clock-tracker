<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-combobox :label="label" v-model="search" @update:model-value="setSelected" :items="groupStore.names"
          @keyup.enter="createNewGroup" :hide-no-data="false">
          <template v-slot:no-data>
            <v-list-item>
              <v-list-item-title>
                No results matching "<strong>{{ search }}</strong>". Press
                <kbd>enter</kbd> to create a new one
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-combobox>
      </v-col>
      <v-col cols="1">
        <div class="pt-2">
          <v-btn :disabled="groupStore.names.length <= 1">
            <v-icon icon="mdi-delete-forever" color="error" @click="deleteSelectedGroup()" />
          </v-btn>
        </div>
      </v-col>
      <v-col cols="4" v-if="showMonster">
        <v-card flat>
          <v-card-text class="pa-0">
            <b class="ma-4 ps-2" style="font-size: 1.25rem;">Dice</b>
            <v-chip class="ma-1" v-for="(count, sides) in diceCount">{{ sides }}: {{ count }}</v-chip>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <initiative-table :initiatives="initiatives" :columns="columns" @delete-initiative="deleteInitiative"
    @edit-initiative="editInitiative" @insert-init-command="insertInitCommand" />
  <v-container fluid>
    <v-row>
      <v-col cols="1">
        <v-btn variant="elevated" color="primary" @click="addEntry()">Add</v-btn>
      </v-col>
      <v-col>
        <v-btn variant="elevated" color="primary" @click="sendToInit()">Send to Initiative</v-btn>
      </v-col>
      <v-spacer />
    </v-row>
  </v-container>
  <monster-search v-if="showMonster" @add-monster="addExistingMonster" />
  <v-card-actions>
    <ts-undo-redo :executor="executor" />
  </v-card-actions>
  <v-dialog v-model="addInitiativeDisplay" width="50%" min-width="400px">
    <add-edit-initiative class="pa-2 ma-6" :init-stats="editInit" @add-init="addExistingMonster" @edit-init="updateInit"
      @close="addInitiativeDisplay = false" />
  </v-dialog>
</template>

<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import { onMounted, ref, toRefs, watch } from "vue";

import TsUndoRedo from "@/components/common/TsUndoRedo.vue";
import AddEditInitiative from "@/components/initiative/AddEditInitiative.vue";
import InitiativeTable from "@/components/initiative/InitiativeTable.vue";
import * as i from "@/components/initiative/initiativeHelpers";
import MonsterSearch from "./MonsterSearch.vue";

import { useGroupStoreNamed } from "@/stores/groups";
import Initiative, { Initiatives, InitWithId } from "@/types/Initiative";
import { Executor } from "@/utils/Executor";
import { first } from "@/utils/helpers";
import { filterToMonsters, getEncounterDice, newEntry } from "./encounterHelpers";

const props = defineProps<{
  label: string,
  groupNamePrefix: string,
  showMonster?: boolean,
}>();

const { groupNamePrefix } = toRefs(props);

const emit = defineEmits<{
  (e: "sendToInitiative", inits: Initiatives): void,
}>();

const addInitiativeDisplay = ref(false);
const editInit = ref<InitWithId | null>(null);
function editInitiative(id: number) {
  editInit.value = { ...initiatives.value[id], id: id };
  addInitiativeDisplay.value = true;
}

const initiatives = ref<Initiatives>([]);
const search = ref<string>("Default");
const selectedGroup = useStorage("selected-" + props.groupNamePrefix, "Default", sessionStorage);

const diceCount = ref<{ [key: string]: number | undefined }>({});

function updateDiceCount() {
  if (props.showMonster) {
    const monsters = filterToMonsters(initiatives.value);
    diceCount.value = getEncounterDice(monsters);
  }
}

watch(selectedGroup, (value) => {
  if (value) {
    initiatives.value = groupStore.allInitiatives.get(value) ?? [];
  } else {
    initiatives.value = [];
  }
  updateDiceCount();
});

const columns = i.buildInitiativeColumns({ hasDex: true, hasEdit: true, hasCr: !!props.showMonster, hasLevel: !props.showMonster });

const executor = new Executor(() => {
  i.saveInits(initiatives.value, i.makeKey(`${groupNamePrefix.value}-${selectedGroup.value}`));
  updateDiceCount();
});

const groupStore = useGroupStoreNamed(groupNamePrefix.value);

onMounted(() => {
  setSelected(selectedGroup.value);
  if (selectedGroup.value && groupStore.allInitiatives) {
    initiatives.value = groupStore.allInitiatives.get(selectedGroup.value) ?? [];
  } else {
    initiatives.value = [];
  }
});

function setSelected(selected?: string | null) {
  if (selected && groupStore.allInitiatives.has(selected)) {
    search.value = selected;
    selectedGroup.value = selected;
  }
}

function createNewGroup() {
  if (!groupStore.allInitiatives.has(search.value)) {
    const selectedGroupName = selectedGroup.value;
    const newGroupName = search.value;
    const newGroup = [newEntry(groupStore.nextEntryId())];

    executor.runCommand(() => {
      groupStore.allInitiatives.set(newGroupName, [...newGroup]);
      setSelected(newGroupName);
    },
      () => {
        setSelected(selectedGroupName);
        groupStore.allInitiatives.delete(newGroupName);
      });
  }
}

function deleteSelectedGroup() {
  if (selectedGroup.value && groupStore.allInitiatives.has(selectedGroup.value)) {
    const toDeleteKey = i.makeKey(`${groupNamePrefix.value}-${selectedGroup.value}`);
    const oldGroup = [...initiatives.value];

    executor.runCommand(() => {
      groupStore.allInitiatives.delete(toDeleteKey);
      i.deleteInits(toDeleteKey);
      setSelected(first(groupStore.names));
    },
      () => {
        groupStore.allInitiatives.set(toDeleteKey, oldGroup);
        i.saveInits(oldGroup, toDeleteKey);
        setSelected(toDeleteKey);
      });
  }
}

function addEntry(init?: InitWithId) {
  const toAdd = init ?? newEntry(groupStore.nextEntryId());
  const selected = selectedGroup.value;

  executor.runCommand(() => {
    setSelected(selected);
    initiatives.value.push({ ...toAdd });
  },
    () => {
      setSelected(selected);
      initiatives.value.pop();
    });
}

function addExistingMonster(monster: Initiative) {
  addEntry({ ...monster, id: groupStore.nextEntryId() });
}

function updateInit(id: number, init: Initiative) {
  addInitiativeDisplay.value = false;

  const toUpdate = init;
  const toRemove = initiatives.value[id];
  const selected = selectedGroup.value;

  executor.runCommand(() => {
    setSelected(selected);
    initiatives.value[id] = { ...toUpdate, id };
  },
    () => {
      setSelected(selected);
      initiatives.value[id] = { ...toRemove };
    });

  updateDiceCount();
}

function sendToInit() {
  emit("sendToInitiative", [...initiatives.value]);
}

function deleteInitiative(id: number) {
  const removed = initiatives.value[id];
  const selected = selectedGroup.value;

  executor.runCommand(() => {
    setSelected(selected);
    initiatives.value.splice(id, 1);
  },
    () => {
      setSelected(selected);
      initiatives.value.splice(id, 0, removed);
    });
}

function insertInitCommand(index: number, propName: keyof Initiative, newValue: any, oldValue: any) {
  const selected = selectedGroup.value;
  i.insertInitCommand(executor, initiatives.value, index, propName, newValue, oldValue,
    () => {
      setSelected(selected);
    });
}
</script>