<template>
  <v-app>
    <v-main>
      <v-card ma-5 @click="increment()" @click.right="decrement()" @contextmenu.prevent>
        <v-card-title v-if="clock.name">{{ clock.name }}</v-card-title>
        <canvas ref="canvasRef" class="ma-2" :width="clock.size" :height="clock.size" />
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted, onUpdated } from "vue";
import { Clock } from './types/Clock';


const tau = Math.PI * 2;

const clock: Clock = {
  id: 1,
  totalSlices: 8,
  filledSlices: 3,
  color: 'green',
  size: 200
};

const canvasRef = ref<HTMLCanvasElement>();

onMounted(render);
onUpdated(render);

function updateSlice(amount: number) {
  if (amount < 0) return;
  if (amount > clock.totalSlices) return;
  clock.filledSlices = amount;
  render();
}

function increment() {
  updateSlice(clock.filledSlices+1);
}

function decrement() {
  updateSlice(clock.filledSlices-1);
  return false;
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