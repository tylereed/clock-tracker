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

// I tried using vue's UnwrapNestedRefs, but it threw errors about TsConditionalType when trying to do the initial load
export interface MoonStateProps {
  name: string;
  day: number;
  dayDisplay: number;
  phase: MoonPhase;
  phaseDisplay: string;
  bonus: number;
}

// This also thows an error about TsConditionalType
// type MyUnwrapRef<T> = T extends Ref ? T["value"] : t extends object ? { [P in keyof T]: MyUnwrapRef<T[P]> } : never;
// export type MoonStateProps = MyUnwrapRef<MoonState>;