import { mount, VueWrapper } from "@vue/test-utils";
import { describe, expect, test } from "vitest";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import InitiativeTable from "../../../src/components/initiative/InitiativeTable.vue";
import Initiative, { InitiativeColumns, Initiatives } from "../../../src/types/Initiative";
import { MonsterO5e } from "../../../src/utils/Open5e";
import { ErrorMessages } from "../../../src/utils/validators";

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

});