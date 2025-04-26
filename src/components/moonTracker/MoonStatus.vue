<template>
  <v-card>
    <v-card-text>
      <p>
        <v-row align="center">
          <v-col cols="auto" class="pr-0">{{ name }}:</v-col>
          <v-col class="pl-1">
            <v-number-input v-model="userDay" control-variant="hidden" @update:focused="setText" density="compact"
              hide-details />
          </v-col>
        </v-row>
      </p>
      <p>Phase: {{ phase }}</p>
      <p>Bonus: {{ bonus > 0 ? "+" : "" }}{{ bonus }}</p>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import { MoonStateProps } from "./moon";

const localDay = defineModel<number>({ required: true });
const userDay = ref(localDay.value + 1);

watch(userDay, value => localDay.value = value - 1);
watch(localDay, value => userDay.value = value + 1);

const props = defineProps<MoonStateProps>();

async function setText(focused: boolean) {
  if (!focused) {
    await nextTick();
    userDay.value = props.dayDisplay;
  }
}

</script>