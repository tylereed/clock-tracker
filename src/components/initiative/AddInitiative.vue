<template>
  <v-form ref="addForm" v-model="isFormValid" @submit.prevent="addInitiative">
    <v-card>
      <v-card-title>Add PC Initiative</v-card-title>
      <v-card-text>
        <v-text-field label="Initiative" density="compact" v-model="newInit.order" :rules="[v.isNumericRule]" />
        <v-text-field label="Name" density="compact" v-model="newInit.name" :rules="[v.isRequiredRule]" />
        <v-text-field label="AC" density="compact" v-model="newInit.ac" :rules="[v.isNumericRule]" />
        <v-text-field label="HP" density="compact" v-model="newInit.maxHp" :rules="[v.isNumericRule]" />
      </v-card-text>
      <v-card-actions>
        <v-btn variant="elevated" color="primary" :disabled="!isFormValid" type="submit">Add</v-btn>
        <v-btn type="clear" @click="emit('close')" variant="outlined">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { VForm } from "vuetify/lib/components/index.mjs";
import Initiative from "@/types/Initiative";
import * as v from "@/utils/validators";

const emit = defineEmits<{
  (e: "addInit", init: Initiative): void,
  (e: "close"): void,
}>();

type NewInitiative = Omit<Initiative, 'hp'>;

const addForm = ref<VForm>(null!);
const isFormValid = ref(false);
const newInit = ref<NewInitiative>({} as NewInitiative);


function addInitiative() {
  if (isFormValid.value) {
    const init = { ...newInit.value, hp: newInit.value.maxHp };
    emit("addInit", init);
  }
}
</script>