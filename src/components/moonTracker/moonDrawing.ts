import { Ref } from "vue";
import { MoonSize, MoonState, MoonStateProps } from "./moon";

const tau = Math.PI * 2;

function drawMoon(ctx: CanvasRenderingContext2D, startColor: string, endColor: string, width: number, x: number, y: number, radius: number) {
  const start = width / 2 - radius;
  const end = width - start;

  const gradient = ctx.createLinearGradient(0, start, 0, end);
  gradient.addColorStop(0, startColor);
  gradient.addColorStop(1, endColor);

  ctx.fillStyle = gradient;
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
  radiusSolinari: number, radiusLunitari: number, radiusNuitari: number, solinariMax: number,
  lunitariMax: number, nuitariMax: number) {

  ctx.clearRect(0, 0, width, height);

  const lineGradient = ctx.createLinearGradient(0, 0, 0, height);
  lineGradient.addColorStop(0, "#FFD700"); // golden yellow
  lineGradient.addColorStop(1, "#BFA100");

  ctx.strokeStyle = lineGradient;
  ctx.lineWidth = 2.5;

  drawMoon(ctx, "#F8F8FF", "#BFC1C2", width, x, y, radiusSolinari); // off-white
  drawMoon(ctx, "#EF0000", "#6F0000", width, x, y, radiusLunitari);
  drawMoon(ctx, "#707070", "black", width, x, y, radiusNuitari);

  const originAngle = -Math.PI / 4;
  drawSegments(ctx, solinariMax, x, y, originAngle, radiusLunitari, radiusSolinari);
  drawSegments(ctx, lunitariMax, x, y, originAngle, radiusNuitari, radiusLunitari);
  drawSegments(ctx, nuitariMax, x, y, originAngle, 0, radiusNuitari);
}

function drawMoonPhase(ctx: CanvasRenderingContext2D, x: number, y: number,
  miniRadius: number, phaseDisplay: MoonSize, max: number, day: number, radius: number) {

  const originAngle = -Math.PI / 4 + tau / max / 2;
  const dayAngle = tau * day / max;
  const xOffset = radius * Math.sin(originAngle + dayAngle);
  const yOffset = radius * Math.cos(originAngle + dayAngle);

  let fill: string;
  let secondFill: string;
  if (phaseDisplay.endsWith("Crescent") || phaseDisplay === "Full Moon") {
    fill = "yellow";
    secondFill = "purple";
  } else {
    fill = "purple";
    secondFill = "yellow";
  }

  ctx.fillStyle = fill;
  ctx.strokeStyle = fill;
  ctx.beginPath();
  ctx.arc(x + xOffset, y + yOffset, miniRadius, 0, tau);
  ctx.fill();
  if (phaseDisplay === "Full Moon" || phaseDisplay === "New Moon") {
    return;
  }

  ctx.fillStyle = secondFill;
  ctx.strokeStyle = secondFill;
  const counterCW = phaseDisplay === "Waning Gibbous" || phaseDisplay === "Waxing Crescent" || phaseDisplay.startsWith("Last");
  ctx.beginPath();
  ctx.arc(x + xOffset, y + yOffset, miniRadius, -Math.PI / 2, Math.PI / 2, counterCW);

  if (!phaseDisplay.endsWith("Quarter")) {
    ctx.ellipse(x + xOffset, y + yOffset, miniRadius / 2, miniRadius, 0, -Math.PI / 2, Math.PI / 2, !counterCW);
  }
  ctx.fill();
  ctx.stroke();
}

export function renderTracker(ctx: CanvasRenderingContext2D, width: number, height: number, x: number, y: number,
  radiusSolinari: number, radiusLunitari: number, radiusNuitari: number, maxMoonSize: number, solinari: Ref<MoonStateProps>,
  lunitari: Ref<MoonStateProps>, nuitari: Ref<MoonStateProps>, solinariMax: number, lunitariMax: number, nuitariMax: number) {
  ctx.save();
  drawMoons(ctx, width, height, x, y, radiusSolinari, radiusLunitari, radiusNuitari, solinariMax, lunitariMax, nuitariMax);
  ctx.restore();

  const textRadiusSolinari = (radiusSolinari + radiusLunitari) / 2;
  const textRadiusLunitari = (radiusLunitari + radiusNuitari) / 2;
  const textRadiusNuitari = 3 * radiusNuitari / 4;

  ctx.save();

  const maxMiniMoon = 32;
  const miniMoonRadius = maxMiniMoon * width / maxMoonSize / 2;

  drawMoonPhase(ctx, x, y, miniMoonRadius, solinari.value.phaseDisplay, solinariMax, solinari.value.day, textRadiusSolinari);
  drawMoonPhase(ctx, x, y, miniMoonRadius, lunitari.value.phaseDisplay, lunitariMax, lunitari.value.day, textRadiusLunitari);
  drawMoonPhase(ctx, x, y, miniMoonRadius, nuitari.value.phaseDisplay, nuitariMax, nuitari.value.day, textRadiusNuitari);
  ctx.restore();
}