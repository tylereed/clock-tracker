import { useStorage } from "@vueuse/core";
import { computed, Ref } from "vue";
import { MoonPhase, MoonState } from "./moon";

function getPhase(day: number, max: number): MoonPhase {
  const phaseNumber = Math.floor(day / (max / 4));
  if (phaseNumber === 0) return "New";
  if (phaseNumber === 1) return "Waxing";
  if (phaseNumber === 2) return "Full"
  return "Waning";
}

function getPhaseDisplay(day: number, max: number) {
  const phase = getPhase(day, max);
  if (phase === "New") return "🌑";
  if (phase === "Waxing") return "🌓";
  if (phase === "Full") return "🌕";
  return "🌗";
}

export function useMoonStatus(storageKey: string, max: number) {
  const day = useStorage(storageKey, 0);
  const dayDisplay = computed(() => day.value + 1);
  const phase = computed(() => getPhase(day.value, max));
  const phaseDisplay = computed(() => getPhaseDisplay(day.value, max));

  return { day, dayDisplay, phase, phaseDisplay };
}

function calculateBonus(mainMoon: MoonPhase, otherMoon1: MoonPhase, otherMoon2: MoonPhase) {
  let bonus = 0;

  if (mainMoon === "New") bonus--;
  else if (mainMoon === "Full") bonus++;

  if (bonus != 0) {
    if (mainMoon === otherMoon1) bonus++;
    if (mainMoon === otherMoon2) bonus++;
  }

  return bonus;
}

export function useMoonBonus(solinari: Omit<MoonState, "bonus">, lunitari: Omit<MoonState, "bonus">, nuitari: Omit<MoonState, "bonus">): [Ref<number>, Ref<number>, Ref<number>] {
  const solBonus = computed(() => calculateBonus(solinari.phase.value, lunitari.phase.value, nuitari.phase.value));
  const lunBonus = computed(() => calculateBonus(lunitari.phase.value, solinari.phase.value, nuitari.phase.value));
  const nuiBonus = computed(() => calculateBonus(nuitari.phase.value, solinari.phase.value, lunitari.phase.value));

  return [solBonus, lunBonus, nuiBonus];
}