<template>
  <v-row v-if="monsterStats">
    <v-col cols="9">
      <v-select v-model="selectedTemplate" density="compact" label="Template" :items="templates" />
    </v-col>
    <v-col cols="3">
      <v-btn @click="applyTemplate()">Apply Template</v-btn>
    </v-col>
  </v-row>
  <v-row v-show="selectedTemplate === 'Zombie'">
    <v-col>
      <v-checkbox label="Undead Fortitude" density="compact" v-model="undeadFortitude"
        v-tooltip:top="'If the zombie is reduced to 0 hit points by damage that isnt radiant or from a critical hit, its instead reduced to 1 hit point, falls prone, and is stunned until the end of its next turn, appearing to be dead.'" />
    </v-col>
    <v-col>
      <v-checkbox label="Infectious Bite" density="compact" v-model="infectiousBite"
        v-tooltip:top="'A creature bitten by the zombie takes 2 (1d4) ongoing necrotic damage until it regains hit points or a creature makes a DC 15 Medicine check to treat the wound. If a beast, dragon, giant, humanoid, or monstrosity dies while suffering from this effect, it becomes a zombie after 1 minute, gaining the zombie template.'" />
    </v-col>
    <v-col>
      <v-checkbox label="Vile Discharge" density="compact" v-model="vileDischarge"
        v-tooltip:top="'The zombie\'s melee attacks deal an extra 2 (1d4) poison damage. Additionally, when it\'s reduced to 0 hit points, it explodes. Creatures within 5 feet make a Dexterity saving throw against the zombie\'s maneuver DC, taking 5 (2d4) poison damage on a failure.'" />
    </v-col>
    <v-col>
      <v-checkbox label="Vigor Mortis" density="compact" v-model="vigorMortis"
        v-tooltip:top="'The zombie can take the Dash action as a bonus action. It can\'t do so again until it moves 0 feet on one of its turns.'" />
    </v-col>
  </v-row>
  <v-row v-show="selectedTemplate === 'Merfolk'">
    <v-col>
      <v-checkbox label="Include Trident" density="compact" v-model="includeTrident"
        v-tooltip:top="'Add a trident to the creature\'s equipment if it doesn\'t already have one.'" />
    </v-col>
  </v-row>
  <v-row v-show="selectedTemplate === 'Half-Dragon'">
    <v-col>
      <v-select v-model="selectedDragonType" density="compact" label="Dragon Type" :items="halfDragonTypes" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from "vue";

import { TemplateType, DragonType, dragonTypes, TemplateOptions, templates as templateNames } from "./types";
import * as t from "./index";
import { MonsterO5e } from "@/utils/Open5e";

const props = defineProps<{ monsterStats?: MonsterO5e | null }>();
const { monsterStats } = toRefs(props);

const emit = defineEmits<{
  (e: "updateMonster", init: MonsterO5e): void
}>();

const undeadFortitude = ref(true);
const infectiousBite = ref(false);
const vileDischarge = ref(false);
const vigorMortis = ref(false);

const includeTrident = ref(true);

const halfDragonTypes = ref(dragonTypes);
const selectedDragonType = ref<DragonType>("Amethyst");

function getOptions(type: TemplateType): TemplateOptions | undefined {
  switch (type) {
    case "Zombie":
      return {
        undeadFortitude: undeadFortitude.value,
        infectiousBite: infectiousBite.value,
        vileDischarge: vileDischarge.value,
        vigorMortis: vigorMortis.value
      };
    case "Merfolk":
      return {
        includeTrident: includeTrident.value
      }
    case "Half-Dragon":
      return {
        type: selectedDragonType.value
      }
  }
}

const templates = ref(templateNames);
const selectedTemplate = ref<TemplateType>("Squad");
async function applyTemplate() {
  if (selectedTemplate.value && monsterStats.value) {
    const options = getOptions(selectedTemplate.value);
    const template = await t.applyTemplate(selectedTemplate.value, monsterStats.value, options);
    if (template) {
      emit("updateMonster", template);
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
  if (value === "Merfolk") {
    includeTrident.value = true;
  }
  if (value === "Half-Dragon") {
    selectedDragonType.value = "Amethyst";
  }
});
</script>