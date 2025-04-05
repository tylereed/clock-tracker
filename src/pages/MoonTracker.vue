<template>
  <v-container>
    <canvas ref="canvasRef" class="ma-2" :width="size" :height="size" />
    <v-row>
      <v-col>
        <v-card>
          <v-card-text>
            <p>Solinari: {{ solinariDayDisplay }}</p>
            <p>Phase: {{ solinariPhase }}</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-text>
            <p>Lunitari: {{ lunitariDayDisplay }}</p>
            <p>Phase: {{ lunitariPhase }}</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-text>
            <p>Nuitari: {{ nuitariDayDisplay }}</p>
            <p>Phase: {{ nuitariPhase }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-card class="mt-5">
      <v-card-actions>
        <v-btn variant="elevated" color="primary" text="Add Day" @click="addDay()" />
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, onUpdated, Ref, ref, watch } from "vue";
import { useTheme } from "vuetify";

const vTheme = useTheme();

onMounted(render);
onUpdated(render);
watch(vTheme.current, render);

const canvasRef = ref<HTMLCanvasElement>();
const size = ref(500);

function getPhase(day: number, max: number) {
  const phaseNumber = Math.floor(day / (max / 4));
  if (phaseNumber === 0) return "New";
  if (phaseNumber === 1) return "Waxing";
  if (phaseNumber === 2) return "Full"
  return "Waning";
}

const solinariDay = ref(0);
const solinariDayDisplay = computed(() => solinariDay.value + 1);
const solinariPhase = computed(() => getPhase(solinariDay.value, solinariMax));

const lunitariDay = ref(0);
const lunitariDayDisplay = computed(() => lunitariDay.value + 1);
const lunitariPhase = computed(() => getPhase(lunitariDay.value, lunitariMax));

const nuitariDay = ref(0);
const nuitariDayDisplay = computed(() => nuitariDay.value + 1);
const nuitariPhase = computed(() => getPhase(nuitariDay.value, nuitariMax));

const solinariMax = 36;
const lunitariMax = 28;
const nuitariMax = 8;

function addDays(toAdd: number) {
  solinariDay.value = (solinariDay.value + toAdd) % solinariMax;
  lunitariDay.value = (lunitariDay.value + toAdd) % lunitariMax;
  nuitariDay.value = (nuitariDay.value + toAdd) % nuitariMax;
}

function addDay() {
  addDays(1);
}

const tau = Math.PI * 2;

function drawMoon(ctx: CanvasRenderingContext2D, fillColor: string, x: number, y: number, radius: number) {
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, tau);
  ctx.fill();
  ctx.stroke();
}

function drawSegments(ctx: CanvasRenderingContext2D, maxSlices: number, x: number, y: number,
  originAngle: number, innerRadius: number, outerRadius: number) {

  ctx.beginPath();
  for (let i = 0; i < maxSlices; i++) {
    const angleOffset = (tau * i / maxSlices)
    const sin = Math.sin(originAngle + angleOffset);
    const cos = Math.cos(originAngle + angleOffset);

    const x1 = innerRadius * sin;
    const y1 = innerRadius * cos;
    const x2 = outerRadius * sin;
    const y2 = outerRadius * cos;

    ctx.moveTo(x - x1, y - y1);
    ctx.lineTo(x - x2, y - y2);
  }
  ctx.stroke();
}

function drawMoons(ctx: CanvasRenderingContext2D, width: number, height: number, x: number, y: number,
  radiusSolinari: number, radiusLunitari: number, radiusNuitari: number) {

  ctx.clearRect(0, 0, width, height);

  ctx.strokeStyle = "#FFD700"; // golden yellow
  ctx.lineWidth = 2.5;

  drawMoon(ctx, "#FAF9F6", x, y, radiusSolinari); // off-white
  drawMoon(ctx, "red", x, y, radiusLunitari);
  drawMoon(ctx, "black", x, y, radiusNuitari);

  const originAngle = -Math.PI / 4;
  drawSegments(ctx, 36, x, y, originAngle, radiusLunitari, radiusSolinari);
  drawSegments(ctx, 28, x, y, originAngle, radiusNuitari, radiusLunitari);
  drawSegments(ctx, 8, x, y, originAngle, 0, radiusNuitari);
}

function render() {
  const canvas = canvasRef.value;
  const width = size.value;
  const height = size.value;

  // This sets the area of the visible circles exactly the same
  // Derived from πr² and algebra.  Proof is left as an exercise to the reader
  const radiusSolinari = size.value / 2 - 5;
  const radiusLunitari = Math.sqrt(2 / 3 * Math.pow(radiusSolinari, 2));
  const radiusNuitari = Math.sqrt(Math.pow(radiusLunitari, 2) / 2);

  if (radiusNuitari < 1) return;
  const x = width / 2;
  const y = height / 2;
  const ctx = canvas?.getContext("2d");
  if (!ctx) return;

  ctx.save();
  drawMoons(ctx, width, height, x, y, radiusSolinari, radiusLunitari, radiusNuitari);
  ctx.restore();
}
</script>