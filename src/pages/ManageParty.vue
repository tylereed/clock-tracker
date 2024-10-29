<template>
  <manage-group label="Party" group-name-prefix="party" @send-to-initiative="(inits) => emit('sendToInitiative', inits)" />
</template>

<script setup lang="ts">
import ManageGroup from '@/components/initiative/ManageGroup.vue';

import { Initiatives } from '@/types/Initiative';

const emit = defineEmits<{
  (e: "sendToInitiative", inits: Initiatives): void,
}>();
</script>