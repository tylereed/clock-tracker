<template>
  <v-form v-model="isFormValid" @submit.prevent="addEditClock">
    <v-card>
      <v-card-title>{{ isEdit ? "Edit" : "Add New" }} Clock</v-card-title>
      <v-card-text>
        <v-text-field label="Name" v-model="newClock.name" />
        <v-text-field label="Total Slices" :rules="[v.isRequiredRule, v.isNumericRule, v.inRangeRule(3, 12)]"
          v-model="newClock.totalSlices" />
        <v-text-field label="Color" :rules="[v.isColor]" v-model="newClock.color" />
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
import { createClock } from "./helpers";
import { Clock, NewClock } from '@/types/Clock';
import * as v from "@/utils/validators";
import { ref, onMounted } from 'vue';

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