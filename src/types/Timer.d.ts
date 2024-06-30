import { ActiveToast } from "vue-toast-notification";

export interface Timer {
  id: number;
  name?: string;
  runningId: number | null;
  pausedId: number | null;
  time: number;
  max?: number;
  elapsed: boolean;
  elapsedId: number | null;
  isRunning: boolean;
  timePauses: number;
  isTimerDisplay: boolean;
  toast?: ActiveToast;
}