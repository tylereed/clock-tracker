<template>
  <initiative-table :initiatives="initiatives" :turn="turn" :round="round" @apply-condition="applyCondition"
    @remove-condition="removeCondition" @add-initiative="addInitiative" @delete-initiative="deleteInitiative"
    @increment-turn="incrementTurn" @decrement-turn="decrementTurn" @reset-turn="resetTurn"
    @insert-init-command="insertInitCommand" />
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
  <v-card-actions>
    <v-btn :disabled="!executor.canUndo.value" @click="() => executor.undo()">
      <v-icon icon="mdi-undo" />
    </v-btn>
    <v-btn :disabled="!executor.canRedo.value" @click="() => executor.redo()">
      <v-icon icon="mdi-redo" />
    </v-btn>
  </v-card-actions>
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
import InitiativeTable from "@/components/initiative/InitiativeTable.vue";
import License from "@/components/initiative/License.vue";
import TsExpandoButton from "@/components/common/TsExpandoButton.vue";

import Conditions from "@/types/Conditions";
import Dice from "@/utils/Dice";
import { Executor, Command } from "@/utils/Executor";
import Initiative, { Actions, Initiatives } from "@/types/Initiative";
import * as i from "@/components/initiative/initiativeHelpers";
import { MonsterNameO5e as MonsterName, getMonsterListCached, getMonsterCached, MonsterO5e } from "@/utils/Open5e";

const initiatives = ref<Initiatives>([]);

const executor = new Executor(() => i.saveInits(initiatives.value, "encounter"));

function addInit(init: Initiative) {
  insertInitiative(init);
  addInitiativeDisplay.value = false;
}

let initId = 0;
function insertInitiative(init: Initiative) {
  const newInit = { ...init, id: initId++ };

  executor.runCommand(() => {
    setInitiatives([...initiatives.value, newInit]);
  }, (): void => {
    initiatives.value = initiatives.value.filter(x => x.id !== newInit.id)
  });

}

function resort() {
  setInitiatives([...initiatives.value]);
}

function setInitiatives(inits: Initiatives) {
  initiatives.value = inits.sort((a, b) => b.order - a.order || (b.dex ?? 0) - (a.dex ?? 0));
}

function deleteInitiative(index: number) {
  const removed = initiatives.value[index];
  const incrementTurn = turn.value > index;

  executor.runCommand(() => {
    initiatives.value.splice(index, 1);
    if (turn.value > index) {
      turn.value--;
    }
  }, () => {
    initiatives.value.splice(index, 0, removed);
    if (incrementTurn) {
      turn.value++;
    }
  });
}

const turn = ref(0);
const round = ref(1);

const turnChanger: Command = {
  execute: () => {
    turn.value++;
    if (turn.value === initiatives.value.length) {
      turn.value = 0;
      round.value++;
    }
  },
  undo: () => {
    turn.value--;
    if (turn.value < 0) {
      turn.value = initiatives.value.length - 1;
      round.value--;
    }
  }
}

function decrementTurn() {
  if (turn.value == 0 && round.value == 1) {
    return;
  }
  executor.invertCommand(turnChanger);
}

function incrementTurn() {
  executor.runCommand(turnChanger);
}

function resetTurn() {
  const oldTurn = turn.value;
  const oldRound = round.value;

  executor.runCommand(() => {
    turn.value = 0;
    round.value = 1;
  }, () => {
    turn.value = oldTurn;
    round.value = oldRound;
  });
}

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

function addInitiative() {
  monsterStats.value = null;
  addInitiativeDisplay.value = true;
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

    insertInitiative(initMonster);
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

function insertInitCommand(index: number, propName: keyof Initiative, newValue: any, oldValue: any) {
  i.insertInitCommand(executor, initiatives.value, index, propName, newValue, oldValue,
    function () {
      if (propName === "order") {
        resort();
      }
    }
  );
}

function applyCondition(index: number, name: keyof Conditions) {
  executor.runCommand(() => { initiatives.value[index].conditions[name] = true; },
    () => { initiatives.value[index].conditions[name] = false; });
}

function removeCondition(index: number, name: keyof Conditions) {
  executor.runCommand(() => { initiatives.value[index].conditions[name] = false; },
    () => { initiatives.value[index].conditions[name] = true; });
}

function loadInits() {
  let result = i.loadInits();
  if (result.length) {
    i.saveInits(result, "encounter");
    i.deleteInits();
  } else {
    result = i.loadInits("encounter");
  }
  return result;
}

initiatives.value = loadInits();
</script>