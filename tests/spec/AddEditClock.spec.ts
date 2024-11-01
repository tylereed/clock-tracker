import { mount } from "@vue/test-utils";
import { describe, expect, test } from "vitest";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import AddEditClock from "../../src/components/clocks/AddEditClock.vue";
import { Clock, NewClock } from "../../src/types/Clock";
import { ErrorMessages } from "../../src/utils/validators";

global.ResizeObserver = require("resize-observer-polyfill");

const vuetify = createVuetify({
  components,
  directives
});

async function mountAddEditClock(props: NewClock | null = null) {
  const wrapper = mount(AddEditClock,
    {
      props: { clockValues: props },
      global: {
        components: {
          AddEditClock
        },
        plugins: [vuetify]
      }
    });

  if (props) {
    // I shouldn't have to set this again, but it seems that it's not mounting properly
    await wrapper.setProps({ clockValues: props });
  }

  return wrapper;
}

describe("AddEditClock", () => {

  test("Null Prop -- Add New", async () => {
    const wrapper = await mountAddEditClock();

    const html = wrapper.html();
    expect(html).toMatch("Add New Clock");
    expect(html).toMatch("Add Clock");
    expect(html).not.toMatch("Edit Clock");
  });

  test("Set Prop -- Edit", async () => {
    const p: Clock = {
      id: 1,
      filledSlices: 0,
      color: "#000000",
      totalSlices: 8,
      size: 200
    };
    const wrapper = await mountAddEditClock(p);

    const html = wrapper.html();
    expect(html).toMatch("Edit Clock");
    expect(html).not.toMatch("Add New Clock");
    expect(html).not.toMatch("Add Clock");
  });

  test("Validates Total Slices - Must be a positive number", async () => {
    const wrapper = await mountAddEditClock();

    const vform = wrapper.getComponent({ name: "VForm" });
    const vtextfield = wrapper.findAllComponents({ name: "VTextField" })[1];
    await vtextfield.setValue("asdf");

    await vform.trigger("submit.prevent");

    const html = wrapper.html();
    expect(html).toContain(ErrorMessages.WholeNumberMessage);
  });

  test("Validates Total Slices - Must be between 3 and 12 - Too low", async () => {
    const wrapper = await mountAddEditClock();

    const vform = wrapper.getComponent({ name: "VForm" });
    const vtextfield = wrapper.findAllComponents({ name: "VTextField" })[1];
    await vtextfield.setValue("0");

    await vform.trigger("submit.prevent");

    const html = wrapper.html();
    expect(html).toContain(ErrorMessages.RangeMessage(3, 12));
  });

  test("Validates Total Slices - Must be between 3 and 12 - Too high", async () => {
    const wrapper = await mountAddEditClock();

    const vform = wrapper.getComponent({ name: "VForm" });
    const vtextfield = wrapper.findAllComponents({ name: "VTextField" })[1];
    await vtextfield.setValue("13");

    await vform.trigger("submit.prevent");

    const html = wrapper.html();

    expect(html).toContain(ErrorMessages.RangeMessage(3, 12));
  });

  function testValidateColor(color: string, valid: boolean) {
    return async () => {
      const wrapper = await mountAddEditClock();

      const vform = wrapper.getComponent({ name: "VForm" });
      const vtextfield = wrapper.findAllComponents({ name: "VTextField" })[2];
      await vtextfield.setValue(color);

      await vform.trigger("submit.prevent");

      const html = wrapper.html();

      if (valid) {
        expect(html).not.toContain(ErrorMessages.ColorMessage);
      } else {
        expect(html).toContain(ErrorMessages.ColorMessage);
      }
    }
  }

  function testValidateColorValid(validColor: string) {
    return testValidateColor(validColor, true);
  }

  test("Validates Color - Valid colors - blue", testValidateColorValid("blue"));
  test("Validates Color - Valid colors - hex", testValidateColorValid("FFFFFF"));
  test("Validates Color - Valid colors - #hex", testValidateColorValid("#FFFFFF"));

  function testValidateColorBad(invalidColor: string) {
    return testValidateColor(invalidColor, false);
  }

  test("Validates Color - Invalid colors - blurple", testValidateColorBad("blurple"));
  test("Validates Color - Invalid colors - farts", testValidateColorBad("farts"));
  test("Validates Color - Invalid colors - asdf", testValidateColorBad("asdf"));
  test("Validates Color - Invalid colors - #GGGGGG", testValidateColorBad("#GGGGGG"));

  test("Valid - Emits Add New", async () => {
    const wrapper = await mountAddEditClock();

    const vform = wrapper.getComponent({ name: "VForm" });

    const values = ["New Clock", 9, "#00FF00"];

    const vtextfields = wrapper.findAllComponents({ name: "VTextField" });
    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      const vtextfield = vtextfields[i];
      vtextfield.trigger("focus");
      vtextfield.setValue(value);
      vtextfield.trigger("blur");
    }

    await vform.trigger("validate");
    await vform.trigger("submit.prevent");

    const events = wrapper.emitted("newClock");
    expect(events).toHaveLength(1);
    const actual = events![0][0] as NewClock;
    expect(actual.name).toBe("New Clock");
    expect(actual.color).toBe("#00FF00");
    expect(actual.filledSlices).toBe(0);
    expect(actual.totalSlices).toBe(9);
  });

  test("Valid - Emits Edit", async () => {
    const p: Clock = {
      id: 1,
      filledSlices: 2,
      color: "#000000",
      totalSlices: 8,
      size: 200
    };
    const wrapper = await mountAddEditClock(p);

    const vform = wrapper.getComponent({ name: "VForm" });

    const values = ["Edit Clock", 7, "#FF0000"];

    const vtextfields = wrapper.findAllComponents({ name: "VTextField" });
    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      const vtextfield = vtextfields[i];
      await vtextfield.trigger("focus");
      vtextfield.setValue(value);
      await vtextfield.trigger("blur");
    }

    await vform.trigger("validate");
    await vform.trigger("submit.prevent");

    const events = wrapper.emitted("updateClock");
    expect(events).toHaveLength(1);
    const actual = events![0][0] as Clock;
    expect.soft(actual.id).toBe(1);
    expect.soft(actual.name).toBe("Edit Clock");
    expect.soft(actual.color).toBe("#FF0000");
    expect.soft(actual.filledSlices).toBe(2);
    expect.soft(actual.totalSlices).toBe(7);
    expect.soft(actual.size).toBe(200);
  });

});