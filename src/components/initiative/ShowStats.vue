<template>
  <v-btn icon :href="buildWebUrl('monsters', id)" target="_blank">
    <v-icon icon="mdi-open-in-new" />
  </v-btn>
</template>

<script setup lang="ts">
import { buildWebUrl } from '@/utils/Open5e';

const props = defineProps<{ id: string }>();
</script>