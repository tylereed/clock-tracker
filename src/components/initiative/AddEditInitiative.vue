<template>
  <v-form v-model="isFormValid" @submit.prevent="addInitiative">
    <v-card>
      <v-card-title>Add {{ isEdit ? "Monster" : "PC" }} Initiative</v-card-title>
      <v-card-text>
        <v-container>
          <v-row v-if="isEdit">
            <v-col cols="9">
              <v-select v-model="selectedTemplate" density="compact" label="Template" :items="templates" />
            </v-col>
            <v-col cols="3">
              <v-btn @click="applyTemplate">Apply Template</v-btn>
            </v-col>
          </v-row>
          <v-row v-if="selectedTemplate === 'Zombie'">
            <v-col>
              <v-checkbox label="Undead Fortitude" density="compact" v-model="undeadFortitude" />
            </v-col>
            <v-col>
              <v-checkbox label="Infectious Bite" density="compact" v-model="infectiousBite" />
            </v-col>
            <v-col>
              <v-checkbox label="Vile Discharge" density="compact" v-model="vileDischarge" />
            </v-col>
            <v-col>
              <v-checkbox label="Vigor Mortis" density="compact" v-model="vigorMortis" />
            </v-col>
          </v-row>
          <v-row>
            <v-col :cols="isEdit ? 9 : 12"><v-text-field label="Initiative" density="compact" v-model="newInit.order"
                :rules="v.OrderRules" /></v-col>
            <v-col v-if="isEdit" cols="3">
              <v-btn @click="rollInitiative" v-tooltip:top="initiativeDice.toString()">Roll</v-btn>
            </v-col>
            <v-col cols="12"><v-text-field label="Name" density="compact" v-model="newInit.name"
                :rules="v.NameRules" /></v-col>
            <v-col cols="12"><v-text-field label="Dex Score" density="compact" v-model="newInit.dex"
                :rules="v.DexRules" /></v-col>
            <v-col cols="12"><v-text-field label="AC" density="compact" v-model="newInit.ac"
                :rules="v.AcRules" /></v-col>
            <v-col :cols="isEdit && healthDice ? 9 : 12"><v-text-field label="HP" density="compact"
                v-model="newInit.maxHp" :rules="v.MaxHpRules" /></v-col>
            <v-col v-if="isEdit && healthDice" cols="3">
              <ts-expando-button v-bind="props" :actions="healthRollActions" v-tooltip:top="healthDice.toString()" />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn variant="elevated" color="primary" :disabled="!isFormValid" type="submit">Add</v-btn>
        <v-btn @click="emit('close')" variant="outlined">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, toRefs, watch } from "vue";

import TsExpandoButton from "@/components/common/TsExpandoButton.vue";

import Dice from "@/utils/Dice";
import Initiative, { Actions } from "@/types/Initiative";
import { MonsterO5e } from "@/utils/Open5e";
import v from "./InitiativeRules";
import { TemplateType } from "./templates";
import * as t from "./templates";

const props = defineProps<{ monsterStats?: MonsterO5e | null }>();
const { monsterStats } = toRefs(props);

const emit = defineEmits<{
  (e: "addInit", init: Initiative): void,
  (e: "close"): void,
}>();

type NewInitiative = Omit<Initiative, "hp">;

const isFormValid = ref(false);
const isEdit = ref(false);
const newInit = ref<NewInitiative>({} as NewInitiative);
let defaultHealth = 0;

function setMonster(monster: MonsterO5e) {
  initiativeDice.value = Dice.D20.ofStat(monster.dexterity);
  healthDice.value = Dice.parse(monster.hit_dice);
  defaultHealth = monster.hit_points;
  newInit.value = {
    name: monster.name,
    order: 10 + Dice.calculateModifier(monster.dexterity),
    dex: monster.dexterity,
    ac: monster.armor_class,
    maxHp: monster.hit_points,
    conditions: {},
    actions: [...buildActions(monster.actions)]
  };
}

onMounted(() => {
  if (monsterStats.value) {
    isEdit.value = true;
    setMonster(monsterStats.value);
  } else {
    isEdit.value = false;
    newInit.value = {} as NewInitiative;
  }
});

function* buildActions(...args: ({ name: string, desc: string }[] | undefined)[]): Generator<Actions> {

  for (const arg of args) {
    if (arg) {
      for (const a of arg) {
        yield { name: a.name, desc: a.desc };
      }
    }
  }
}

const initiativeDice = ref<Dice>(Dice.D20.ofModifier(0));
function rollInitiative() {
  newInit.value.order = initiativeDice.value.throw();
}

const healthDice = ref<Dice>();
const healthRollActions = reactive([
  { label: "Roll", action: () => rollHealth() },
  { label: "Roll 1.5x", action: () => rollHealth(1.5) },
  { label: "Roll 2x", action: () => rollHealth(2) },
  { label: "Min", action: () => newInit.value.maxHp = healthDice.value?.Min },
  { label: "Max", action: () => newInit.value.maxHp = healthDice.value?.Max },
  { label: "Average", action: () => newInit.value.maxHp = defaultHealth }
]);

function rollHealth(multiplier?: number) {
  newInit.value.maxHp = healthDice.value?.throw(multiplier);
}

function asInt(item?: number | string) {
  if (typeof item !== "undefined") {
    return +item;
  }
  return undefined;
}

function addInitiative() {
  if (isFormValid.value) {
    const init: Initiative = {
      order: +newInit.value.order,
      name: newInit.value.name,
      dex: asInt(newInit.value.dex),
      ac: asInt(newInit.value.ac),
      maxHp: asInt(newInit.value.maxHp),
      hp: asInt(newInit.value.maxHp),
      conditions: {},
      actions: newInit.value.actions,
      bonusAction: newInit.value.bonusAction
    };
    emit("addInit", init);
  }
}

const undeadFortitude = ref(true);
const infectiousBite = ref(false);
const vileDischarge = ref(false);
const vigorMortis = ref(false);

function getOptions(type: TemplateType) {
  switch (type) {
    case "Zombie":
      return {
        undeadFortitude: undeadFortitude.value,
        infectiousBite: infectiousBite.value,
        vileDischarge: vileDischarge.value,
        vigorMortis: vigorMortis.value
      };
  }
}

const templates = ref(t.templates);
const selectedTemplate = ref<TemplateType>("Squad");
function applyTemplate() {
  if (selectedTemplate.value && monsterStats.value) {
    const options = getOptions(selectedTemplate.value);
    const template = t.applyTemplate(selectedTemplate.value, monsterStats.value, options);
    if (template) {
      setMonster(template);
    }
  }
}

watch(selectedTemplate, value => {
  if (value === "Zombie") {
    undeadFortitude.value = true;
    infectiousBite.value = false;
    vileDischarge.value = false;
    vigorMortis.value = false;
  }
});

</script>