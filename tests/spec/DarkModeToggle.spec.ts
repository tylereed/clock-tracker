import { mount } from "@vue/test-utils";
import { describe, beforeEach, expect, test, vi } from "vitest";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import DarkModeToggle from "../../src/components/settings/DarkModeToggle.vue";

const vuetify = createVuetify({
  components,
  directives
});

function mountDarkModeToggle() {
  return mount(DarkModeToggle,
    {
      global: {
        components: {
          DarkModeToggle
        },
        plugins: [vuetify]
      }
    }
  );
}

describe("DarkModeToggle", () => {

  beforeEach(() => {
    // VSwitch doesn't have a null check, so it throws when running in test
    // If I put this in a global setup, VProgressLinear starts throwing (which does perform the null check)
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  test("Mount DarkModeToggle", () => {
    const wrapper = mountDarkModeToggle();

    expect(wrapper.html()).toContain("mdi-white-balance-sunny");
    expect(wrapper.html()).not.toContain("mdi-moon-waxing-crescent");
  });

  test("Mount DarkModeToggle - default dark", () => {
    window.localStorage.setItem("vueuse-color-scheme", "dark");

    const wrapper = mountDarkModeToggle();

    expect(wrapper.html()).not.toContain("mdi-white-balance-sunny");
    expect(wrapper.html()).toContain("mdi-moon-waxing-crescent");
  });

  test("Toggle mode", async () => {
    const wrapper = mountDarkModeToggle();

    const toggle = wrapper.findComponent({ name: "VSwitch" });
    await toggle.trigger("click");

    expect(wrapper.html()).not.toContain("mdi-white-balance-sunny");
    expect(wrapper.html()).toContain("mdi-moon-waxing-crescent");
  });

});