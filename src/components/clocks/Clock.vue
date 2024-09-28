<template>
  <v-hover @update:model-value="updateHover">
    <template v-slot:default="{ isHovering, props }">
      <v-card v-bind="props" elevation="5" class="d-flex justify-center" @click="increment()" @click.right="decrement()"
        @contextmenu.prevent>
        <v-sheet v-show="isHovering" class="topright text-center">
          <v-btn @click.stop="emit('editClock', clock.id)">
            <v-icon icon="mdi-pencil" />
          </v-btn>
          <v-btn @click.stop="emit('deleteClock', clock.id)">
            <v-icon icon="mdi-delete-forever" color="error" />
          </v-btn>
        </v-sheet>
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
import { onMounted, onUpdated, ref, watch } from "vue";
import { useTheme } from "vuetify";

import { Clock } from "@/types/Clock";

const tau = Math.PI * 2;

const clock = defineProps<Clock>();
const vTheme = useTheme();
let isHover = false;

const emit = defineEmits<{
  (e: "updateSlice", id: number, filledSlices: number): void,
  (e: "editClock", id: number): void
  (e: "deleteClock", id: number): void
}>();

onMounted(render);
onUpdated(render);
watch(vTheme.current, render);

const canvasRef = ref<HTMLCanvasElement>(null!);

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
  const canvas = canvasRef.value;
  const width = clock.size;
  const height = clock.size;
  const radius = clock.size / 2 - 5;
  if (radius < 1) return;
  const x = width / 2;
  const y = height / 2;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, clock.size, clock.size);

  const originAngle = -tau / 4;

  let previousAngle = originAngle;

  const colors = vTheme.current.value.colors;
  const { foregroundColor, backgroundColor } = {
    foregroundColor: vTheme.current.value.dark ? "white" : "black",
    backgroundColor: colors["surface-lighten-1"] ?? colors.surface
  };

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
      fillStyle = backgroundColor;
    }

    ctx.beginPath();
    ctx.strokeStyle = foregroundColor;
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