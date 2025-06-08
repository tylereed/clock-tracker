<template>
  <v-card flat>
    <v-menu transition="scroll-y-transition" :target="mainButton">
      <template v-slot:activator="{ isActive, props }">
        <v-btn :loading="loading" class="mr-0 rounded-s rounded-e-0" @click="runButton(mainAction)" variant="elevated"
          color="primary" ref="mainButton">
          {{ mainAction.label }}
        </v-btn>
        <v-btn :disabled="loading" class="ma-0 rounded-e rounded-s-0" style="min-width: 0;" variant="elevated"
          color="primary" v-bind="props">
          <v-icon :icon="isActive ? 'mdi-menu-down' : 'mdi-menu-up'" />
        </v-btn>
      </template>
      <template v-for="(button, i) in dropdownActions" :key="'button' + i">
        <v-btn :disabled="loading" :class="getClass(i)" @click="runButton(button)" variant="elevated" color="primary">
          {{ button.label }}
        </v-btn>
      </template>
    </v-menu>
  </v-card>
</template>

<script setup lang="ts">
import { ComponentPublicInstance, computed, ref } from "vue";

const loading = ref(false);

const mainButton = ref<ComponentPublicInstance>(null!);

type ButtonAction = {
  label: string,
  action: () => void | Promise<void>,
};

const props = defineProps<{
  actions: ButtonAction[]
}>();

const mainAction = computed(() => props.actions[0]);
const dropdownActions = computed(() => props.actions.slice(1));

function getClass(index: number) {
  if (dropdownActions.value.length === 1) {
    return ["ma-0"];
  } else if (index === 0) {
    return ["ma-0", "rounded-0", "rounded-t"];
  } else if (index === dropdownActions.value.length - 1) {
    return ["ma-0", "rounded-0", "rounded-b"];
  } else {
    return ["ma-0", "rounded-0"];
  }
}

async function runButton(button: ButtonAction): Promise<void> {
  loading.value = true;
  try {
    await Promise.resolve(button.action());
  } finally {
    loading.value = false;
  }
}

</script>