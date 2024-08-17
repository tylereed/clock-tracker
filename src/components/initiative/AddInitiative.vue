<template>
  <v-form v-model="isFormValid" @submit.prevent="addInitiative">
    <v-card>
      <v-card-title>Add PC Initiative</v-card-title>
      <v-card-text>
        <v-text-field label="Initiative" density="compact" v-model="newInit.order" :rules="v.OrderRules" />
        <v-text-field label="Name" density="compact" v-model="newInit.name" :rules="v.NameRules" />
        <v-text-field label="Dex Score" density="compact" v-model="newInit.dex" :rules="v.DexRules" />
        <v-text-field label="AC" density="compact" v-model="newInit.ac" :rules="v.AcRules" />
        <v-text-field label="HP" density="compact" v-model="newInit.maxHp" :rules="v.MaxHpRules" />
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
import Initiative from "@/types/Initiative";
import v from "./InitiativeRules"

const emit = defineEmits<{
  (e: "addInit", init: Initiative): void,
  (e: "close"): void,
}>();

type NewInitiative = Omit<Initiative, "hp">;

const isFormValid = ref(false);
const newInit = ref<NewInitiative>({} as NewInitiative);

function addInitiative() {
  if (isFormValid.value) {
    const init = { ...newInit.value, hp: newInit.value.maxHp };
    emit("addInit", init);
  }
}
</script>