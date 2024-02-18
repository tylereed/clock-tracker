const MAX_CLOCK_WIDTH = 200;

export interface Clock {
    id: number;
    name?: string;
    totalSlices: number;
    filledSlices: number;
    color: string;
    size: number;
}

export type NewClock = Omit<Clock, "id" | "size">;

export function getClockSize() {
  return Math.min(window.innerWidth / 4 - 20, MAX_CLOCK_WIDTH);
}