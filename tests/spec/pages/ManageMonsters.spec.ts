import { mount } from "@vue/test-utils";
import { describe, expect, test } from "vitest";
import { createTestingPinia } from "@pinia/testing";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import ManageMonstersPage from "../../../src/pages/ManageMonsters.vue";

global.ResizeObserver = require("resize-observer-polyfill");
const vuetify = createVuetify({
  components,
  directives
});

function mountManageMonstersPage() {
  return mount(ManageMonstersPage,
    {
      global: {
        components: {
          ManageMonstersPage
        },
        plugins: [vuetify, createTestingPinia()]
      }
    });
}

describe("Initiative Tracker Page", () => {

  test("loads page", () => {
    const wrapper = mountManageMonstersPage();

    const html = wrapper.html();
    expect(html).toContain("Monsters");
    expect(html).toContain("Dex");
    expect(html).toContain("Name");
    expect(html).toContain("AC");
    expect(html).toContain("Max HP");
  });

});