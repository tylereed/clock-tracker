<template>
  <v-card>
      <v-card ma-5 @click="increment()" @click.right="decrement()" @contextmenu.prevent>
        <v-card-title v-if="name">{{ name }}</v-card-title>
        <canvas ref="canvasRef" class="ma-2" :width="size" :height="size" />
      </v-card>
  </v-card>
</template>

<script setup lang="ts">
import { Clock } from '@/types/Clock';
import { onMounted, onUpdated, ref } from 'vue';

const tau = Math.PI * 2;

const clock = defineProps<Clock>();
const emit = defineEmits(["updateSlice"]);

onMounted(render);
onUpdated(render);

const canvasRef = ref<HTMLCanvasElement>();

function increment() {
  emit("updateSlice", clock.id, clock.filledSlices + 1);
}

function decrement() {
  emit("updateSlice", clock.id, clock.filledSlices - 1);
}

function render() {
  if (!canvasRef.value) return;

  const canvas = canvasRef.value;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const radius = Math.min(width, height) / 2 - 2;
  const x = width / 2;
  const y = height / 2;
  const ctx = canvas.getContext("2d");

  if (!ctx) return;
  const originAngle = -tau / 4;

  let previousAngle = originAngle;

  for (let i = 0; i < clock.totalSlices; i++) {
    const startAngle = previousAngle;
    previousAngle = (i + 1) * tau / clock.totalSlices + originAngle;

    ctx.beginPath();
    ctx.fillStyle = i < clock.filledSlices ? clock.color : "white";
    ctx.moveTo(x, y);
    ctx.arc(x, y, radius, startAngle, previousAngle);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
}
</script>