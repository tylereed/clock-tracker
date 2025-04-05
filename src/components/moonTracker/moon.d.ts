export type MoonPhase = "New" | "Waxing" | "Full" | "Waning";

export interface MoonState {
  day: Ref<number>;
  dayDisplay: Ref<number>;
  phase: Ref<MoonPhase>;
  phaseDisplay: Ref<string>;
  bonus: Ref<number>;
}