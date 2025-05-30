<template>
  <v-container fluid>
    <v-row>
      <v-col cols="9">
        <v-autocomplete v-model="monsterSearch" v-model:search="searchInput" :loading="loading" :items="monsters"
          return-object auto-select-first item-title="name" item-value="slug" @update:search="doSearchDebounced">
          <template v-slot:append>
            <show-stats :disabled="!monsterSearch" :id="monsterSearch?.slug!" />
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
        <div><v-btn @click="showLicense = !showLicense">Monster Data License Information</v-btn></div>
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
import { MonsterNameO5e as MonsterName, getMonsterListCached, getMonsterCached, MonsterO5e } from "@/utils/Open5e";

const emit = defineEmits<{
  (e: "addMonster", monster: Initiative): void
}>();

const addInitiativeDisplay = ref(false);
const showLicense = ref(false);

const monsterSearch = ref<MonsterName>();
const searchInput = ref<string>("");
const monsters = ref<MonsterName[]>([]);
const monsterStats = ref<MonsterO5e | null>(null);

const loading = ref(false);

const doSearchDebounced = debounce(doSearch, 300);
async function doSearch(text: string) {
  if (text.length >= 3 && text !== monsterSearch.value?.name) {
    loading.value = true;
    try {
      const result = await getMonsterListCached(text);
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
    monsterStats.value = await getMonsterCached(monsterSearch.value.slug);
    addInitiativeDisplay.value = true;
  }
}

let nameIndex = 0;
async function addMonster() {
  if (monsterSearch.value) {
    const monster = await getMonsterCached(monsterSearch.value.slug);
    const letter = String.fromCharCode(65 + nameIndex);
    nameIndex++;
    if (nameIndex > 25) {
      nameIndex = 0;
    }

    const initMonster = monsterO5eToInitiative(monster, `${monster.name} ${letter}`);

    emit("addMonster", initMonster);
  }
}

</script>