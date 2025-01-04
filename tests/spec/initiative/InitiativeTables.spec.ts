import { mount, VueWrapper } from "@vue/test-utils";
import { describe, expect, test } from "vitest";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import InitiativeTable from "../../../src/components/initiative/InitiativeTable.vue";
import { InitiativeColumns, Initiatives, InitWithId } from "../../../src/types/Initiative";
import { defaultMonster } from "./defaultMonster";

global.ResizeObserver = require("resize-observer-polyfill");

const vuetify = createVuetify({
  components,
  directives
});

async function mountInitiativeTable(initiatives: Initiatives,
  columns: InitiativeColumns,
  turn?: number,
  round?: number): Promise<VueWrapper<any, any>> {
  const props = { initiatives, turn, round, columns };

  const wrapper = mount(InitiativeTable,
    {
      props: props,
      global: {
        components: {
          InitiativeTable
        },
        plugins: [vuetify]
      }
    }
  );

  await wrapper.setProps(props);

  return wrapper;
}

function buildColumns(...keys: (keyof InitiativeColumns)[]) {
  const columns: InitiativeColumns = {
    hasInitiative: false,
    hasDex: false,
    hasName: false,
    hasAc: false,
    hasMaxHp: false,
    hasHp: false,
    hasConditions: false
  };
  keys.forEach(k => {
    columns[k] = true;
  });
  return columns;
}

describe("InitiativeTable", () => {
  const sDefaultInitiative = JSON.stringify({ id: 1, ...defaultMonster, order: 0, conditions: {} });

  describe("mount initiative table", () => {

    function expectColumn(hasColumn: boolean, expectedLabel: string, html: string) {
      if (hasColumn) {
        expect(html).toContain(expectedLabel);
      } else {
        expect(html).not.toContain(expectedLabel);
      }
    }

    function expectColumns(columns: Partial<InitiativeColumns>, html: string) {
      expectColumn(!!columns.hasInitiative, "Initiative", html);
      expectColumn(!!columns.hasDex, "Dex", html);
      expectColumn(!!columns.hasName, "Name", html);
      expectColumn(!!columns.hasAc, "AC", html);
      expectColumn(!!columns.hasMaxHp, "Max HP", html);
      expectColumn(!!columns.hasHp, ">HP<", html);
      expectColumn(!!columns.hasConditions, "Conditions", html);
    }

    test.each([
      ["hasInitiative"], ["hasDex"], ["hasName"], ["hasAc"], ["hasMaxHp"], ["hasHp"], ["hasConditions"]
    ] as (keyof InitiativeColumns)[][])("Column %s", async (column: keyof InitiativeColumns) => {
      const columns = buildColumns(column);

      const wrapper = await mountInitiativeTable([], columns);

      const html = wrapper.html();
      expectColumns({ [column]: true }, html);
    });

  });

  test.skip("popups health change", async () => {
    const columns = buildColumns("hasHp");
    const monster = JSON.parse(sDefaultInitiative) as InitWithId;

    const wrapper = await mountInitiativeTable([monster], columns, 0, 1);
    const vtxtHp = wrapper.findComponent("[data-test='txtHp']");
    const txtHp = vtxtHp.find("input");

    await txtHp.trigger("focus");
    await txtHp.setValue("10");

    const html = wrapper.html();
    expect(html).toContain("Heal");
    expect(html).toContain("Damage");
  });

  test("alternate row", async () => {
    const columns = buildColumns("hasInitiative", "hasName", "hasAc", "hasMaxHp", "hasHp", "hasConditions");
    const monster = JSON.parse(sDefaultInitiative) as InitWithId;

    const wrapper = await mountInitiativeTable([monster, monster], columns, 0, 1);

    const html = wrapper.html();
    expect(html).toContain("alternate-row");
  });

});