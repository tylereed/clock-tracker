import { mount } from "@vue/test-utils";
import { describe, expect, test } from "vitest";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import AddCountDown from "../../src/components/timer/AddCountdown.vue";
import { ErrorMessages } from "../../src/utils/validators";

const vuetify = createVuetify({
  components,
  directives
});

function mountAddCountDown() {
  return mount(AddCountDown,
    {
      global: {
        components: {
          AddCountDown
        },
        plugins: [vuetify]
      }
    }
  );
}

function mountAndGetFields() {
  const wrapper = mountAddCountDown();

  const vform = wrapper.getComponent({ name: "VForm" });

  const fields = wrapper.findAllComponents({ name: "VTextField" });
  const txtHours = fields[0];
  const txtMinutes = fields[1];

  return { wrapper, vform, txtHours, txtMinutes };
}

describe("AddCountdown.vue", () => {

  test("loads page", () => {
    const wrapper = mountAddCountDown();

    const html = wrapper.html();
    expect(html).toContain("Add New Countdown");
  });

  test("create countdown", async () => {
    const { wrapper, vform, txtHours, txtMinutes } = mountAndGetFields();

    await txtHours.setValue("1");
    await txtMinutes.setValue("10");

    // I seem to need to trigger validation twice in order for ifFormValid to be populated
    // It should happen automatically on submit
    await vform.trigger("validate");
    await vform.trigger("validate");

    await vform.trigger("submit.prevent");

    const event = wrapper.emitted("newCountdown")!;

    expect(event).toBeDefined();
    expect(event).not.toBeNull();
    expect(event).toHaveLength(1);
    expect(event[0]).toEqual([4200]);
  });

  test("validates hours - required", async () => {
    const { vform, txtHours } = mountAndGetFields();

    await txtHours.setValue("");
    await vform.trigger("submit.prevent");

    const html = txtHours.html();
    expect(html).toContain(ErrorMessages.RequiredMessage);
  });

  test("validates hours - not a number", async () => {
    const { txtHours } = mountAndGetFields();

    await txtHours.setValue("a");
    await txtHours.trigger("blur");

    const html = txtHours.html();
    expect(html).toContain(ErrorMessages.WholeNumberMessage);
  });

  test("validates hours - too high", async () => {
    const { txtHours } = mountAndGetFields();

    await txtHours.setValue("24");
    await txtHours.trigger("blur");

    const html = txtHours.html();
    expect(html).toContain(ErrorMessages.RangeMessage(0, 23));
  });

  test("validates minutes - required", async () => {
    const { vform, txtMinutes } = mountAndGetFields();

    await txtMinutes.setValue("a");
    await txtMinutes.setValue("");
    await vform.trigger("submit.prevent");

    const html = txtMinutes.html();
    expect(html).toContain(ErrorMessages.RequiredMessage);
  });

  test("validates minutes - not a number", async () => {
    const { txtMinutes } = mountAndGetFields();

    await txtMinutes.setValue("a");
    await txtMinutes.trigger("blur");

    const html = txtMinutes.html();
    expect(html).toContain(ErrorMessages.WholeNumberMessage);
  });

  test("validates minutes - too high", async () => {
    const { txtMinutes } = mountAndGetFields();

    await txtMinutes.setValue("60");
    await txtMinutes.trigger("blur");

    const html = txtMinutes.html();
    expect(html).toContain(ErrorMessages.RangeMessage(0, 59));
  });

  test("validates hours and minutes - no time", async () => {
    const { wrapper, vform, txtHours, txtMinutes } = mountAndGetFields();

    await txtHours.setValue("0");
    await txtMinutes.setValue("0");
    await txtMinutes.trigger("blur");

    await vform.trigger("submit.prevent");

    const html = wrapper.html();
    expect(html).toContain("Time must have a value");
  });

});