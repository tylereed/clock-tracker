import { mount } from "@vue/test-utils";
import { describe, expect, test, vi } from "vitest";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import InitiativeTrackerPage from "../../../src/pages/InitiativeTracker.vue";

global.ResizeObserver = require("resize-observer-polyfill");

const vuetify = createVuetify({
  components,
  directives
});

function mountInitiativeTrackerPage() {
  return mount(InitiativeTrackerPage,
    {
      global: {
        components: {
          InitiativeTrackerPage
        },
        plugins: [vuetify]
      }
    });
}

describe("Initiative Tracker Page", () => {

  test("loads page", () => {
    const wrapper = mountInitiativeTrackerPage();

    const html = wrapper.html();
    expect(html).toContain("Round 1");
    expect(html).toContain("Initiative");
    expect(html).toContain("Name");
    expect(html).toContain("AC");
    expect(html).toContain("Max HP");
    expect(html).toContain(">HP<");
  });

});