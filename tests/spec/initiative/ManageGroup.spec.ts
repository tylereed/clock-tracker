import { mount, VueWrapper } from "@vue/test-utils";
import { describe, expect, test } from "vitest";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import ManageGroup from "../../../src/components/initiative/ManageGroup.vue";
import Initiative, { InitiativeColumns, Initiatives } from "../../../src/types/Initiative";
import { MonsterO5e } from "../../../src/utils/Open5e";
import { ErrorMessages } from "../../../src/utils/validators";

global.ResizeObserver = require("resize-observer-polyfill");

const vuetify = createVuetify({
  components,
  directives
});

async function mountManageGroup(label: string,
  groupNamePrefix: string,
  showMonster: boolean
): Promise<VueWrapper<any, any>> {
  const props = { label, groupNamePrefix, showMonster };

  const wrapper = mount(ManageGroup,
    {
      props: props,
      global: {
        components: {
          ManageGroup
        },
        plugins: [vuetify]
      }
    }
  );

  await wrapper.setProps(props);

  return wrapper;
}

describe("ManageGroup", () => {

  test("loads component - ManageGroup", async () => {
    const wrapper = await mountManageGroup("Unit Test", "unit-test", false);

    expect(wrapper.html()).toContain("Unit Test");
  });



});