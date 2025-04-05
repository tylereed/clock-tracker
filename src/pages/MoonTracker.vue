<template>
  <v-container>
    <v-row>
      <v-col cols="8">
        <canvas ref="canvasRef" class="ma-2" :width="size" :height="size" />
      </v-col>
      <v-col cols="4">
        <v-row>
          <v-col>
            <moon-status v-bind="solinari" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <moon-status v-bind="lunitari" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <moon-status v-bind="nuitari" />
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
import { onMounted, onUpdated, ref, watch } from "vue";
import { useTheme } from "vuetify";

import { MoonState } from "@/components/moonTracker/moon";
import { useMoonBonus, useMoonStatus } from "@/components/moonTracker/moonHelpers";
import MoonStatus from "@/components/moonTracker/MoonStatus.vue";

const vTheme = useTheme();

onMounted(render);
onUpdated(render);
watch(vTheme.current, render);

const canvasRef = ref<HTMLCanvasElement>();
const size = ref(500);

const solinariMax = 38;
const lunitariMax = 28;
const nuitariMax = 8;

// Need all moon phases to calculate bonus
// Build most of the status, then build bonus, then build full MoonState
const solinariPart: Omit<MoonState, "bonus"> = useMoonStatus("Solinari", solinariMax);
const lunitariPart: Omit<MoonState, "bonus"> = useMoonStatus("Lunitari", lunitariMax);
const nuitariPart: Omit<MoonState, "bonus"> = useMoonStatus("Nuitari", nuitariMax);
const [solinariBonus, lunitariBonus, nuitariBonus] = useMoonBonus(solinariPart, lunitariPart, nuitariPart);

const solinari: MoonState = { ...solinariPart, bonus: solinariBonus };
const lunitari: MoonState = { ...lunitariPart, bonus: lunitariBonus };
const nuitari: MoonState = { ...nuitariPart, bonus: nuitariBonus };


function addDays(toAdd: number) {
  solinari.day.value = (solinari.day.value + toAdd) % solinariMax;
  lunitari.day.value = (lunitari.day.value + toAdd) % lunitariMax;
  nuitari.day.value = (nuitari.day.value + toAdd) % nuitariMax;
}

function addDay() {
  addDays(1);
}

function subtractDay() {
  addDays(-1);
}

function randomizeDays() {
  solinari.day.value = Math.floor(solinariMax * Math.random());
  lunitari.day.value = Math.floor(lunitariMax * Math.random());
  nuitari.day.value = Math.floor(nuitariMax * Math.random());
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