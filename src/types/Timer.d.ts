export interface Timer {
  id: number;
  name?: string;
  runningId: number | null;
  pausedId: number | null;
  time: number;
  isRunning: boolean;
  timePauses: number;
  isTimerDisplay: boolean;
}