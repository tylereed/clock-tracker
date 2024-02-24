<template>
  <v-form v-model="isFormValid" @submit.prevent="addClock">
    <v-btn :disabled="!isFormValid" type="submit">Add Clock</v-btn>
    <v-text-field label="Name" v-model="newClock.name" />
    <v-text-field label="Total Slices" :rules="[isRequiredRule, isNumericRule, inRangeRule(1, 12)]"
      v-model="newClock.totalSlices" />
    <v-text-field label="Color" :rules="[isColor]" v-model="newClock.color" />
  </v-form>
</template>

<script setup lang="ts">
import { NewClock } from '@/types/Clock';
import { ref } from 'vue';

const hexRegex = /^[0-9a-f]+$/i;

const emit = defineEmits<{
  (e: 'newClock', clock: NewClock): void
}>();

const isFormValid = ref<boolean>(false);
const newClock = ref<NewClock>({
  filledSlices: 0,
  color: "",
  totalSlices: 8
});

function isRequiredRule(value: any) {
  return !!value || 'Required';
}

const isNumericRegex = /^\d+$/;
function isNumericRule(value: any) {
  return isNumericRegex.test(value) || "Must be a number";
}

function inRangeRule(min: number, max: number): (value: number | string) => boolean | string {
  return (value: number | string) => (+value >= min && +value <= max) || `Must be between ${min} and ${max}`
}

const ele = document.createElement("div");
function isColor(value: string) {
  if (!value) {
    return true;
  }
  if (value.match(hexRegex)) {
    value = "#" + value;
  }

  ele.style.color = value;
  const result = !!ele.style.color.split(/\s+/).join('').toLowerCase() || "Not a valid color";
  ele.style.color = "";
  return result;
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
    if (c.color.match(hexRegex)) {
      c.color = "#" + c.color;
    }
    c.color ||= randomishColor();
    emit("newClock", c);
  }
}

</script>