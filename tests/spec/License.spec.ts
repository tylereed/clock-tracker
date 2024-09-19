import { mount } from "@vue/test-utils";
import { describe, expect, test } from "vitest";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import License from "../../src/components/initiative/License.vue";

global.ResizeObserver = require("resize-observer-polyfill");

const vuetify = createVuetify({
  components,
  directives
});

describe("License", () => {

  test("Mount License", () => {
    const wrapper = mount(License,
      {
        global: {
          components: {
            License
          },
          plugins: [vuetify]
        }
      }
    );

    expect(wrapper.html()).toContain("Open5e API");
  });

});