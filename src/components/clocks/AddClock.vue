<template>
  <v-form v-model="isFormValid" @submit.prevent="addClock">
    <v-btn :disabled="!isFormValid" type="submit">Add Clock</v-btn>
    <v-text-field label="Name" v-model="newClock.name" />
    <v-text-field label="Total Slices" :rules="[isRequiredRule, isNumericRule]" v-model="newClock.totalSlices" />
    <v-text-field label="Color" v-model="newClock.color" />
  </v-form>
</template>

<script setup lang="ts">
import { NewClock } from '@/types/Clock';
import { ref } from 'vue';

const isFormValid = ref<boolean>(false);
const emit = defineEmits<{
  (e: 'newClock', clock: NewClock): void
}>();

const newClock = ref<NewClock>({
  filledSlices: 0,
  color: "",
  totalSlices: 8
});

function isRequiredRule(value: any) {
  return !!value || 'Required.';
}

const isNumericRegex = /^\d+$/;
function isNumericRule(value: any) {
  return isNumericRegex.test(value) || "Must be a number.";
}

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function formatHex(n: number) {
  return n.toString(16).padStart(2, "0");
}

function getRandomBounds() {
  const smallRange = { min: 0, max: 64 };
  const bigRange = { min: 127, max: 256 };
  const defaultRGB = {
    red: { ...smallRange },
    green: { ...smallRange },
    blue: { ...smallRange }
  };

  const type = randomNumber(0, 6);
  switch (type) {
    default:
    case 0:
      return { ...defaultRGB, red: { ...bigRange } };
    case 1:
      return { ...defaultRGB, green: { ...bigRange } };
    case 2:
      return { ...defaultRGB, blue: { ...bigRange } };
    case 3:
      return { ...defaultRGB, red: { ...bigRange }, green: { ...bigRange } };
    case 4:
      return { ...defaultRGB, green: { ...bigRange }, blue: { ...bigRange } };
    case 5:
      return { ...defaultRGB, red: { ...bigRange }, blue: { ...bigRange } };
  }
}

function randomishColor() {
  const range = getRandomBounds();
  const r = randomNumber(range.red.min, range.red.max);
  const g = randomNumber(range.green.min, range.green.max);
  const b = randomNumber(range.blue.min, range.blue.max);

  return `#${formatHex(r)}${formatHex(g)}${formatHex(b)}`;
}

function addClock() {
  if (isFormValid.value) {
    const c = { ...newClock.value };
    c.color ||= randomishColor();
    emit("newClock", c);
  }
}

</script>