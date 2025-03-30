<template>
  <manage-group label="Monsters" :group-name-prefix="MonsterNamePrefix" :show-monster="true" @send-to-initiative="(inits) => emit('sendToInitiative', inits)" />
</template>

<script setup lang="ts">
import ManageGroup from "@/components/initiative/ManageGroup.vue";

import { MonsterNamePrefix } from "@/components/initiative/encounterHelpers";

import { Initiatives } from "@/types/Initiative";

const emit = defineEmits<{
  (e: "sendToInitiative", inits: Initiatives): void,
}>();
</script>