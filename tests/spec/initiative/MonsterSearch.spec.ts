import { mount, VueWrapper } from "@vue/test-utils";
import { describe, expect, test, vi } from "vitest";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import MonsterSearch from "../../../src/components/initiative/MonsterSearch.vue";
import Initiative, { InitiativeColumns, Initiatives } from "../../../src/types/Initiative";
import { getMonsterListCached, MonsterO5e } from "../../../src/utils/Open5e";
import { ErrorMessages } from "../../../src/utils/validators";
import { defaultMonster } from "./defaultMonster";

global.ResizeObserver = require("resize-observer-polyfill");

const vuetify = createVuetify({
  components,
  directives
});

function mountMonsterSearch(): VueWrapper<any, any> {
  return mount(MonsterSearch,
    {
      global: {
        components: {
          MonsterSearch
        },
        plugins: [vuetify]
      }
    }
  );
}

describe("MonsterSearch", () => {

  test("Mount MonsterSearch", () => {
    const wrapper = mountMonsterSearch();
    const html = wrapper.html();

    expect(html).toContain("Add Monster");
  });

  // test("Search", async () => {
  //   //getMonsterListCached = vi.fn().mockImplementation(() => Promise.resolve([defaultMonster]));
  //   const mock = vi.fn().mockImplementation(getMonsterListCached);
  //   mock.mockImplementation(() => Promise.resolve([defaultMonster]));

  //   const wrapper = mountMonsterSearch();
  //   await wrapper.vm.doSearch("unit_test_search");

  //   const searchBox = wrapper.findComponent({ name: "VAutocomplete" });

  //   await searchBox.setValue("unit_test_search");
  //   await searchBox.trigger("update:search");
  //   await searchBox.trigger("update:search");
  // });

});