import { mount } from "@vue/test-utils";
import { describe, expect, test } from "vitest";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import ConditionsVue from "../../src/components/initiative/Conditions.vue";
import Conditions from "../../src/types/Conditions";

global.ResizeObserver = require("resize-observer-polyfill");

const vuetify = createVuetify({
  components,
  directives
});

async function mountConditions(...conditions: (keyof Conditions)[]) {
  const props: Conditions = {};
  if (conditions) {
    for (const k of conditions) {
      props[k] = true;
    }
  }

  const result = mount(ConditionsVue,
    {
      props: { ...props },
      global: {
        components: {
          Conditions: ConditionsVue
        },
        plugins: [vuetify]
      }
    }
  );

  if (conditions) {
    await result.setProps(props);
  }

  return result;
}

describe("Conditions", () => {

  test("loads page", async () => {
    const wrapper = await mountConditions();

    const html = wrapper.html();
    expect(html).toContain("<i class=\"mdi-plus-box");
  });

  test("Clicking icon adds condition", async () => {
    const wrapper = await mountConditions();

    const btnOpen = wrapper.findComponent({ name: "VIcon" });
    await btnOpen.trigger("click");

    const menu = wrapper.findComponent({ name: "VMenu" });
    const btnAdd = menu.findComponent({ name: "VImg" })
    await btnAdd.trigger("click");

    const event = wrapper.emitted("applyCondition")!;
    expect(event).toBeDefined();
    expect(event).not.toBeNull();
    expect(event).toHaveLength(1);
    expect(event[0]).toStrictEqual(["blinded"]);
  });

  test("Clicking icon adds condition", async () => {
    const wrapper = await mountConditions();

    const btnOpen = wrapper.findComponent({ name: "VIcon" });
    await btnOpen.trigger("click");

    const menu = wrapper.findComponent({ name: "VMenu" });
    const btnAdd = menu.findComponent({ name: "VImg" });
    await btnAdd.trigger("click");

    const event = wrapper.emitted("applyCondition")!;
    expect(event).toBeDefined();
    expect(event).not.toBeNull();
    expect(event).toHaveLength(1);
    expect(event[0]).toStrictEqual(["blinded"]);
  });

  test("Clicking icon removes condition - in menu", async () => {
    const wrapper = await mountConditions("blinded");

    const btnOpen = wrapper.findComponent({ name: "VIcon" });
    await btnOpen.trigger("click");

    const menu = wrapper.findComponent({ name: "VMenu" });
    const btnRemove = menu.findComponent({ name: "VImg" });
    await btnRemove.trigger("click");

    const event = wrapper.emitted("removeCondition")!;
    expect(event).toBeDefined();
    expect(event).not.toBeNull();
    expect(event).toHaveLength(1);
    expect(event[0]).toStrictEqual(["blinded"]);
  });

  test("Clicking icon removes condition - in menu", async () => {
    const wrapper = await mountConditions("blinded");

    const btnRemove = wrapper.findComponent({ name: "VImg" });
    await btnRemove.trigger("click");

    const event = wrapper.emitted("removeCondition")!;
    expect(event).toBeDefined();
    expect(event).not.toBeNull();
    expect(event).toHaveLength(1);
    expect(event[0]).toStrictEqual(["blinded"]);
  });

});