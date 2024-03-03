<template>
  <v-hover @update:model-value="updateHover">
    <template v-slot:default="{ isHovering, props }">
      <v-card v-bind="props" class="d-flex justify-center" @click="increment()" @click.right="decrement()"
        @contextmenu.prevent>
        <v-btn @click.stop="emit('deleteClock', clock.id)" v-show="isHovering" class="topright text-center">
          <v-icon icon="mdi-delete-forever" color="red" />
        </v-btn>
        <v-sheet :width="size + 15" :height="size + 65">
          <v-card-title>{{ name || "&nbsp;" }}</v-card-title>
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
let isHover = false;

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

function updateHover(value: boolean) {
  isHover = value;
  render();
}

function render() {
  if (!canvasRef.value) return;

  const canvas = canvasRef.value;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const radius = Math.min(width, height) / 2 - 2;
  const x = width / 2;
  const y = height / 2;
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, clock.size, clock.size);

  const originAngle = -tau / 4;

  let previousAngle = originAngle;

  for (let i = 0; i < clock.totalSlices; i++) {
    ctx.save();

    const startAngle = previousAngle;
    previousAngle = (i + 1) * tau / clock.totalSlices + originAngle;

    let fillStyle: string | CanvasPattern;
    if (i < clock.filledSlices) {
      fillStyle = clock.color;
    } else if (i === clock.filledSlices && isHover) {
      const offscreen = new OffscreenCanvas(10, 10);
      const offCtx = offscreen.getContext("2d")!;
      offCtx.fillStyle = clock.color;
      offCtx.fillRect(0, 0, 5, 5);
      offCtx.fillRect(5, 5, 10, 10);

      fillStyle = ctx.createPattern(offscreen, "repeat")!;
      ctx.globalAlpha = .4;
    } else {
      fillStyle = "white";
    }

    ctx.beginPath();
    ctx.fillStyle = fillStyle;
    ctx.moveTo(x, y);
    ctx.arc(x, y, radius, startAngle, previousAngle);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.stroke();

    ctx.restore();
  }
}
</script>