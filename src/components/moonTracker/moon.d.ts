import { Ref } from "vue";

export type MoonPhase = "New" | "Waxing" | "Full" | "Waning";

export interface MoonState {
  name: string;
  day: Ref<number>;
  dayDisplay: Ref<number>;
  phase: Ref<MoonPhase>;
  phaseDisplay: Ref<string>;
  bonus: Ref<number>;
}