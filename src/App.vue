<template>
  <v-app>
    <v-main>
      <v-card>
        <v-card-title>Clocks</v-card-title>
        <v-container>
          <v-row>
            <v-col v-for="clock in clocks" :key="'Clock' + clock.id">
              <v-btn @click="removeClock(clock.id)"><v-icon start icon="mdi-delete-forever" color="red" /></v-btn>
              <clock-vue v-bind="clock" @update-slice="updateSlice" />
            </v-col>
          </v-row>
        </v-container>
      </v-card>
      <v-card>
        <v-btn @click="addClock()">Add Clock</v-btn>
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { Clock } from '@/types/Clock';
import ClockVue from "@/components/Clock.vue";
import { ref } from 'vue';

type Clocks = Clock[];
type ClockNoId = Omit<Clock, "id">;

const clocks = ref<Clocks>([]);
addClock({
  totalSlices: 8,
  filledSlices: 3,
  color: 'green',
  size: 200
});

function updateSlice(id: number, amount: number) {
  if (amount < 0) return;
  if (amount > clocks.value[id].totalSlices) return;
  clocks.value[id].filledSlices = amount;
}

function addClock(toAdd: ClockNoId | undefined = undefined) {
  let c: Clock;
  if (!toAdd) {
    const totalSlices = Math.ceil(Math.random() * 6) + 2;
    const filledSlices = Math.floor(Math.random() * (totalSlices + 1));
    c = {
      id: clocks.value.length,
      totalSlices,
      filledSlices,
      color: "purple",
      size: 200
    };
  } else {
    c = { ...toAdd, id: clocks.value.length };
  }
  clocks.value.push(c);
}

function removeClock(id: number) {
  clocks.value.splice(id, 1);
  for (let i = id; i < clocks.value.length; i++) {
    clocks.value[i].id = i;
  }
}

</script>