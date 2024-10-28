<template>
  <v-container fluid>
    <v-row>
      <v-col cols="11">
        <v-combobox label="Monsters" v-model="search" @update:model-value="setSelected" :items="monsterNames"
          @keyup.enter="createNewMonster" :hide-no-data="false">
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
          <v-btn :disabled="monsterNames.length <= 1">
            <v-icon icon="mdi-delete-forever" color="error" @click="deleteSelectedMonster" />
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
        <v-btn variant="elevated" color="primary" @click="addMonster">Add</v-btn>
      </v-col>
      <v-col>
        <v-btn variant="elevated" color="primary" @click="sendToInit">Send to Initiative</v-btn>
      </v-col>
    </v-row>
  </v-container>
  <monster-search @add-monster="addExistingMonster" />
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
import MonsterSearch from "@/components/initiative/MonsterSearch.vue";

import { Executor } from "@/utils/Executor";
import Initiative, { Initiatives, InitWithId } from "@/types/Initiative";
import { first } from "@/utils/helpers";

let npcId = 0;
const MonsterNamePrefix = "monster-";
const FullPrefix = i.makeKey(MonsterNamePrefix)


const emit = defineEmits<{
  (e: "sendToInitiative", inits: Initiatives): void,
}>();

const allInitiatives = ref<Map<string, Initiatives>>();
const initiatives = ref<Initiatives>([]);
const monsterNames = computed(() => allInitiatives.value ? [...allInitiatives.value.keys()] : []);
const search = ref<string>("Default");
const selectedMonster = ref<string>("Default");

watch(selectedMonster, (value) => {
  if (value && allInitiatives.value) {
    initiatives.value = allInitiatives.value?.get(value) ?? [];
  } else {
    initiatives.value = [];
  }
});

const columns = i.buildInitiativeColumns({ hasDex: true });

const executor = new Executor(() => i.saveInits(initiatives.value, `${MonsterNamePrefix}${selectedMonster.value}`));

onMounted(() => {
  allInitiatives.value = new Map<string, Initiatives>(loadAllCombats());
  npcId = [...allInitiatives.value.values()].flatMap(x => x).map(x => x.order).reduce((x, y) => x > y ? x : y);

  const f = first(monsterNames.value);
  if (f) {
    setSelected(f);
  }
});

function newNpc(): InitWithId {
  return {
    id: npcId++,
    order: 0,
    name: "",
    conditions: {},
  };
}

function setSelected(selected?: string | null) {
  if (selected && allInitiatives.value?.has(selected)) {
    search.value = selected;
    selectedMonster.value = selected;
  }
}

function createNewMonster() {
  if (!allInitiatives.value?.has(search.value)) {
    const selectedMonsterName = selectedMonster.value;
    const newMonsterName = search.value;
    const newMonster = [newNpc()];

    executor.runCommand(() => {
      allInitiatives.value!.set(newMonsterName, [...newMonster]);
      setSelected(newMonsterName);
    },
      () => {
        setSelected(selectedMonsterName);
        allInitiatives.value!.delete(newMonsterName);
      });
  }
}

function deleteSelectedMonster() {
  if (selectedMonster.value && allInitiatives.value?.has(selectedMonster.value)) {
    const toDeleteKey = selectedMonster.value;
    const oldMonster = [...initiatives.value];

    executor.runCommand(() => {
      allInitiatives.value?.delete(toDeleteKey);
      i.deleteInits(MonsterNamePrefix + toDeleteKey);
      setSelected(first(monsterNames.value));
    },
      () => {
        allInitiatives.value?.set(toDeleteKey, oldMonster);
        i.saveInits(oldMonster, MonsterNamePrefix + toDeleteKey);
        setSelected(toDeleteKey);
      });
  }
}

function addMonster(init?: InitWithId) {
  const toAdd = init ?? newNpc();
  const selected = selectedMonster.value;

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
  addMonster({ ...monster, id: npcId++ });
}

function sendToInit() {
  emit("sendToInitiative", [...initiatives.value]);
}

function deleteInitiative(id: number) {
  const removed = initiatives.value[id];
  const selected = selectedMonster.value;

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
  const selected = selectedMonster.value;
  i.insertInitCommand(executor, initiatives.value, index, propName, newValue, oldValue,
    () => {
      setSelected(selected);
    });
}

function* loadAllCombats(): Generator<readonly [string, Initiatives], void, unknown> {
  let returned = false;

  for (const monsterName of loadMonsterNameKeys()) {
    const monster = i.loadInits(MonsterNamePrefix + monsterName);
    returned = true;
    yield [monsterName, monster] as const;
  }

  if (!returned) {
    yield ["Default", [newNpc()]] as const;
  }
}

function* loadMonsterNameKeys() {
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