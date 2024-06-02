<template>
  <v-card class="ma-2">
    <v-card-item><v-card-title>Initiative</v-card-title></v-card-item>
    <v-card-text>
      <v-container fluid>
        <v-row class="font-weight-bold" dense>
          <v-col>Round {{ round }}</v-col>
          <v-col>Initiative</v-col>
          <v-col cols="3">Name</v-col>
          <v-col>AC</v-col>
          <v-col>Max HP</v-col>
          <v-col>HP</v-col>
          <v-col cols="4">Conditions</v-col>
        </v-row>
        <v-row align="center" v-for="(init, i) in initiatives" :key="i" :class="getRowClass(i)" dense
          style="border-top: 1px solid darkgray;">
          <v-col text-align="center"><v-icon v-if="i === turn" icon="mdi-circle-medium" /></v-col>
          <v-col><v-text-field :hide-details="true" density="compact" v-model="init.order"
              @update:focused="resort" /></v-col>
          <v-col cols="3"><v-text-field :hide-details="true" density="compact" v-model="init.name" /></v-col>
          <v-col><v-text-field :hide-details="true" density="compact" v-model="init.ac" /></v-col>
          <v-col><v-text-field :hide-details="true" density="compact" v-model="init.maxHp" /></v-col>
          <v-col><v-text-field :hide-details="true" density="compact" v-model="init.hp" /></v-col>
          <v-col cols="3">{{ init.conditions }}</v-col>
          <v-col>
            <v-btn @click.stop="deleteInitiative(i)" :class="getRowClass(i)">
              <v-icon icon="mdi-delete-forever" color="error" />
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col><v-btn @click="decrementTurn" :disabled="turn === 0 && round === 1">Previous</v-btn></v-col>
          <v-col><v-btn @click="incrementTurn" :disabled="initiatives.length === 0">Next</v-btn></v-col>
          <v-col><v-btn @click="resetTurn">Reset</v-btn></v-col>
          <v-col><v-btn @click="addInitiativeDisplay = true" class="mt-3" variant="elevated" color="primary">Add
              Initiative</v-btn></v-col>
        </v-row>
        <v-row>
          <v-col cols="11">
            <v-autocomplete v-model="monsterSearch" :items="monsters" :custom-filter="monsterNameFilter" return-object
              auto-select-first item-title="name" item-value="slug">
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props" :title="''">
                  {{ item.title }} <v-chip density="comfortable" size="x-small">{{ item.raw.document__slug }}</v-chip>
                </v-list-item>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col cols="1">
            <v-btn class="mt-3" variant="elevated" color="primary" :disabled="!monsterSearch"
              @click="addMonster">Add<br />Monster</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>

  <v-dialog v-model="addInitiativeDisplay" width="25%" min-width="400px">
    <add-initiative class="pa-2 ma-6" @add-init="addInit" @close="addInitiativeDisplay = false" />
  </v-dialog>
</template>

<style scoped>
.alternate-row {
  background: #c2cdd2;
}
</style>

<script setup lang="ts">
import Initiative from "@/types/Initiative";
import { MonsterNameO5e as MonsterName, getMonsterListCached, getMonsterCached } from "@/utils/Open5e";

import { onBeforeMount, ref } from "vue";
import AddInitiative from "@/components/initiative/AddInitiative.vue";

type Initiatives = Initiative[];

const initiatives = ref<Initiatives>([]);

function addInit(init: Initiative) {
  insertInitiative(init);
  addInitiativeDisplay.value = false;
}

function insertInitiative(init: Initiative) {
  setInitiatives([...initiatives.value, init]);
}

function resort() {
  setInitiatives([...initiatives.value]);
}

function setInitiatives(inits: Initiatives) {
  initiatives.value = inits.sort((a, b) => b.order - a.order);
}

function deleteInitiative(index: number) {
  initiatives.value.splice(index, 1);
  if (turn.value > index) {
    turn.value--;
  }
}

function getRowClass(index: number) {
  if (index % 2 === 1) {
    return "alternate-row";
  }
}


const turn = ref(0);
const round = ref(1);

function decrementTurn() {
  if (turn.value == 0 && round.value == 1) {
    return;
  }
  turn.value--;
  if (turn.value < 0) {
    turn.value = initiatives.value.length - 1;
    round.value--;
  }
}

function incrementTurn() {
  turn.value++;
  if (turn.value === initiatives.value.length) {
    turn.value = 0;
    round.value++;
  }
}

function resetTurn() {
  turn.value = 0;
  round.value = 1;
}


const addInitiativeDisplay = ref(false);


const monsterSearch = ref<MonsterName>();

onBeforeMount(async () => {
  monsters.value = await getMonsterListCached();
})

const monsters = ref<MonsterName[]>([]);
function monsterNameFilter(title: string, queryText: string): boolean {
  return title.toLocaleLowerCase().includes(queryText.toLocaleLowerCase());
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
      order: Math.floor((monster.dexterity - 10) / 2),
      ac: monster.armor_class,
      maxHp: monster.hit_points,
      hp: monster.hit_points
    }

    insertInitiative(initMonster);
  }
}

</script>