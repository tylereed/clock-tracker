<template>
  <v-form v-model="isFormValid" @submit.prevent="addInitiative">
    <v-card>
      <v-card-title>Add {{ isEdit ? "Monster" : "PC" }} Initiative</v-card-title>
      <v-card-text>
        <v-container>
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
import { onMounted, reactive, ref, toRefs } from "vue";

import TsExpandoButton from "@/components/common/TsExpandoButton.vue";

import Dice from "@/utils/Dice";
import Initiative, { Actions } from "@/types/Initiative";
import { MonsterO5e } from "@/utils/Open5e";
import v from "./InitiativeRules";

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

onMounted(() => {
  if (monsterStats.value) {
    isEdit.value = true;
    initiativeDice.value = Dice.D20.ofStat(monsterStats.value.dexterity);
    healthDice.value = Dice.parse(monsterStats.value.hit_dice);
    newInit.value = {
      name: monsterStats.value.name,
      order: 10 + Dice.calculateModifier(monsterStats.value.dexterity),
      dex: monsterStats.value.dexterity,
      ac: monsterStats.value.armor_class,
      maxHp: monsterStats.value.hit_points,
      conditions: {},
      actions: [...buildActions(monsterStats.value.actions)]
    };
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
  { label: "Min", action: () => newInit.value.maxHp = healthDice.value?.Min},
  { label: "Max", action: () => newInit.value.maxHp = healthDice.value?.Max},
  { label: "Average", action: () => newInit.value.maxHp = monsterStats.value?.hit_points}
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
</script>