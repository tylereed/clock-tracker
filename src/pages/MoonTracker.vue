<template>
  <v-container v-resize="resizeCanvas">
    <v-row class="d-flex justify-center">
      <v-col cols="auto">
        <canvas ref="canvasRef" class="ma-2" :width="size" :height="size" />
      </v-col>
      <v-col cols="auto">
        <v-row>
          <v-col>
            <moon-status v-bind="solinari" v-model="solinari.day" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <moon-status v-bind="lunitari" v-model="lunitari.day" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <moon-status v-bind="nuitari" v-model="nuitari.day" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card>
              <v-card-actions>
                <v-btn variant="elevated" color="primary" text="Add Day" @click="addDay()" />
                <v-btn variant="elevated" color="primary" text="Subtract Day" @click="subtractDay()" />
                <v-btn variant="outlined" color="error" text="Randomize" @click="randomizeDays()" />
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUpdated, Ref, ref, watch } from "vue";
import { useTheme } from "vuetify";

import { MoonState, MoonStateProps } from "@/components/moonTracker/moon";
import { useMoonBonus, useMoonStatus } from "@/components/moonTracker/moonHelpers";
import MoonStatus from "@/components/moonTracker/MoonStatus.vue";

const vTheme = useTheme();

onMounted(render);
onUpdated(render);
watch(vTheme.current, render);

const maxMoonSize = 500;

const canvasRef = ref<HTMLCanvasElement>();
const size = ref(maxMoonSize);


async function resizeCanvas() {
  const padding = 150;
  size.value = Math.max(200, Math.min(window.innerWidth / 2 - padding, maxMoonSize));
}
watch(size, async () => {
  await nextTick();
  render();
});

const solinariMax = 36;
const lunitariMax = 28;
const nuitariMax = 8;

// Need all moon phases to calculate bonus
// Build most of the state, then build bonus, then build full MoonState
const solinariPart: Omit<MoonState, "bonus"> = useMoonStatus("Solinari", solinariMax);
const lunitariPart: Omit<MoonState, "bonus"> = useMoonStatus("Lunitari", lunitariMax);
const nuitariPart: Omit<MoonState, "bonus"> = useMoonStatus("Nuitari", nuitariMax);
const [solinariBonus, lunitariBonus, nuitariBonus] = useMoonBonus(solinariPart, lunitariPart, nuitariPart);

const solinari: Ref<MoonStateProps> = ref({ ...solinariPart, bonus: solinariBonus });
const lunitari: Ref<MoonStateProps> = ref({ ...lunitariPart, bonus: lunitariBonus });
const nuitari: Ref<MoonStateProps> = ref({ ...nuitariPart, bonus: nuitariBonus });

function positiveModulo(dividend: number, divisor: number) {
  return ((dividend % divisor) + divisor) % divisor;
}

watch([solinariPart.day, lunitariPart.day, nuitariPart.day], ([newSol, newLun, newNui]) => {
  solinari.value.day = positiveModulo(newSol, solinariMax);
  lunitari.value.day = positiveModulo(newLun, lunitariMax);
  nuitari.value.day = positiveModulo(newNui, nuitariMax);
  render();
});

function addDays(toAdd: number) {
  solinari.value.day += toAdd;
  lunitari.value.day += toAdd;
  nuitari.value.day += toAdd;
}

function addDay() {
  addDays(1);
}

function subtractDay() {
  addDays(-1);
}

function randomizeDays() {
  solinari.value.day = Math.floor(solinariMax * Math.random());
  lunitari.value.day = Math.floor(lunitariMax * Math.random());
  nuitari.value.day = Math.floor(nuitariMax * Math.random());
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
    const angleOffset = (tau * i / maxSlices);
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
  drawSegments(ctx, solinariMax, x, y, originAngle, radiusLunitari, radiusSolinari);
  drawSegments(ctx, lunitariMax, x, y, originAngle, radiusNuitari, radiusLunitari);
  drawSegments(ctx, nuitariMax, x, y, originAngle, 0, radiusNuitari);
}

function drawMoonPhase(ctx: CanvasRenderingContext2D, x: number, y: number,
  text: string, max: number, day: number, radius: number) {

  const originAngle = -Math.PI / 4 + tau / max / 2;
  const dayAngle = tau * day / max;
  const xOffset = radius * Math.sin(originAngle + dayAngle);
  const yOffset = radius * Math.cos(originAngle + dayAngle);

  ctx.fillText(text, x + xOffset, y + yOffset);
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

  const textRadiusSolinari = (radiusSolinari + radiusLunitari) / 2;
  const textRadiusLunitari = (radiusLunitari + radiusNuitari) / 2;
  const textRadiusNuitari = 3 * radiusNuitari / 4;

  ctx.save();

  const fontPercent = width / maxMoonSize;
  const fontSize = Math.floor(fontPercent * 30);

  ctx.font = fontSize + "pt Verdana";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  drawMoonPhase(ctx, x, y, solinari.value.phaseDisplay, solinariMax, solinari.value.day, textRadiusSolinari);
  drawMoonPhase(ctx, x, y, lunitari.value.phaseDisplay, lunitariMax, lunitari.value.day, textRadiusLunitari);
  drawMoonPhase(ctx, x, y, nuitari.value.phaseDisplay, nuitariMax, nuitari.value.day, textRadiusNuitari);
  ctx.restore();
}

</script>