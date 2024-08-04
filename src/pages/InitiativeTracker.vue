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
              @update:focused="(focused) => updateUndoRedo(i, 'order', focused)" /></v-col>
          <v-col cols="3"><v-text-field :hide-details="true" density="compact" v-model="init.name"
              @update:focused="(focused) => updateUndoRedo(i, 'name', focused)" /></v-col>
          <v-col><v-text-field :hide-details="true" density="compact" v-model="init.ac"
              @update:focused="(focused) => updateUndoRedo(i, 'ac', focused)" /></v-col>
          <v-col><v-text-field :hide-details="true" density="compact" v-model="init.maxHp"
              @update:focused="(focused) => updateUndoRedo(i, 'maxHp', focused)" /></v-col>
          <v-col><v-text-field :hide-details="true" density="compact" v-model="init.hp"
              @update:focused="(focused) => updateUndoRedo(i, 'hp', focused)" /></v-col>
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
    <v-card-actions>
      <v-btn :disabled="!executor.canUndo.value" @click="() => executor.undo()">
        <v-icon icon="mdi-undo" />
      </v-btn>
      <v-btn :disabled="!executor.canRedo.value" @click="() => executor.redo()">
        <v-icon icon="mdi-redo" />
      </v-btn>
    </v-card-actions>
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
import { Executor, Command } from "@/utils/Executor";
import debounce from "debounce";

type InitWithId = Initiative & { id: number };
type Initiatives = InitWithId[];

const initiatives = ref<Initiatives>([]);

const executor = new Executor(saveInits);

function addInit(init: Initiative) {
  insertInitiative(init);
  addInitiativeDisplay.value = false;
}

let initId = 0;
function insertInitiative(init: Initiative) {
  const newInit = { ...init, id: initId };
  initId++;

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
  initiatives.value = inits.sort((a, b) => b.order - a.order || b.dex - a.dex);
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

function getRowClass(index: number) {
  if (index % 2 === 1) {
    return "alternate-row";
  }
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
      dex: monster.dexterity,
      ac: monster.armor_class,
      maxHp: monster.hit_points,
      hp: monster.hit_points
    }

    insertInitiative(initMonster);
  }
}

const oldValues = new Map<string, any>();
function updateUndoRedo(index: number, propName: keyof Initiative, focused: boolean) {
  if (focused) {
    const value = initiatives.value[index][propName];
    if (value !== "") {
      oldValues.set(propName + index, value);
    }
  } else {
    const initiative = initiatives.value[index];
    const value = initiative[propName];
    const oldValue = oldValues.get(propName + index);
    if (value == oldValue) {
      return;
    }

    const command: Command = {
      execute: () => {
        const init = initiative as any;
        init[propName] = value;
        if (propName === "order") {
          resort();
        }
      },
      undo: () => {
        const init = initiative as any;
        init[propName] = oldValue;
        if (propName === "order") {
          resort();
        }
      }
    };
    executor.pushUndo(command);
    if (propName === "order") {
      resort();
    }
  }
}

const saveDebounced = debounce(function () {
  try {
    const toSave = [...initiatives.value];
    const saveData = JSON.stringify(toSave);
    localStorage.setItem("inits", saveData);
  } catch (e) {
    console.log(e);
  }
}, 500);
function saveInits() {
  saveDebounced();
}

function loadInits() {
  try {
    const initJson = localStorage.getItem("inits");
    if (initJson) {
      const restoredInits = JSON.parse(initJson) as Initiatives;
      if (restoredInits.length > 0) {
        initiatives.value = restoredInits;
      }
    }
  } catch (e) {
    console.log(e);
  }
}

loadInits();
</script>