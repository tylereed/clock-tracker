import { mount } from "@vue/test-utils";
import { describe, expect, test } from "vitest";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import ClockVue from "../../src/components/clocks/Clock.vue";
import { Clock } from "../../src/types/Clock";

global.ResizeObserver = require("resize-observer-polyfill");

const vuetify = createVuetify({
  components,
  directives
});

const baseClock: Clock = {
  id: 1,
  totalSlices: 8,
  filledSlices: 0,
  color: "red",
  size: 200
};
const defaultGlobal = {
  components: {
    ClockVue
  },
  plugins: [vuetify]
};

function mountClock(newProps?: Partial<Clock>) {
  let props: Clock;
  if (newProps) {
    props = { ...baseClock, ...newProps };
  } else {
    props = baseClock;
  }

  return mount(ClockVue,
    {
      props: props,
      global: { ...defaultGlobal }
    }
  );
}

describe("Clock", () => {

  test("loads Clock", () => {
    const wrapper = mountClock();

    const html = wrapper.html();
    expect(html).toContain("<canvas");
  });

  test("canvas resize", async () => {
    const wrapper = mountClock({ size: 250 });

    const html1 = wrapper.html();
    expect(html1).toMatch(/<canvas.*?width="250".*?height="250"/);

    await wrapper.setProps({ size: 300 });

    const html2 = wrapper.html();
    expect(html2).toMatch(/<canvas.*?width="300".*?height="300"/);
  });

  test("clock title", () => {
    const wrapper = mountClock({ name: "Component Test Name" });

    const text = wrapper.text();
    expect(text).toContain("Component Test Name");
  });

  test("clock slice increment", async () => {
    const wrapper = mountClock({ filledSlices: 2 });

    const vcard = wrapper.getComponent({ name: "VCard" });
    await vcard.trigger("click");
    const event = wrapper.emitted("updateSlice");

    expect(event).toHaveLength(1);
    expect(event![0]).toEqual([1, 3]);
  });

  test("clock slice decrement", async () => {
    const wrapper = mountClock({ filledSlices: 2 });

    await wrapper.getComponent({ name: "VCard" }).trigger("click.right");
    const event = wrapper.emitted("updateSlice");

    expect(event).toHaveLength(1);
    expect(event![0]).toEqual([1, 1]);
  });

  test("clock open edit", async () => {
    const wrapper = mountClock({ id: 2 });

    const editButton = wrapper.findAllComponents({ name: "VBtn" })[0];
    await editButton.trigger("click");

    const event = wrapper.emitted("editClock");
    expect(event).toHaveLength(1);
    expect(event![0]).toEqual([2]);
  });

  test("clock delete", async () => {
    const wrapper = mountClock({ id: 2 });

    const deleteButton = wrapper.findAllComponents({ name: "VBtn" })[1];
    await deleteButton.trigger("click");

    const event = wrapper.emitted("deleteClock");
    expect(event).toHaveLength(1);
    expect(event![0]).toEqual([2]);
  });

});