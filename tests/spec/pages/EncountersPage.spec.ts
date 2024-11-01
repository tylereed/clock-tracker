import { mount } from "@vue/test-utils";
import { describe, expect, test, vi } from "vitest";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import EncountersPage from "../../../src/pages/Encounters.vue";

global.ResizeObserver = require("resize-observer-polyfill");
const vuetify = createVuetify({
  components,
  directives
});

function mountEncountersPage() {
  return mount(EncountersPage,
    {
      global: {
        components: {
          EncountersPage
        },
        plugins: [vuetify]
      }
    });
}

describe("Encounters Page", () => {

  test("loads page", () => {
    const wrapper = mountEncountersPage();

    const html = wrapper.html();
    expect(html).toContain("Initiative");
    expect(html).toContain("Manage Party");
    expect(html).toContain("Manage Monsters");
  });

});