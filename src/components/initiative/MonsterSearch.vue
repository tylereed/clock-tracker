<template>
  <v-container fluid>
    <v-row>
      <v-col cols="9">
        <v-autocomplete v-model="monsterSearch" :items="monsters" :custom-filter="monsterNameFilter" return-object
          auto-select-first item-title="name" item-value="slug">
          <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props" :title="''">
              {{ item.title }} <v-chip density="comfortable" size="x-small">{{ item.raw.document__slug }}</v-chip>
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
  <v-dialog v-model="addInitiativeDisplay" width="50%" min-width="400px">
    <add-edit-initiative class="pa-2 ma-6" :monster-stats="monsterStats" @add-init="addInit"
      @close="addInitiativeDisplay = false" />
  </v-dialog>
  <v-dialog v-model="showLicense" width="75%" min-width="400px">
    <license />
  </v-dialog>
</template>

<script setup lang="ts">
import { onBeforeMount, reactive, ref } from "vue";

import AddEditInitiative from "@/components/initiative/AddEditInitiative.vue";
import License from "@/components/initiative/License.vue";
import TsExpandoButton from "@/components/common/TsExpandoButton.vue";

import Dice from "@/utils/Dice";
import Initiative, { Actions } from "@/types/Initiative";
import { MonsterNameO5e as MonsterName, getMonsterListCached, getMonsterCached, MonsterO5e } from "@/utils/Open5e";

const emit = defineEmits<{
  (e: "addMonster", monster: Initiative): void
}>();

const addInitiativeDisplay = ref(false);
const showLicense = ref(false);

const monsterSearch = ref<MonsterName>();
const monsterStats = ref<MonsterO5e | null>(null);

onBeforeMount(async () => {
  monsters.value = await getMonsterListCached();
});

const monsters = ref<MonsterName[]>([]);
function monsterNameFilter(title: string, queryText: string): boolean {
  return title.toLocaleLowerCase().includes(queryText.toLocaleLowerCase());
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

    const initMonster: Initiative = {
      name: `${monster.name} ${letter}`,
      order: 10 + Dice.calculateModifier(monster.dexterity),
      dex: monster.dexterity,
      ac: monster.armor_class,
      maxHp: monster.hit_points,
      hp: monster.hit_points,
      conditions: {},
      actions: [...buildActions(monster.actions)]
    }

    emit("addMonster", initMonster);
  }
}

function* buildActions(...args: ({ name: string, desc: string }[] | undefined)[]): Generator<Actions> {

  for (const arg of args) {
    if (arg) {
      for (const a of arg) {
        yield { name: a.name, desc: a.desc };
      }
    }
  }
}

</script>