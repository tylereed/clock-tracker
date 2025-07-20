<template>
  <v-switch v-model:model-value="isDark" true-icon="mdi-moon-waxing-crescent" false-icon="mdi-white-balance-sunny"
    inset />
</template>

<script setup lang="ts">
import { useTheme } from "vuetify";

import { useDark } from "@vueuse/core";

const vTheme = useTheme();

const isDark = useDark({
  onChanged: (isDark) => {
    const newTheme = isDark ? "dark" : "light";
    vTheme.change(newTheme);
  }
});
</script>