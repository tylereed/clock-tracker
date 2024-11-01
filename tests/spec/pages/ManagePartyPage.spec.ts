import { mount } from "@vue/test-utils";
import { describe, expect, test, vi } from "vitest";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import ManagePartyPage from "../../../src/pages/ManageParty.vue";

global.ResizeObserver = require("resize-observer-polyfill");
const vuetify = createVuetify({
  components,
  directives
});

function mountManagePartyPage() {
  return mount(ManagePartyPage,
    {
      global: {
        components: {
          ManagePartyPage
        },
        plugins: [vuetify]
      }
    });
}

describe("Initiative Tracker Page", () => {

  test("loads page", () => {
    const wrapper = mountManagePartyPage();

    const html = wrapper.html();
    expect(html).toContain("Party");
    expect(html).toContain("Dex");
    expect(html).toContain("Name");
    expect(html).toContain("AC");
    expect(html).toContain("Max HP");
  });

});