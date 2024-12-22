import { mount, VueWrapper } from "@vue/test-utils";
import { describe, expect, test } from "vitest";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import AddEditInitiative from "../../../src/components/initiative/AddEditInitiative.vue";
import Initiative from "../../../src/types/Initiative";
import { MonsterO5e } from "../../../src/utils/Open5e";
import { ErrorMessages } from "../../../src/utils/validators";
import { defaultMonster } from "./defaultMonster";

global.ResizeObserver = require("resize-observer-polyfill");

const vuetify = createVuetify({
  components,
  directives
});

async function mountAddEditInitiative(monster: MonsterO5e | null = null): Promise<VueWrapper<any, any>> {
  const wrapper = mount(AddEditInitiative,
    {
      props: { monsterStats: monster },
      global: {
        components: {
          AddEditInitiative
        },
        plugins: [vuetify]
      }
    }
  );

  await wrapper.setProps({ monsterStats: monster });

  return wrapper;
}

describe("AddEditInitiative", () => {

  describe("AddInitiative", () => {

    test("Mount AddInitiative", async () => {
      const wrapper = await mountAddEditInitiative();

      const html = wrapper.html();
      expect(html).toContain("Add PC Initiative");
      expect(html).not.toContain("Add Monster Initiative");
    });

    test("Add Initiative - Min", async () => {
      const wrapper = await mountAddEditInitiative();

      const txtInitiative = wrapper.findComponent('[data-test="txtInitiative"]');
      const txtName = wrapper.findComponent('[data-test="txtName"]');

      await txtInitiative.setValue("5");
      await txtName.setValue("unit test name");

      const vform = wrapper.findComponent('[data-test="frmInitiative"]');
      await vform.trigger("validate");
      await vform.trigger("submit.prevent");

      const emitted = wrapper.emitted("addInit")!;

      expect(emitted.length).toBe(1);
      expect(emitted[0].length).toBe(1);
      const actual = emitted[0][0] as Initiative;

      expect.soft(actual.order).toBe(5);
      expect.soft(actual.name).toBe("unit test name");
      expect.soft(actual.dex).toBeUndefined();
      expect.soft(actual.ac).toBeUndefined();
      expect.soft(actual.maxHp).toBeUndefined();
      expect.soft(actual.hp).toBeUndefined();
      expect.soft(actual.actions).toBeUndefined();
    });

    test("Add Initiative - All", async () => {
      const wrapper = await mountAddEditInitiative();

        const txtInitiative = wrapper.findComponent('[data-test="txtInitiative"]');
        const txtName = wrapper.findComponent('[data-test="txtName"]');
        const txtDex = wrapper.findComponent('[data-test="txtDex"]');
        const txtAc = wrapper.findComponent('[data-test="txtAc"]');
        const txtMaxHp = wrapper.findComponent('[data-test="txtMaxHp"]');

      await txtInitiative.setValue("6");
      await txtName.setValue("unit test name - all");
      await txtDex.setValue("3");
      await txtAc.setValue("18");
      await txtMaxHp.setValue("100");

      const vform = wrapper.findComponent('[data-test="frmInitiative"]');
      await vform.trigger("validate");
      await vform.trigger("submit.prevent");

      const emitted = wrapper.emitted("addInit")!;

      expect(emitted.length).toBe(1);
      expect(emitted[0].length).toBe(1);
      const actual = emitted[0][0] as Initiative;

      expect.soft(actual.order).toBe(6);
      expect.soft(actual.name).toBe("unit test name - all");
      expect.soft(actual.dex).toBe(3);
      expect.soft(actual.ac).toBe(18);
      expect.soft(actual.maxHp).toBe(100);
      expect.soft(actual.hp).toBe(100);
      expect.soft(actual.actions).toBeUndefined();
    });

    test("Validates Initiative - Required", async () => {
      const wrapper = await mountAddEditInitiative();

      const txtInitiative = wrapper.findComponent('[data-test="txtInitiative"]');
      await txtInitiative.setValue("");
      await txtInitiative.trigger("blur");

      const html = txtInitiative.html();
      expect(html).toContain(ErrorMessages.RequiredMessage);
    });

    test("Validates Initiative - Must be a positive number", async () => {
      const wrapper = await mountAddEditInitiative();

      const txtInitiative = wrapper.findComponent('[data-test="txtInitiative"]');
      await txtInitiative.setValue("a");
      await txtInitiative.trigger("blur");

      const html = txtInitiative.html();
      expect(html).toContain(ErrorMessages.WholeNumberMessage);
    });

    test("Validates Name - Required", async () => {
      const wrapper = await mountAddEditInitiative();

      const txtName = wrapper.findComponent('[data-test="txtName"]');
      await txtName.setValue("");
      await txtName.trigger("blur");

      const html = txtName.html();
      expect(html).toContain(ErrorMessages.RequiredMessage);
    });

    test("Validates Dex - Not Required", async () => {
      const wrapper = await mountAddEditInitiative();

      const txtDex = wrapper.findComponent('[data-test="txtDex"]');
      await txtDex.setValue("");
      await txtDex.trigger("blur");

      const html = txtDex.html();
      expect(html).not.toContain(ErrorMessages.RequiredMessage);
    });

    test("Validates Dex - Must be a positive number", async () => {
      const wrapper = await mountAddEditInitiative();

      const txtDex = wrapper.findComponent('[data-test="txtDex"]');
      await txtDex.setValue("a");
      await txtDex.trigger("blur");

      const html = txtDex.html();
      expect(html).toContain(ErrorMessages.IntegerMessage);
    });

    test("Validates Dex - Allows negative number", async () => {
      const wrapper = await mountAddEditInitiative();

      const txtDex = wrapper.findComponent('[data-test="txtDex"]');
      await txtDex.setValue("-1");
      await txtDex.trigger("blur");

      const html = txtDex.html();
      expect(html).not.toContain(ErrorMessages.IntegerMessage);
    });

    test("Validates AC - Must be a positive number", async () => {
      const wrapper = await mountAddEditInitiative();

      const txtAc = wrapper.findComponent('[data-test="txtAc"]');
      await txtAc.setValue("a");
      await txtAc.trigger("blur");

      const html = txtAc.html();
      expect(html).toContain(ErrorMessages.WholeNumberMessage);
    });

    test("Validates Max HP - Must be a positive number", async () => {
      const wrapper = await mountAddEditInitiative();

      const txtMaxHp = wrapper.findComponent('[data-test="txtMaxHp"]');
      await txtMaxHp.setValue("a");
      await txtMaxHp.trigger("blur");

      const html = txtMaxHp.html();
      expect(html).toContain(ErrorMessages.WholeNumberMessage);
    });

  });

  describe("Edit Monster", () => {
    function toValue(input: unknown) {
      return `value="${input}"`;
    }

    test("Mount EditInitiative", async () => {
      const wrapper = await mountAddEditInitiative(defaultMonster);

      const html = wrapper.html();
      expect(html).not.toContain("Add PC Initiative");
      expect(html).toContain("Add Monster Initiative");

      const txtInitiative = wrapper.findComponent('[data-test="txtInitiative"]');
      const txtName = wrapper.findComponent('[data-test="txtName"]');
      const txtDex = wrapper.findComponent('[data-test="txtDex"]');
      const txtAc = wrapper.findComponent('[data-test="txtAc"]');
      const txtMaxHp = wrapper.findComponent('[data-test="txtMaxHp"]');

      expect.soft(txtInitiative.html()).contain(toValue(9));
      expect.soft(txtName.html()).contain(toValue("Unit Test Monster"));
      expect.soft(txtDex.html()).contain(toValue(8));
      expect.soft(txtAc.html()).contain(toValue(14));
      expect.soft(txtMaxHp.html()).contain(toValue(115));
    });

    test("Rolls Initiative", async () => {
      const wrapper = await mountAddEditInitiative(defaultMonster);

      const txtInitiative = wrapper.findComponent('[data-test="txtInitiative"]');
      const txtMaxHp = wrapper.findComponent('[data-test="txtMaxHp"]');

      const btnInitiative = wrapper.findComponent('[data-test="btnInitiative"]');
      const btnHealth = wrapper.findComponent('[data-test="btnHealth"]');
      const btnHp = btnHealth.findAllComponents({ name: "VBtn" }).at(0)!;

      await txtInitiative.setValue("");
      await txtMaxHp.setValue("");

      expect.soft(txtInitiative.html()).not.toMatch(/value="\d+"/);
      expect(txtMaxHp.html()).not.toMatch(/value="\d+"/);

      await btnInitiative.trigger("click");
      await btnHp.trigger("click");

      expect.soft(txtInitiative.html()).toMatch(/value="\d+"/);
      expect(txtMaxHp.html()).toMatch(/value="\d+"/);
    });


    test("Add Monster", async () => {
      const wrapper = await mountAddEditInitiative(defaultMonster);

      const vform = wrapper.findComponent('[data-test="frmInitiative"]');
      await vform.trigger("validate");
      await vform.trigger("submit.prevent");

      const emitted = wrapper.emitted("addInit")!;

      expect(emitted.length).toBe(1);
      expect(emitted[0].length).toBe(1);
      const actual = emitted[0][0] as Initiative;

      expect.soft(actual.order).toBe(9);
      expect.soft(actual.name).toBe("Unit Test Monster");
      expect.soft(actual.dex).toBe(8);
      expect.soft(actual.ac).toBe(14);
      expect.soft(actual.maxHp).toBe(115);
      expect.soft(actual.hp).toBe(115);
      expect.soft(actual.actions).not.toBeUndefined();
    });

  });

});
