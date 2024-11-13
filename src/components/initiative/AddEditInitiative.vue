<template>
  <v-form v-model="isFormValid" @submit.prevent="addInitiative">
    <v-card>
      <v-card-title>Add {{ isEdit ? "Monster" : "PC" }} Initiative</v-card-title>
      <v-card-text>
        <v-container>
          <v-row v-if="isEdit">
            <v-col>
              <v-select v-model="selectedTemplate" label="Template" :items="['Squad']" />
              <v-btn @click="applyTemplate">Apply Template</v-btn>
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
import { onMounted, reactive, ref, toRefs } from "vue";
import pluralize from "pluralize";
//var pluralize = require("pluralize");

import TsExpandoButton from "@/components/common/TsExpandoButton.vue";

import Dice from "@/utils/Dice";
import Initiative, { Actions } from "@/types/Initiative";
import { MonsterO5e, Size } from "@/utils/Open5e";
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
  { label: "Min", action: () => newInit.value.maxHp = healthDice.value?.Min },
  { label: "Max", action: () => newInit.value.maxHp = healthDice.value?.Max },
  { label: "Average", action: () => newInit.value.maxHp = monsterStats.value?.hit_points }
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

const selectedTemplate = ref("Squad");
function applyTemplate() {
  if (monsterStats.value && selectedTemplate.value === "Squad") {
    applySquadTemplate(monsterStats.value);
  }
}

function applySquadTemplate(stats: MonsterO5e) {
  const template = { ...stats };

  template.size = increaseSize(stats.size, 2);
  template.type = "group of " + stats.type;
  template.challenge_rating = Math.floor((stats.cr ?? 0) * 2 + 2).toString();

  template.hit_points = stats.hit_points * 5;
  if (stats.hit_dice) {
    const hit_dice = Dice.parse(stats.hit_dice);
    if (hit_dice) {
      const squad_hit_dice = new Dice(5 * hit_dice.Count, hit_dice.Sides, hit_dice.Modifier);
      template.hit_dice = squad_hit_dice.toString();
    }
  }

  if (!template.special_abilities) {
    template.special_abilities = [];
  }

  const creaturePlural: string = pluralize(stats.name);

  template.special_abilities.push(
    {
      name: "Area Vulnerability",
      desc: "The squad takes double damage from any effect that targets an area."
    },
    {
      name: "Squad Dispersal",
      desc: `When the squad is reduced to 0 hit points, it turns into 2 (1d4) ${creaturePlural}, each of which are bloodied.`
    },
    {
      name: "Squad",
      desc: `The squad is composed of 5 or more ${creaturePlural}. If it is subjected to a spell, attack, or other effect that affects only one target, it takes any damage but ignores other effects. It can share its space with ${stats.size} or smaller creatures or objects. The squad can move through any opening large enough for one ${stats.name} without squeezing.`
    }
  );
}

const sizes: Size[] = ["Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan", "Titanic"];
function increaseSize(size: Size, steps: number): Size {
  let newSizeIndex = sizes.indexOf(size) + steps;
  if (newSizeIndex >= sizes.length) {
    newSizeIndex = sizes.length - 1;
  }
  return sizes[newSizeIndex];
}

function crToPb(cr: number) {
  if (cr < 5) {
    return 2;
  }
  if (cr < 9) {
    return 3;
  }
  if (cr < 13) {
    return 4;
  }
  if (cr < 17) {
    return 5;
  }
  if (cr < 21) {
    return 6;
  }
  if (cr < 25) {
    return 7;
  }
  if (cr < 29) {
    return 8;
  }
  return 9;
}

</script>