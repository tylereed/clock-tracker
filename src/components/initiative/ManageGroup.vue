<template>
  <v-container fluid>
    <v-row>
      <v-col cols="11">
        <v-combobox :label="label" v-model="search" @update:model-value="setSelected" :items="groupNames"
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
      <v-col>
        <div class="pt-2">
          <v-btn :disabled="groupNames.length <= 1">
            <v-icon icon="mdi-delete-forever" color="error" @click="deleteSelectedGroup" />
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>

  <initiative-table :initiatives="initiatives" :columns="columns" @delete-initiative="deleteInitiative"
    @insert-init-command="insertInitCommand" />
  <v-container fluid>
    <v-row>
      <v-col>
        <v-btn variant="elevated" color="primary" @click="addEntry">Add</v-btn>
      </v-col>
      <v-col>
        <v-btn variant="elevated" color="primary" @click="sendToInit">Send to Initiative</v-btn>
      </v-col>
    </v-row>
  </v-container>
  <monster-search v-if="showMonster" @add-monster="addExistingMonster" />
  <v-card-actions>
    <ts-undo-redo :executor="executor" />
  </v-card-actions>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

import InitiativeTable from "@/components/initiative/InitiativeTable.vue";
import * as i from "@/components/initiative/initiativeHelpers";
import MonsterSearch from "./MonsterSearch.vue";
import TsUndoRedo from "@/components/common/TsUndoRedo.vue";

import { Executor } from "@/utils/Executor";
import Initiative, { Initiatives, InitWithId } from "@/types/Initiative";
import { first } from "@/utils/helpers";

const props = defineProps<{
  label: string,
  groupNamePrefix: string,
  showMonster?: boolean,
}>();

const emit = defineEmits<{
  (e: "sendToInitiative", inits: Initiatives): void,
}>();

let entryId = 0;
const GroupNamePrefix = computed(() => props.groupNamePrefix + "-"); //"party-";
const FullPrefix = computed(() => i.makeKey(GroupNamePrefix.value));

const allInitiatives = ref<Map<string, Initiatives>>();
const initiatives = ref<Initiatives>([]);
const groupNames = computed(() => allInitiatives.value ? [...allInitiatives.value.keys()] : []);
const search = ref<string>("Default");
const selectedGroup = ref<string>("Default");

watch(selectedGroup, (value) => {
  if (value && allInitiatives.value) {
    initiatives.value = allInitiatives.value?.get(value) ?? [];
  } else {
    initiatives.value = [];
  }
});

const columns = i.buildInitiativeColumns({ hasDex: true });

const executor = new Executor(() => i.saveInits(initiatives.value, `${GroupNamePrefix.value}${selectedGroup.value}`));

onMounted(() => {
  allInitiatives.value = new Map<string, Initiatives>(loadAllGroups());
  entryId = [...allInitiatives.value.values()].flatMap(x => x).map(x => x.order).reduce((x, y) => x > y ? x : y);

  const f = first(groupNames.value);
  if (f) {
    setSelected(f);
  }
});

function newEntry(): InitWithId {
  return {
    id: entryId++,
    order: 0,
    name: "",
    conditions: {},
  };
}

function setSelected(selected?: string | null) {
  if (selected && allInitiatives.value?.has(selected)) {
    search.value = selected;
    selectedGroup.value = selected;
  }
}

function createNewGroup() {
  if (!allInitiatives.value?.has(search.value)) {
    const selectedGroupName = selectedGroup.value;
    const newGroupName = search.value;
    const newGroup = [newEntry()];

    executor.runCommand(() => {
      allInitiatives.value!.set(newGroupName, [...newGroup]);
      setSelected(newGroupName);
    },
      () => {
        setSelected(selectedGroupName);
        allInitiatives.value!.delete(newGroupName);
      });
  }
}

function deleteSelectedGroup() {
  if (selectedGroup.value && allInitiatives.value?.has(selectedGroup.value)) {
    const toDeleteKey = selectedGroup.value;
    const oldGroup = [...initiatives.value];

    executor.runCommand(() => {
      allInitiatives.value?.delete(toDeleteKey);
      i.deleteInits(GroupNamePrefix.value + toDeleteKey);
      setSelected(first(groupNames.value));
    },
      () => {
        allInitiatives.value?.set(toDeleteKey, oldGroup);
        i.saveInits(oldGroup, GroupNamePrefix.value + toDeleteKey);
        setSelected(toDeleteKey);
      });
  }
}

function addEntry(init?: InitWithId) {
  const toAdd = init ?? newEntry();
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
  addEntry({ ...monster, id: entryId++ })
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

function* loadAllGroups(): Generator<readonly [string, Initiatives], void, unknown> {
  let returned = false;

  for (const groupName of loadGroupNameKeys()) {
    const group = i.loadInits(GroupNamePrefix.value + groupName);
    returned = true;
    yield [groupName, group] as const;
  }

  if (!returned) {
    yield ["Default", [newEntry()]] as const;
  }
}

function* loadGroupNameKeys() {
  const count = localStorage.length;
  const prefixLength = FullPrefix.value.length;

  for (let i = 0; i < count; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(FullPrefix.value)) {
      yield key.substring(prefixLength);
    }
  }
}
</script>