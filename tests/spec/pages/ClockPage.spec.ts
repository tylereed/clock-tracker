import { mount } from "@vue/test-utils";
import { describe, expect, test, vi } from "vitest";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import ClockPage from "../../../src/pages/Clocks.vue";
import { Clock, ClockTab } from "../../../src/types/Clock";

global.ResizeObserver = require("resize-observer-polyfill");

const defaultTabs = [
  {
    name: "Saved Clocks",
    clocks: [
      {
        id: 0,
        name: "unit_test",
        color: "blue",
        filledSlices: 3,
        totalSlices: 8,
        size: 200
      }
    ]
  }
];
const strDefaultTabs = JSON.stringify(defaultTabs);

function* makeTabs(tabsCount: number, clocksCount: number) {

  for (let i = 0; i < tabsCount; i++) {
    yield {
      name: `Tab ${i}`,
      clocks: [...makeClocks(clocksCount)]
    } as ClockTab;
  }
}

function* makeClocks(clocksCount: number) {
  for (let i = 0; i < clocksCount; i++) {
    yield {
      id: i,
      name: `Clock ${i}`,
      color: "blue",
      filledSlices: 1,
      totalSlices: 8,
      size: 200
    } as Clock;
  }
}

const vuetify = createVuetify({
  components,
  directives
});

function mountClockPage() {
  return mount(ClockPage,
    {
      global: {
        components: {
          ClockPage
        },
        plugins: [vuetify]
      }
    });
}

describe("Clock Page", () => {

  test("loads page", () => {
    const wrapper = mountClockPage();

    const html = wrapper.html();
    expect(html).toContain("Clocks");
  });

  test("empty clocks", () => {
    const wrapper = mountClockPage();

    const clockList = wrapper.findAllComponents({ name: "Clock" });
    expect(clockList.length).toBe(0);
    expect(wrapper.html()).toContain("Default");
  });

  test("existing clocks", () => {
    window.localStorage.setItem("clocks", strDefaultTabs);

    const wrapper = mountClockPage();

    const clockList = wrapper.findAllComponents({ name: "Clock" });
    expect(clockList.length).toBe(1);

    const html = wrapper.html();
    expect(html).toContain("Saved Clocks");
    expect(html).toContain("unit_test");
  });

  test("bad clock save", () => {
    const mockLog = vi.fn();
    console.error = mockLog;
    window.localStorage.setItem("clocks", "{ asdf }");

    const wrapper = mountClockPage();

    const clockList = wrapper.findAllComponents({ name: "Clock" });
    expect(clockList.length).toBe(0);
    expect(wrapper.html()).toContain("Default");
    expect(mockLog.mock.calls[0]).toBeTruthy();
  });

  test("Update slice - valid", () => {
    window.localStorage.setItem("clocks", strDefaultTabs);

    const wrapper: any = mountClockPage();

    wrapper.vm.updateSlice(0, 1);
    const clock: Clock = wrapper.vm.clocks[0];
    expect(clock.filledSlices).toBe(1);
  });

  test("Update slice - too high", () => {
    window.localStorage.setItem("clocks", strDefaultTabs);

    const wrapper: any = mountClockPage();

    wrapper.vm.updateSlice(0, 10);
    const clock: Clock = wrapper.vm.clocks[0];
    expect(clock.filledSlices).toBe(3);
  });

  test("Update slice - too low", () => {
    const wrapper: any = mountClockPage();
    wrapper.vm.clockTabs.value = defaultTabs;

    wrapper.vm.updateSlice(0, -1);
    const clock: Clock = wrapper.vm.clocks[0];
    expect(clock.filledSlices).toBe(3);
  });

  test("Move clock", () => {
    const wrapper: any = mountClockPage();
    wrapper.vm.clockTabs = [...makeTabs(2, 5)];

    wrapper.vm.moveClock(0, 3);
    const clock: Clock = wrapper.vm.clocks[2];

    expect(clock.name).toBe("Clock 0");
  });

  test("Remove clock - success", () => {
    const wrapper: any = mountClockPage();
    wrapper.vm.clockTabs = [...makeTabs(1, 5)];

    wrapper.vm.removeClock(0);

    const clocks: Clock[] = wrapper.vm.clocks;
    expect(clocks.length).toBe(4);
    expect(clocks[0].name).toBe("Clock 1");
  });

  test("Remove clock - too low", () => {
    const wrapper: any = mountClockPage();
    wrapper.vm.clockTabs = [...makeTabs(1, 5)];

    wrapper.vm.removeClock(-1);

    const clocks: Clock[] = wrapper.vm.clocks;
    expect(clocks.length).toBe(5);
  });

  test("Remove clock - too high", () => {
    const wrapper: any = mountClockPage();
    wrapper.vm.clockTabs = [...makeTabs(1, 5)];

    wrapper.vm.removeClock(6);

    const clocks: Clock[] = wrapper.vm.clocks;
    expect(clocks.length).toBe(5);
  });

  test("Clear clocks", () => {
    const wrapper: any = mountClockPage();
    wrapper.vm.clockTabs = [...makeTabs(1, 5)];

    wrapper.vm.clearClocks();

    const clocks: Clock[] = wrapper.vm.clocks;
    expect(clocks.length).toBe(0);
  });

  test("Open Add", async () => {
    const wrapper = mountClockPage();

    const button = wrapper.findComponent({ name: "TsExpandoButton" });
    const addButton = button.findAllComponents({ name: "VBtn" })[0];

    await addButton.trigger("click");

    const vm: any = wrapper.vm;
    expect(vm.addEditClockDisplay).toBeTruthy();
    expect(vm.addEditClockValues).toBeNull();
  });

  test("Open Edit", async () => {
    const wrapper = mountClockPage();

    const clockList = wrapper.findComponent({ name: "ClockList" });
    clockList.vm.$emit("editClock", 0);

    const vm: any = wrapper.vm;
    expect(vm.addEditClockDisplay).toBeTruthy();
    expect(vm.addEditClockValues).not.toBeNull();
  });

  test("Update Clock", () => {
    const wrapper: any = mountClockPage();
    wrapper.vm.clockTabs = [...makeTabs(1, 5)];

    const toUpdate: Clock = {
      id: 0,
      name: "updated clock",
      color: "red",
      filledSlices: 3,
      totalSlices: 5,
      size: 200
    };

    wrapper.vm.updateClock({ ...toUpdate });

    const actual = wrapper.vm.clocks[0];

    expect.soft(actual.id).toBe(toUpdate.id);
    expect.soft(actual.name).toBe(toUpdate.name);
    expect.soft(actual.color).toBe(toUpdate.color);
    expect.soft(actual.filledSlices).toBe(toUpdate.filledSlices);
    expect.soft(actual.totalSlices).toBe(toUpdate.totalSlices);
  });

  test("Quick Add Test - 4", async () => {
    const wrapper = mountClockPage();

    const button = wrapper.findComponent({ name: "TsExpandoButton" });
    const expandButton = button.findAllComponents({ name: "VBtn" })[1];
    await expandButton.trigger("click");

    const quickAddButton = button.findAllComponents({ name: "VBtn" })[2];
    await quickAddButton.trigger("click");

    const actual: Clock = (wrapper.vm as any).clocks.at(-1);

    expect(actual.totalSlices).toBe(4);
  });

  test("Quick Add Test - 6", async () => {
    const wrapper = mountClockPage();

    const button = wrapper.findComponent({ name: "TsExpandoButton" });
    const expandButton = button.findAllComponents({ name: "VBtn" })[1];
    await expandButton.trigger("click");

    const quickAddButton = button.findAllComponents({ name: "VBtn" })[3];
    await quickAddButton.trigger("click");

    const actual: Clock = (wrapper.vm as any).clocks.at(-1);

    expect(actual.totalSlices).toBe(6);
  });

  test("Quick Add Test - 8", async () => {
    const wrapper = mountClockPage();

    const button = wrapper.findComponent({ name: "TsExpandoButton" });
    const expandButton = button.findAllComponents({ name: "VBtn" })[1];
    await expandButton.trigger("click");

    const quickAddButton = button.findAllComponents({ name: "VBtn" })[4];
    await quickAddButton.trigger("click");

    const actual: Clock = (wrapper.vm as any).clocks.at(-1);

    expect(actual.totalSlices).toBe(8);
  });

  test("Add Tab", async () => {
    const wrapper = mountClockPage();

    const addTabBtn = wrapper.findAllComponents({ name: "VTab" }).at(-1)!;
    await addTabBtn.trigger("click");

    const tabs: ClockTab[] = (wrapper.vm as any).clockTabs;

    expect(tabs.length).toBe(2);
  });

  test("Remove Tab", async () => {
    const wrapper: any = mountClockPage();

    wrapper.vm.removeTab(0);

    expect(wrapper.vm.clockTabs.length).toBe(0);
  });



  test.skip("Undo/Redo", async () => {
    const savedTabs = JSON.stringify([...makeTabs(3, 5)]);
    window.localStorage.setItem("clocks", savedTabs);

    const wrapper = mountClockPage();
    const vm: any = wrapper.vm;

    const snapshots: { name: string, tabs: string }[] = [];
    //snapshots.push({ name: "initial", tabs: JSON.stringify(vm.clockTabs) });

    vm.updateSlice(0, 5);
    snapshots.push({ name: "updateSlice", tabs: JSON.stringify(vm.clockTabs) });

    vm.moveClock(0, 4);
    snapshots.push({ name: "moveClock", tabs: JSON.stringify(vm.clockTabs) });

    vm.removeClock(1);
    snapshots.push({ name: "removeClock", tabs: JSON.stringify(vm.clockTabs) });

    vm.clearClocks();
    snapshots.push({ name: "clearClocks", tabs: JSON.stringify(vm.clockTabs) });

    // vm.updateClock({
    //   id: 0,
    //   name: "undo/redo test - update",
    //   color: "red",
    //   filledSlices: 3,
    //   totalSlices: 5,
    //   size: 200
    // } as Clock);
    // snapshots.push({ name: "updateClock", tabs: JSON.stringify(vm.clockTabs) });

    // vm.addClock({
    //   name: "undo/redo test - add",
    //   color: "purple",
    //   filledSlices: 5,
    //   totalSlices: 10
    // } as NewClock);
    // snapshots.push({ name: "addClock", tabs: JSON.stringify(vm.clockTabs) });

    // vm.addTab();
    // snapshots.push({ name: "addTab", tabs: JSON.stringify(vm.clockTabs) });

    // vm.removeTab(0);
    //snapshots.push({ name: "removeTab", tabs: JSON.stringify(vm.clockTabs) });

    const redoSnapshots: { name: string, tabs: string }[] = [];

    const btnUndo = wrapper.findComponent({ name: "VCardActions" })
      .findAllComponents({ name: "VBtn" })
      .at(-2)!;
    while (snapshots.length > 0) {
      await btnUndo.trigger("click");
      const s = snapshots.pop()!;
      const current = JSON.stringify(vm.clockTabs);

      expect(current, `${s.name} - Undo`).toBe(s.tabs);

      redoSnapshots.push(s);
    }

    const btnRedo = wrapper.findComponent({ name: "VCardActions" })
      .findAllComponents({ name: "VBtn" })
      .at(-1)!;
    while(redoSnapshots.length > 0) {
      await btnRedo.trigger("click");
      const s = redoSnapshots.pop()!;
      const current = JSON.stringify(vm.clockTabs);

      expect(current, `${s.name} - Redo`).toBe(s.tabs);
    }
  });
  

});