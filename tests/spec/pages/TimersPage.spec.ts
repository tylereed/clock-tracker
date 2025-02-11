import { mount, VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { createTestingPinia } from "@pinia/testing";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import TimersPage from "../../../src/pages/Timers.vue";
import { Timer } from "../../../src/types/Timer";

global.ResizeObserver = require("resize-observer-polyfill");

const vuetify = createVuetify({
  components,
  directives
});

function mountTimers(): VueWrapper<any, any> {
  return mount(TimersPage,
    {
      global: {
        components: {
          TimersPage
        },
        plugins: [vuetify, createTestingPinia()]
      }
    });
}

function buildDefaultTimer() {
  return {
    id: 0,
    runningId: null,
    pausedId: null,
    time: 0,
    elapsed: false,
    elapsedId: null,
    isRunning: false,
    timePauses: 0,
    isTimerDisplay: false
  };
}

describe("Timers Page", () => {

  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    sessionStorage.clear();
  });

  test("loads page", () => {
    const wrapper = mountTimers();

    const html = wrapper.html();
    expect(html).toContain("Timers");
  });

  test("Add Timer click", async () => {
    const wrapper = mountTimers();
    const actionCard = wrapper.findAllComponents({ name: "VCardActions" }).at(-1)!;
    const btnAddTimer = actionCard.findAllComponents({ name: "VBtn" }).at(1)!;

    await btnAddTimer.trigger("click");

    expect(wrapper.vm.timers.length).toBe(2);
  });

  test("Add Countdown click", async () => {
    const wrapper = mountTimers();
    const actionCard = wrapper.findAllComponents({ name: "VCardActions" }).at(-1)!;
    const btnExpando = actionCard.findAllComponents({ name: "VBtn" }).at(-1)!;

    await btnExpando.trigger("click");

    const btnAddCountdown = actionCard.findAllComponents({ name: "VBtn" }).at(-1)!;
    await btnAddCountdown.trigger("click");

    expect(wrapper.vm.addCountdownDisplay).toBeTruthy();
  });

  test("Delete Timers", async () => {
    const wrapper = mountTimers();
    const actionCard = wrapper.findAllComponents({ name: "VCardActions" }).at(-1)!;

    const btnAddTimer = actionCard.findAllComponents({ name: "VBtn" }).at(1)!;
    await btnAddTimer.trigger("click");

    expect(wrapper.vm.timers.length).toBe(2);

    const btnClear = actionCard.findAllComponents({ name: "VBtn" }).at(0)!;

    await btnClear.trigger("click");

    expect(wrapper.vm.timers.length).toBe(1);
  });

  test("Clear Timer", async () => {
    const wrapper = mountTimers();
    wrapper.vm.timers.push(buildDefaultTimer());
    wrapper.vm.timers.push(buildDefaultTimer());

    const timer = wrapper.findComponent({ name: "Timer" });
    timer.vm.$emit("deleteTimer", timer.vm.id);

    expect(wrapper.vm.timers.length).toBe(2);
  });

  test("Delete Timer - clears intervals", async () => {
    window.clearInterval = vi.fn();
    const wrapper = mountTimers();
    wrapper.vm.timers[0].runningId = 1;
    wrapper.vm.timers[0].pausedId = 2;
    wrapper.vm.timers[0].elapsedId = 3;
    const clearToast = vi.fn();
    wrapper.vm.timers[0].toast = { dismiss: clearToast };

    const timer = wrapper.findComponent({ name: "Timer" });
    timer.vm.$emit("deleteTimer", timer.vm.id);

    expect(window.clearInterval).toHaveBeenCalledWith(1);
    expect(window.clearInterval).toHaveBeenCalledWith(2);
    expect(window.clearInterval).toHaveBeenCalledWith(3);
    expect(clearToast).toHaveBeenCalled();
  });

  test("Timer - Start/Pause/Resume/Reset", async () => {
    const wrapper = mountTimers();

    const timer = wrapper.findComponent({ name: "Timer" });

    const btnStart = timer.findAllComponents({ name: "VBtn" })[0];
    await btnStart.trigger("click");

    await vi.advanceTimersByTimeAsync(27);
    const timeDisplay = wrapper.vm.timers[0].time;

    expect(timeDisplay).toBeGreaterThan(0);

    const btnPause = timer.findAllComponents({ name: "VBtn" })[0];
    vi.clearAllTimers();
    await btnPause.trigger("click");

    await vi.advanceTimersByTimeAsync(500);

    expect(wrapper.vm.timers[0].time).toBe(timeDisplay);

    const btnResume = timer.findAllComponents({ name: "VBtn" })[0];
    vi.clearAllTimers();
    await btnResume.trigger("click");
    await vi.advanceTimersByTimeAsync(27);

    expect(wrapper.vm.timers[0].time).toBeGreaterThan(timeDisplay);

    const btnReset = timer.findAllComponents({ name: "VBtn" })[1];
    vi.clearAllTimers();
    await btnReset.trigger("click");
    await vi.advanceTimersByTimeAsync(500);

    expect(wrapper.vm.timers[0].time).toBe(0);
  });

  test("Countdown Elapsed", { timeout: 100000 }, async () => {
    const wrapper = mountTimers();
    wrapper.vm.timers[0].max = 60;

    const timer = wrapper.findComponent({ name: "Timer" });

    const btnStart = timer.findAllComponents({ name: "VBtn" })[0];
    await btnStart.trigger("click");

    await vi.advanceTimersByTimeAsync(62 * 1000);

    expect(wrapper.vm.timers[0].elapsed).toBeTruthy();
  });

});