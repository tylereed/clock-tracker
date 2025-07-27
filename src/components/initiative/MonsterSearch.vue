<template>
  <v-container fluid>
    <v-row>
      <v-col cols="9">
        <v-autocomplete v-model="monsterSearch" v-model:search="searchInput" :loading="loading" :items="monsters"
          return-object auto-select-first item-title="name" item-value="slug" @update:search="doSearchDebounced">
          <template v-slot:append>
            <show-stats :disabled="!isO5e(monsterSearch)" :id="getSlug(monsterSearch)" />
          </template>
          <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props" :title="''">
              {{ item.title }} <v-chip density="comfortable" size="x-small">{{ item.raw.document__slug }}</v-chip>
            </v-list-item>
          </template>
          <template v-slot:no-data>
            <v-list-item>
              <v-list-item-title>
                {{ searchInput?.length >= 3 ? "No creatures found" : "Enter at least 3 characters to search" }}
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-autocomplete>
        <br />
        <v-card flat>
          <v-card-actions>
            <v-btn variant="elevated" @click="showLicense = !showLicense">Monster Data License Information</v-btn>
            <v-btn variant="elevated" :disabled="!customMonsters.length" @click="showSaved = !showSaved">
              Show Saved Monsters
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="3">
        <ts-expando-button class="mt-3" :disabled="!monsterSearch" :actions="addMonsterButtons" />
      </v-col>
    </v-row>
  </v-container>
  <v-dialog v-model="addInitiativeDisplay" width="60%" min-width="400px">
    <add-edit-initiative class="pa-2 ma-6" :monster-stats="monsterStats" @add-init="addInit"
      @close="addInitiativeDisplay = false" />
  </v-dialog>
  <v-dialog v-model="showLicense" width="75%" min-width="400px">
    <license />
  </v-dialog>
  <v-dialog v-model="showSaved">
    <v-card>
      <v-card-text>
        <v-row v-for="(custom, index) in customMonsters">
          <v-col cols="2">
            <v-card>
              <v-card-text>{{ custom.name }}</v-card-text>
              <v-card-actions><v-btn @click="deleteCustom(index)"><v-icon icon="mdi-delete-forever"
                    color="error" /></v-btn></v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import debounce from "debounce";

import AddEditInitiative from "@/components/initiative/AddEditInitiative.vue";
import License from "@/components/initiative/License.vue";
import ShowStats from "./ShowStats.vue";

import TsExpandoButton from "@/components/common/TsExpandoButton.vue";
import Initiative from "@/types/Initiative";
import { monsterO5eToInitiative } from "./initiativeHelpers";
import { MonsterNameO5e, getMonsterListCached, getMonsterCached, MonsterO5e, isO5e } from "@/utils/Open5e";
import { useStorage } from "@vueuse/core";

const emit = defineEmits<{
  (e: "addMonster", monster: Initiative): void
}>();

type CustomMonster = Initiative & { document__slug: string };
type MonsterName = CustomMonster | MonsterNameO5e;

const addInitiativeDisplay = ref(false);
const showLicense = ref(false);

const monsterSearch = ref<MonsterName>();
const searchInput = ref<string>("");
const monsters = ref<(MonsterName)[]>([]);
const monsterStats = ref<MonsterO5e | Initiative | null>(null);

const loading = ref(false);

function getSlug(monster?: MonsterName) {
  if (isO5e(monster)) {
    return monster.slug;
  }
}

const doSearchDebounced = debounce(doSearch, 300);
async function doSearch(text: string) {
  if (text.length >= 3 && text !== monsterSearch.value?.name) {
    loading.value = true;
    try {
      const o5eList = await getMonsterListCached(text);
      const customList = getCustomList(text);

      const result = [
        ...o5eList.map(o5e => ({ ...o5e, type: "o5e" })),
        ...customList.map(c => ({ ...c, type: "custom", document__slug: "custom" }))
      ].sort((a, b) => a.name.localeCompare(b.name));

      monsters.value = result;
    } finally {
      loading.value = false;
    }
  } else {
    monsters.value = [];
    loading.value = false;
  }
}

const addMonsterButtons = reactive([
  { label: "Add Monster", action: addMonster },
  { label: "Edit Monster", action: editMonster }
]);

function addInit(init: Initiative) {
  emit("addMonster", init);
  addInitiativeDisplay.value = false;
}

async function editMonster() {
  if (monsterSearch.value) {
    if (isO5e(monsterSearch.value)) {
      monsterStats.value = await getMonsterCached(monsterSearch.value.slug);
    } else {
      monsterStats.value = monsterSearch.value as Initiative;
    }
    addInitiativeDisplay.value = true;
  }
}

let nameIndex = 0;
async function addMonster() {
  if (monsterSearch.value) {
    let initMonster: Initiative;
    const letter = String.fromCharCode(65 + nameIndex);
    nameIndex++;
    if (nameIndex > 25) {
      nameIndex = 0;
    }

    if (isO5e(monsterSearch.value)) {
      //todo: make this handle o5e or saved custom
      const monster = await getMonsterCached(monsterSearch.value.slug);
      initMonster = monsterO5eToInitiative(monster, `${monster.name} ${letter}`);
    } else {
      initMonster = {
        ...monsterSearch.value,
        name: `${monsterSearch.value.name} ${letter}`
      } as Initiative;
    }

    emit("addMonster", initMonster);
  }
}


const showSaved = ref(false);
const customMonsters = useStorage("customMonsters", [] as Initiative[]);

function deleteCustom(index: number) {
  customMonsters.value.splice(index, 1);
  if (customMonsters.value.length === 0) {
    showSaved.value = false;
  }
}

function getCustomList(search: string) {
  return customMonsters.value.filter(m => m.name.toLowerCase().includes(search.toLowerCase())).map(m => ({ ...m }));
}


</script>