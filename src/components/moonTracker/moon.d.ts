import { Ref } from "vue";

export type MoonPhase = "New" | "Waxing" | "Full" | "Waning";

export type MoonSize = "New Moon" | "Waxing Crescent" | "First Quarter" | "Waxing Gibbous" | "Full Moon" | "Waning Gibbous" | "Last Quarter" | "Waning Crescent";

export interface MoonState {
  name: string;
  day: Ref<number>;
  dayDisplay: Ref<number>;
  phase: Ref<MoonPhase>;
  phaseDisplay: Ref<MoonSize>;
  bonus: Ref<number>;
}

// I tried using vue's UnwrapNestedRefs, but it threw errors about TsConditionalType when trying to do the initial load
export interface MoonStateProps {
  name: string;
  day: number;
  dayDisplay: number;
  phase: MoonPhase;
  phaseDisplay: MoonSize;
  bonus: number;
}

// This also thows an error about TsConditionalType
// type MyUnwrapRef<T> = T extends Ref ? T["value"] : t extends object ? { [P in keyof T]: MyUnwrapRef<T[P]> } : never;
// export type MoonStateProps = MyUnwrapRef<MoonState>;