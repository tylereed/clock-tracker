<template>
  <v-form v-model="isFormValid" @submit.prevent="addEditClock">
    <v-card>
      <v-card-title>{{ isEdit ? "Edit" : "Add New" }} Clock</v-card-title>
      <v-card-text>
        <v-text-field label="Name" v-model="newClock.name" />
        <v-text-field label="Total Slices" :rules="[isRequiredRule, isNumericRule, inRangeRule(3, 12)]"
          v-model="newClock.totalSlices" />
        <v-text-field label="Color" :rules="[isColor]" v-model="newClock.color" />
      </v-card-text>
      <v-card-actions>
        <v-btn variant="elevated" color="primary" :disabled="!isFormValid" type="submit">{{ isEdit ? "Edit" : "Add" }}
          Clock</v-btn>
        <v-btn @click="emit('close')" variant="outlined">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { Clock, NewClock } from '@/types/Clock';
import { createClock, randomishColor } from "./helpers";
import { ref, onMounted } from 'vue';

const hexRegex = /^[0-9a-f]+$/i;

const emit = defineEmits<{
  (e: 'newClock', clock: NewClock): void,
  (e: 'updateClock', clock: Clock): void,
  (e: 'close'): void
}>();

const isEdit = ref(false);
const isFormValid = ref(false);
const newClock = ref<NewClock>({
  filledSlices: 0,
  color: "",
  totalSlices: 8
});

const props = defineProps<{ clockValues: NewClock | null }>();

onMounted(() => {
  if (props.clockValues) {
    isEdit.value = true;
    newClock.value = { ...props.clockValues };
  } else {
    isEdit.value = false;
  }
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

function addEditClock() {
  if (isFormValid.value) {
    const c = createClock(newClock.value);

    if (isEdit.value) {
      if (c.filledSlices > c.totalSlices) {
        c.filledSlices = c.totalSlices;
      }
      emit("updateClock", c as Clock);
    } else {
      emit("newClock", c);
    }
  }
}

</script>