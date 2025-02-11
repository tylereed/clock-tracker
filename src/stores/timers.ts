import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

import { Timer } from "@/types/Timer";

export const useTimersStore = defineStore("timers", () => {
  const timers = useStorage<Timer[]>("timers", [], sessionStorage);

  return { timers };
});