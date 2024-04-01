export interface Clock {
  id: number;
  name?: string;
  totalSlices: number;
  filledSlices: number;
  color: string;
  size: number;
}

export type NewClock = Omit<Clock, "id" | "size"> & Partial<Pick<Clock, "id" | "size">>;

export interface ClockTab {
  name: string;
  clocks: Clock[]
}