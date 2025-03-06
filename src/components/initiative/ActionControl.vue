<template>
  <v-col cols="12">
    <v-expansion-panels>
      <v-expansion-panel :title="label">
        <v-expansion-panel-text>
          <template v-for="action in actions">
            <v-text-field label="Name" v-model="action.name" />
            <v-textarea label="Description" v-model="action.desc" />
          </template>
          <v-btn @click="addAction()">Add {{ label }}</v-btn>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-col>
</template>

<script setup lang="ts">
import { Actions } from "@/types/Initiative";

const props = defineProps<{ label: string, actions?: Actions[] }>();

const emit = defineEmits<{
  (e: "addAction"): void,
}>();

function addAction() {
  emit("addAction");
}

</script>