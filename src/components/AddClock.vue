<template>
  <v-form @submit.prevent="addClock()">
    <v-btn type="submit">Add Clock</v-btn>
    <v-text-field label="Name" v-model="newClock.name" />
    <v-text-field label="Total Slices" :rules="[isRequiredRule, isNumericRule]" v-model="newClock.totalSlices" />
    <v-text-field label="Color" :rules="[isRequiredRule]" v-model="newClock.color" />
  </v-form>
</template>

<script setup lang="ts">
import { ClockNoId } from '@/types/Clock';
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'newClock', clock: ClockNoId | undefined): void
}>();

//type DefaultClock = Omit<ClockNoId, "totalSlices"> & { totalSlices?: number };

const newClock = ref<ClockNoId>({
  filledSlices: 0,
  color: "green",
  size: 200,
  totalSlices: 8
});

function isRequiredRule(value: any) {
  return !!value || 'Required.';
}

const isNumericRegex = /^\d+$/;
function isNumericRule(value: any) {
  return isNumericRegex.test(value) || "Must be a number.";
}

function addClock() {

  const c = { ...newClock.value };
  emit("newClock", c);
}

</script>