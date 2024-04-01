import { Clock, NewClock } from "@/types/Clock";

const MAX_CLOCK_WIDTH = 200;

export function getClockSize() {
  return Math.min(window.innerWidth / 4 - 20, MAX_CLOCK_WIDTH);
}

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function formatHex(n: number) {
  return n.toString(16).padStart(2, "0");
}

function getRandomBounds() {
  const smallRange = { min: 0, max: 64 };
  const bigRange = { min: 127, max: 256 };
  const defaultRGB = {
    red: { ...smallRange },
    green: { ...smallRange },
    blue: { ...smallRange }
  };

  const type = randomNumber(0, 6);
  switch (type) {
    default:
    case 0:
      return { ...defaultRGB, red: { ...bigRange } };
    case 1:
      return { ...defaultRGB, green: { ...bigRange } };
    case 2:
      return { ...defaultRGB, blue: { ...bigRange } };
    case 3:
      return { ...defaultRGB, red: { ...bigRange }, green: { ...bigRange } };
    case 4:
      return { ...defaultRGB, green: { ...bigRange }, blue: { ...bigRange } };
    case 5:
      return { ...defaultRGB, red: { ...bigRange }, blue: { ...bigRange } };
  }
}

export function randomishColor() {
  const range = getRandomBounds();
  const r = randomNumber(range.red.min, range.red.max);
  const g = randomNumber(range.green.min, range.green.max);
  const b = randomNumber(range.blue.min, range.blue.max);

  return `#${formatHex(r)}${formatHex(g)}${formatHex(b)}`;
}

const hexRegex = /^[0-9a-f]+$/i;
export function createClock(clock: Partial<Clock> & Pick<Clock, 'totalSlices'>): NewClock {
  const result = { ...clock };

  if (result.color?.match(hexRegex)) {
    result.color = "#" + result.color;
  }
  result.color ||= randomishColor();
  result.filledSlices ||= 0;
  result.totalSlices = +result.totalSlices;

  return result as NewClock;
}