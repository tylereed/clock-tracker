<template>
  <v-hover>
    <template v-slot:default="{ isHovering, props }">
      <v-card v-bind="props" class="d-flex justify-center" @click="increment()" @click.right="decrement()"
        @contextmenu.prevent>
        <v-btn @click.stop="emit('deleteClock', clock.id)" v-show="isHovering" class="topright text-center">
          <v-icon icon="mdi-delete-forever" color="red" />
        </v-btn>
        <v-sheet :width="size + 15" :height="size + 15 + (name ? 50 : 0)">
          <v-card-title v-if="name">{{ name }}</v-card-title>
          <canvas ref="canvasRef" class="ma-2" :width="size" :height="size" />
        </v-sheet>
      </v-card>
    </template>
  </v-hover>
</template>

<style scoped>
.topright {
  position: absolute;
  top: 8px;
  right: 16px;
}
</style>

<script setup lang="ts">
import { Clock } from '@/types/Clock';
import { onMounted, onUpdated, ref } from 'vue';

const tau = Math.PI * 2;

const clock = defineProps<Clock>();

const emit = defineEmits<{
  (e: "updateSlice", id: number,  filledSlices: number): void,
  (e: "deleteClock", id:  number): void
}>();

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