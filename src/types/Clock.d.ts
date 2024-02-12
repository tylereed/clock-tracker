export interface Clock {
    id: number;
    name?: string;
    totalSlices: number;
    filledSlices: number;
    color: string;
    size: number;
}

export type NewClock = Omit<Clock, "id" | "size">;