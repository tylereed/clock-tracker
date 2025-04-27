import { useStorage } from "@vueuse/core";
import { computed, Ref } from "vue";
import { MoonPhase, MoonSize, MoonState } from "./moon";

function getPhase(day: number, max: number): MoonPhase {
  const phaseNumber = Math.floor(day / (max / 4));
  if (phaseNumber === 0) return "New";
  if (phaseNumber === 1) return "Waxing";
  if (phaseNumber === 2) return "Full"
  return "Waning";
}

const moonPhases: MoonSize[] = ["Waning Crescent", "New Moon", "Waxing Crescent", "First Quarter",
  "Waxing Gibbous", "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"];
function getPhaseDisplay(day: number, max: number): MoonSize {

  const phase = getPhase(day, max);

  if (max === 8) {
    if (phase === "New") return "New Moon";
    if (phase === "Waxing") return "First Quarter";
    if (phase === "Full") return "Full Moon";
    return "Last Quarter";
  }

  const daysInPhase = max / 4;
  const dayPhase = day % daysInPhase;

  let index;
  switch (phase) {
    case "New":
      index = 1;
      break;
    case "Waxing":
      index = 3;
      break;
    case "Full":
      index = 5;
      break;
    case "Waning":
      index = 7;
      break;
  }
  if (dayPhase < 2) {
    index--;
  } else if (daysInPhase - dayPhase <= 2) {
    index++;
  }

  return moonPhases[index];
}

export function useMoonStatus(name: string, max: number) {
  const storageKey = name.toLocaleLowerCase() + "Day";
  const day = useStorage(storageKey, 0);
  const dayDisplay = computed(() => day.value + 1);
  const phase = computed(() => getPhase(day.value, max));
  const phaseDisplay = computed(() => getPhaseDisplay(day.value, max));

  return { name, day, dayDisplay, phase, phaseDisplay };
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