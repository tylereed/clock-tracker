<template>
  <v-btn icon :href="url" target="_blank">
    <v-icon icon="mdi-open-in-new" />
  </v-btn>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { buildWebUrl } from "@/utils/Open5e";

const props = defineProps<{ id?: string }>();
const url = computed(() => props.id ? buildWebUrl("monsters", props.id) : "/");
</script>