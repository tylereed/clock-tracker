import { mount, VueWrapper } from "@vue/test-utils";
import { describe, expect, test } from "vitest";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import TimerVue from "../../src/components/timer/Timer.vue";
import { Timer } from "../../src/types/Timer";

interface ButtonStates {
  isStart: boolean,
  isResume: boolean,
  isPause: boolean,
  isStartEnabled: boolean,
  isResetEnabled: boolean
};

const vuetify = createVuetify({
  components,
  directives
});

function mountTimer(newProps?: Partial<Timer>) {
  const timer: Timer = {
    id: 0,
    runningId: null,
    pausedId: null,
    time: 0,
    elapsed: false,
    elapsedId: null,
    isRunning: false,
    timePauses: 0,
    isTimerDisplay: false,
  };

  const timerProps = newProps ? { ...timer, ...newProps } : timer;

  return mount(TimerVue,
    {
      props: timerProps,
      global: {
        components: {
          TimerVue
        },
        plugins: [vuetify]
      }
    }
  );
}

function getState(wrapper: VueWrapper<any, any>): ButtonStates {
  const [btnStart, btnReset] = wrapper.findAllComponents({ name: "VBtn" });

  const btnStartHtml = btnStart.html();
  return {
    isStart: btnStartHtml.includes("Start"),
    isResume: btnStartHtml.includes("Resume"),
    isPause: btnStartHtml.includes("Pause"),
    isStartEnabled: btnStart.attributes("disabled") === undefined,
    isResetEnabled: btnReset.attributes("disabled") === undefined
  };
}

function buildExpectedState(...states: (keyof ButtonStates)[]): ButtonStates {
  const result = {
    isStart: false,
    isResume: false,
    isPause: false,
    isStartEnabled: false,
    isResetEnabled: false
  };

  for (const key of states) {
    result[key] = true;
  }

  return result;
}

describe("Timer", () => {

  test("loads component - Timer", () => {
    const wrapper = mountTimer();

    expect(wrapper.html()).toContain("Timer");
  });

  test("loads component - Countdown", () => {
    const wrapper = mountTimer({ max: 60 });

    expect(wrapper.html()).toContain("Countdown");
  });

  test("loads component - Timer Resume", () => {
    const wrapper = mountTimer({ time: 60 });

    const html = wrapper.html()
    expect.soft(html).toContain("Timer");
    expect.soft(html).toContain("Resume");
  });

  test("loads component - Timer Pause", () => {
    const wrapper = mountTimer({ time: 60, isRunning: true });

    const html = wrapper.html()
    expect.soft(html).toContain("Timer");
    expect.soft(html).toContain("Pause");
  });

  test("Timer - Start", async () => {
    const wrapper = mountTimer({ id: 1 });

    const state = getState(wrapper);
    const expected = buildExpectedState("isStart", "isStartEnabled");

    expect(state).toStrictEqual(expected);

    const btnStart = wrapper.findAllComponents({ name: "VBtn" })[0];
    await btnStart.trigger("click");

    const events = wrapper.emitted("startTimer")!;

    expect(events).not.toBeUndefined();
    expect(events[0]).toStrictEqual([1]);
  });

  test("Timer - Pause", async () => {
    const wrapper = mountTimer({ id: 1, isRunning: true, time: 10 });

    const state = getState(wrapper);
    const expected = buildExpectedState("isPause", "isStartEnabled", "isResetEnabled");

    expect(state).toStrictEqual(expected);

    const btnStart = wrapper.findAllComponents({ name: "VBtn" })[0];
    await btnStart.trigger("click");

    const events = wrapper.emitted("pauseTimer")!;

    expect(events).not.toBeUndefined();
    expect(events[0]).toStrictEqual([1]);
  });

  test("Timer - Resume", async () => {
    const wrapper = mountTimer({ id: 1, time: 10 });

    const state = getState(wrapper);
    const expected = buildExpectedState("isResume", "isStartEnabled", "isResetEnabled");

    expect(state).toStrictEqual(expected);

    const btnStart = wrapper.findAllComponents({ name: "VBtn" })[0];
    await btnStart.trigger("click");

    const events = wrapper.emitted("startTimer")!;

    expect(events).not.toBeUndefined();
    expect(events[0]).toStrictEqual([1]);
  });

  test("Timer - Reset fails", async () => {
    const wrapper = mountTimer();

    const state = getState(wrapper);
    const expected = buildExpectedState("isStart", "isStartEnabled");

    expect(state).toStrictEqual(expected);

    const btnReset = wrapper.findAllComponents({ name: "VBtn" })[1];
    await btnReset.trigger("click");

    const events = wrapper.emitted()!;
    expect(events.length).toBeUndefined();
  });

  test("Timer - Reset works", async () => {
    const wrapper = mountTimer({ id: 1, time: 10 });

    const state = getState(wrapper);
    const expected = buildExpectedState("isResume", "isStartEnabled", "isResetEnabled");

    expect(state).toStrictEqual(expected);

    const btnReset = wrapper.findAllComponents({ name: "VBtn" })[1];
    await btnReset.trigger("click");

    const events = wrapper.emitted("resetTimer")!;
    expect.soft(events.length).toBe(1);
    expect.soft(events[0]).toStrictEqual([1]);
  });

  test("Countdown - emits is passed", () => {
    const wrapper = mountTimer({ max: 60, time: 61 });

    const events = wrapper.emitted("elapsedTimer")!;

    expect.soft(events.length).toBe(1);
    expect.soft(events[0]).toStrictEqual([0]);
  });

  test("Countdown - doesn't re-emit", () => {
    const wrapper = mountTimer({ max: 60, time: 61, elapsed: true });

    const events = wrapper.emitted()!;

    expect.soft(events.length).toBe(undefined);
  });

});
