<template>
  <v-form v-model="isFormValid" @submit.prevent="addInitiative">
    <v-card>
      <v-card-title>Add {{ isEdit ? "Monster" : "PC" }} Initiative</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col :cols="isEdit ? 10 : 12"><v-text-field label="Initiative" density="compact" v-model="newInit.order"
                :rules="v.OrderRules" /></v-col>
            <v-col v-if="isEdit" cols="2"><v-btn @click="rollInitiative">Roll</v-btn></v-col>
            <v-col cols="12"><v-text-field label="Name" density="compact" v-model="newInit.name"
                :rules="v.NameRules" /></v-col>
            <v-col cols="12"><v-text-field label="Dex Score" density="compact" v-model="newInit.dex"
                :rules="v.DexRules" /></v-col>
            <v-col cols="12"><v-text-field label="AC" density="compact" v-model="newInit.ac"
                :rules="v.AcRules" /></v-col>
            <v-col :cols="isEdit ? 10 : 12"><v-text-field label="HP" density="compact" v-model="newInit.maxHp"
                :rules="v.MaxHpRules" /></v-col>
            <v-col v-if="isEdit" cols="2"><v-btn @click="rollHealth">Roll</v-btn></v-col>
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
import { onMounted, ref } from "vue";
import Initiative, { Actions } from "@/types/Initiative";
import v from "./InitiativeRules";
import Dice from "@/utils/Dice";
import { MonsterO5e } from "@/utils/Open5e";

const props = defineProps<{ monsterStats: MonsterO5e | null }>();

const emit = defineEmits<{
  (e: "addInit", init: Initiative): void,
  (e: "close"): void,
}>();

type NewInitiative = Omit<Initiative, "hp">;

const isFormValid = ref(false);
const isEdit = ref(false);
const newInit = ref<NewInitiative>({} as NewInitiative);

onMounted(() => {
  if (props.monsterStats) {
    isEdit.value = true;
    initiativeDice = Dice.D20.ofStat(props.monsterStats.dexterity);
    healthDice = Dice.parse(props.monsterStats.hit_dice);
    newInit.value = {
      name: props.monsterStats.name,
      order: 10 + Dice.calculateModifier(props.monsterStats.dexterity),
      dex: props.monsterStats.dexterity,
      ac: props.monsterStats.armor_class,
      maxHp: props.monsterStats.hit_points,
      actions: [...buildActions(props.monsterStats.actions)]
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

let initiativeDice: Dice;
function rollInitiative() {
  newInit.value.order = initiativeDice.throw();
}

let healthDice: Dice;
function rollHealth() {
  newInit.value.maxHp = healthDice.throw();
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
      actions: newInit.value.actions,
      bonusAction: newInit.value.bonusAction
    };
    emit("addInit", init);
  }
}
</script>