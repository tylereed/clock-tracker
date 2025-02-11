<template>
  <v-form v-model="isFormValid" @submit.prevent="addNewCountdown">
    <v-card>
      <v-card-title>Add New Countdown</v-card-title>
      <v-card-text>
        <v-text-field label="Hours" v-model="txtHours" validate-on="input"
          :rules="[v.isRequiredRule, v.isWholeNumber, v.inRangeRule(0, 23)]" />
        <v-text-field label="Minutes" v-model="txtMinutes" validate-on="input"
          :rules="[v.isRequiredRule, v.isWholeNumber, v.inRangeRule(0, 59), countdownHasValue]" />
      </v-card-text>
      <v-card-actions>
        <v-btn variant="elevated" color="primary" :disabled="!isFormValid" type="submit">Add Countdown</v-btn>
        <v-btn @click="emit('close')" variant="outlined">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

import * as v from "@/utils/validators";

const isFormValid = ref(false);

const txtHours = ref("");
const txtMinutes = ref("");

const hours = computed(() => +txtHours.value);
const minutes = computed(() => +txtMinutes.value);

const emit = defineEmits<{
  (e: "newCountdown", max: number): void,
  (e: "close"): void
}>();

function addNewCountdown() {
  if (isFormValid.value) {
    const max = ((60 * hours.value) + minutes.value) * 60;
    emit("newCountdown", max);
  }
}

function countdownHasValue() {
  return (hours.value + minutes.value > 0) || "Time must have a value";
}

</script>