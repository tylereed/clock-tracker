import { ActiveToast } from "vue-toast-notification";

export interface Timer {
  id: number;
  name?: string;
  runningId: NodeJS.Timeout | string | number | null;
  pausedId: NodeJS.Timeout | string | number | null;
  time: number;
  max?: number;
  elapsed: boolean;
  elapsedId: NodeJS.Timeout | string | number | null;
  isRunning: boolean;
  timePauses: number;
  isTimerDisplay: boolean;
  toast?: ActiveToast;
}