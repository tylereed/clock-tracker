export interface Clock {
    id: number;
    name?: string;
    totalSlices: number;
    filledSlices: number;
    color: string;
    size: number;
}

export type ClockNoId = Omit<Clock, "id">;