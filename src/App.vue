<template>
  <v-app>
    <v-main>
      <v-card>
        <clock-vue v-bind="clock" @update-slice="updateSlice" />
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { Clock } from '@/types/Clock';
import ClockVue from "@/components/Clock.vue";
import { ref } from 'vue';

const clock = ref<Clock>({
  id: 1,
  totalSlices: 8,
  filledSlices: 3,
  color: 'green',
  size: 200
});

function updateSlice(id: number, amount: number) {
  if (amount < 0) return;
  if (amount > clock.value.totalSlices) return;
  clock.value.filledSlices = amount;
}

</script>