<template>
  <v-card class="ma-2">
    <v-card-item><v-card-title>Initiative</v-card-title></v-card-item>
    <v-card-text>
      <v-container fluid>
        <v-row class="font-weight-bold" dense>
          <v-col>Round {{ round }}</v-col>
          <v-col>Initiative</v-col>
          <v-col>Name</v-col>
          <v-col>AC</v-col>
          <v-col>Max HP</v-col>
          <v-col>HP</v-col>
          <v-col cols="6">Conditions</v-col>
        </v-row>
        <v-row align="center" v-for="(init, i) in initiatives" :key="i" :class="getRowClass(i)" dense
          style="border-top: 1px solid darkgray;">
          <v-col text-align="center"><v-icon v-if="i === turn" icon="mdi-circle-medium" /></v-col>
          <v-col><v-text-field :hide-details="true" density="compact" v-model="init.order"
              @update:focused="resort" /></v-col>
          <v-col><v-text-field :hide-details="true" density="compact" v-model="init.name" /></v-col>
          <v-col><v-text-field :hide-details="true" density="compact" v-model="init.ac" /></v-col>
          <v-col><v-text-field :hide-details="true" density="compact" v-model="init.maxHp" /></v-col>
          <v-col><v-text-field :hide-details="true" density="compact" v-model="init.hp" /></v-col>
          <v-col cols="5">{{ init.conditions }}</v-col>
          <v-col>
            <v-btn @click.stop="deleteInitiative(i)" :class="getRowClass(i)">
              <v-icon icon="mdi-delete-forever" color="error" />
            </v-btn>
          </v-col>
        </v-row>
        <v-form ref="addForm" v-model="isFormValid" @submit.prevent="addInitiative">
          <v-row dense class="py-2">
            <v-col><v-spacer /></v-col>
            <v-col><v-text-field label="Initiative" density="compact" v-model="newInit.order"
                :rules="[v.isNumericRule]" /></v-col>
            <v-col><v-text-field label="Name" density="compact" v-model="newInit.name"
                :rules="[v.isRequiredRule]" /></v-col>
            <v-col><v-text-field label="AC" density="compact" v-model="newInit.ac" :rules="[v.isNumericRule]" /></v-col>
            <v-col><v-text-field label="HP" density="compact" v-model="newInit.maxHp"
                :rules="[v.isNumericRule]" /></v-col>
            <v-col cols="5"><v-spacer /></v-col>
            <v-col><v-btn :disabled="!isFormValid" type="submit">Add</v-btn></v-col>
            <v-col><v-btn type="clear" @click="clearAddInit">Clear</v-btn></v-col>
          </v-row>
        </v-form>
        <v-row>
          <v-col><v-btn @click="decrementTurn" :disabled="turn === 0 && round === 1">Previous</v-btn></v-col>
          <v-col><v-btn @click="incrementTurn" :disabled="initiatives.length === 0">Next</v-btn></v-col>
          <v-col><v-btn @click="reset">Reset</v-btn></v-col>
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
</template>

<style scoped>
.alternate-row {
  background: #c2cdd2;
}
</style>

<script setup lang="ts">
import Initiative from "@/types/Initiative";
import { MonsterNameO5e as MonsterName, getMonsterListCached, getMonsterCached } from "@/utils/Open5e";
import * as v from "@/utils/validators";
import { onBeforeMount, ref, } from "vue";
import { VForm } from "vuetify/lib/components/index.mjs";

type Initiatives = Initiative[];
type NewInitiative = Omit<Initiative, 'hp'>;

const initiatives = ref<Initiatives>([]);

const addForm = ref<VForm>(null!);
const isFormValid = ref(false);
const newInit = ref<NewInitiative>({} as NewInitiative);

function insertInitiative(init: Initiative) {
  setInitiatives([...initiatives.value, init]);
}

function resort() {
  setInitiatives([...initiatives.value]);
}

function setInitiatives(inits: Initiatives) {
  initiatives.value = inits.sort((a, b) => b.order - a.order);
}

function addInitiative() {
  if (isFormValid.value) {
    const init = { ...newInit.value, hp: newInit.value.maxHp };
    setInitiatives([...initiatives.value, init]);
  }
}

function clearAddInit() {
  addForm.value.reset();
  addForm.value.isValid = null;
  addForm.value.errors = [];
  addForm.value.items.forEach(element => {
    element.errorMessages = [];
    element.isValid = null;
  });
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

function reset() {
  turn.value = 0;
  round.value = 1;
}


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