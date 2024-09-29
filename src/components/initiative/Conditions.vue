<template>
  <v-sheet class="d-flex align-center" style="background: transparent;">
    <v-tooltip v-for="[name, image] in appliedConditions" :text="name">
      <template v-slot:activator="{ props }">
        <v-img v-bind="props" class="ma-2" width="32" height="32" inline :src="image" @click="removeCondition(name)" />
      </template>
    </v-tooltip>
    <v-menu location="end center" :close-on-content-click="false">
      <template v-slot:activator="{ props }">
        <v-icon icon="mdi-plus-box" v-bind="props" class="ma-2" color="primary" />
      </template>
      <v-card elevated>
        <div v-for="items in chunkedConditions">
          <v-tooltip v-for="[name, image] in items" :text="name">
            <template v-slot:activator="{ props }">
              <v-img v-bind="props" class="ma-2" width="32" height="32" inline :src="image"
                @click="toggleCondition(name)" />
            </template>
          </v-tooltip>
        </div>
      </v-card>
    </v-menu>
  </v-sheet>
</template>

<script setup lang="ts">
import { computed } from "vue";

import Conditions from "@/types/Conditions";
import { chunk } from "@/utils/Iterables";

import blindedImage from "@/assets/conditions/blinded.png";
import charmedImage from "@/assets/conditions/charmed.png";
import deafenedImage from "@/assets/conditions/deafened.png";
import exhaustedImage from "@/assets/conditions/exhausted.png";
import frightenedImage from "@/assets/conditions/frightened.png";
import grappledImage from "@/assets/conditions/grappled.png";
import incapacitatedImage from "@/assets/conditions/incapacitated.png";
import invisibleImage from "@/assets/conditions/invisible.png";
import paralyzedImage from "@/assets/conditions/paralyzed.png";
import petrifiedImage from "@/assets/conditions/petrified.png";
import poisonedImage from "@/assets/conditions/poisoned.png";
import proneImage from "@/assets/conditions/prone.png";
import restrainedImage from "@/assets/conditions/restrained.png";
import stunnedImage from "@/assets/conditions/stunned.png";
import unconsciousImage from "@/assets/conditions/unconscious.png";

const props = defineProps<Conditions>();
const emit = defineEmits<{
  (e: "applyCondition", name: keyof Conditions): void,
  (e: "removeCondition", name: keyof Conditions): void
}>();

const conditions: Map<keyof Conditions, string> = new Map<keyof Conditions, string>([
  ["blinded", blindedImage],
  ["charmed", charmedImage],
  ["deafened", deafenedImage],
  ["exhausted", exhaustedImage],
  ["frightened", frightenedImage],
  ["grappled", grappledImage],
  ["incapacitated", incapacitatedImage],
  ["invisible", invisibleImage],
  ["paralyzed", paralyzedImage],
  ["petrified", petrifiedImage],
  ["poisoned", poisonedImage],
  ["prone", proneImage],
  ["restrained", restrainedImage],
  ["stunned", stunnedImage],
  ["unconscious", unconsciousImage],
]);

const chunkedConditions = [...chunk(5, conditions.entries())];

const appliedConditions = computed(() => [
  ...Object.entries(props)
    .filter(([_, v]) => v)
    .map(([k, _]) => {
      const key: keyof Conditions = k as keyof Conditions;
      return [key, conditions.get(key)!] as [keyof Conditions, string];
    })
]);

function toggleCondition(name: keyof Conditions) {
  if (props[name]) {
    removeCondition(name);
  } else {
    applyCondition(name);
  }
}

function applyCondition(name: keyof Conditions) {
  emit("applyCondition", name);
}

function removeCondition(name: keyof Conditions) {
  emit("removeCondition", name);
}

</script>