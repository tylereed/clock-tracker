import { mount, VueWrapper } from "@vue/test-utils";
import { describe, expect, test } from "vitest";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import AddEditInitiative from "../../../src/components/initiative/AddEditInitiative.vue";
import Initiative from "../../../src/types/Initiative";
import { MonsterO5e } from "../../../src/utils/Open5e";
import { ErrorMessages } from "../../../src/utils/validators";

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

      const [
        txtInitiative,
        txtName
      ] = wrapper.findAllComponents({ name: "VTextField" });

      await txtInitiative.setValue("5");
      await txtName.setValue("unit test name");

      const vform = wrapper.findComponent({ name: "VForm" });
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

      const [
        txtInitiative,
        txtName,
        txtDex,
        txtAc,
        txtMaxHp
      ] = wrapper.findAllComponents({ name: "VTextField" });

      await txtInitiative.setValue("6");
      await txtName.setValue("unit test name - all");
      await txtDex.setValue("3");
      await txtAc.setValue("18");
      await txtMaxHp.setValue("100");

      const vform = wrapper.findComponent({ name: "VForm" });
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

      const txtInitiative = wrapper.findAllComponents({ name: "VTextField" })[0];
      await txtInitiative.setValue("");
      await txtInitiative.trigger("blur");

      const html = txtInitiative.html();
      expect(html).toContain(ErrorMessages.RequiredMessage);
    });

    test("Validates Initiative - Must be a positive number", async () => {
      const wrapper = await mountAddEditInitiative();

      const txtInitiative = wrapper.findAllComponents({ name: "VTextField" })[0];
      await txtInitiative.setValue("a");
      await txtInitiative.trigger("blur");

      const html = txtInitiative.html();
      expect(html).toContain(ErrorMessages.WholeNumberMessage);
    });

    test("Validates Name - Required", async () => {
      const wrapper = await mountAddEditInitiative();

      const txtName = wrapper.findAllComponents({ name: "VTextField" })[1];
      await txtName.setValue("");
      await txtName.trigger("blur");

      const html = txtName.html();
      expect(html).toContain(ErrorMessages.RequiredMessage);
    });

    test("Validates Dex - Not Required", async () => {
      const wrapper = await mountAddEditInitiative();

      const txtDex = wrapper.findAllComponents({ name: "VTextField" })[2];
      await txtDex.setValue("");
      await txtDex.trigger("blur");

      const html = txtDex.html();
      expect(html).not.toContain(ErrorMessages.RequiredMessage);
    });

    test("Validates Dex - Must be a positive number", async () => {
      const wrapper = await mountAddEditInitiative();

      const txtDex = wrapper.findAllComponents({ name: "VTextField" })[2];
      await txtDex.setValue("a");
      await txtDex.trigger("blur");

      const html = txtDex.html();
      expect(html).toContain(ErrorMessages.IntegerMessage);
    });

    test("Validates Dex - Allows negative number", async () => {
      const wrapper = await mountAddEditInitiative();

      const txtDex = wrapper.findAllComponents({ name: "VTextField" })[2];
      await txtDex.setValue("-1");
      await txtDex.trigger("blur");

      const html = txtDex.html();
      expect(html).not.toContain(ErrorMessages.IntegerMessage);
    });

    test("Validates AC - Must be a positive number", async () => {
      const wrapper = await mountAddEditInitiative();

      const txtAc = wrapper.findAllComponents({ name: "VTextField" })[3];
      await txtAc.setValue("a");
      await txtAc.trigger("blur");

      const html = txtAc.html();
      expect(html).toContain(ErrorMessages.WholeNumberMessage);
    });

    test("Validates Max HP - Must be a positive number", async () => {
      const wrapper = await mountAddEditInitiative();

      const txtMaxHp = wrapper.findAllComponents({ name: "VTextField" })[4];
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

      const [
        cmbTemplate,
        txtInitiative,
        txtName,
        txtDex,
        txtAc,
        txtMaxHp
      ] = wrapper.findAllComponents({ name: "VTextField" });

      expect.soft(txtInitiative.html()).contain(toValue(9));
      expect.soft(txtName.html()).contain(toValue("A-mi-kuk"));
      expect.soft(txtDex.html()).contain(toValue(8));
      expect.soft(txtAc.html()).contain(toValue(14));
      expect.soft(txtMaxHp.html()).contain(toValue(115));
    });

    test("Rolls Initiative", async () => {
      const wrapper = await mountAddEditInitiative(defaultMonster);


      const [
        cmbTemplate,
        txtInitiative,
        ,
        ,
        ,
        txtMaxHp
      ] = wrapper.findAllComponents({ name: "VTextField" });

      const [
        btnApplyTemplate,
        btnInitiative,
        btnHealth
      ] = wrapper.findAllComponents({ name: "VBtn" });

      await txtInitiative.setValue("");
      await txtMaxHp.setValue("");

      expect(txtInitiative.html()).not.toMatch(/value="\d+"/);
      expect(txtMaxHp.html()).not.toMatch(/value="\d+"/);

      await btnInitiative.trigger("click");
      await btnHealth.trigger("click");

      expect(txtInitiative.html()).toMatch(/value="\d+"/);
      expect(txtMaxHp.html()).toMatch(/value="\d+"/);
    });


    test("Add Monster", async () => {
      const wrapper = await mountAddEditInitiative(defaultMonster);

      const vform = wrapper.findComponent({ name: "VForm" });
      await vform.trigger("validate");
      await vform.trigger("submit.prevent");

      const emitted = wrapper.emitted("addInit")!;

      expect(emitted.length).toBe(1);
      expect(emitted[0].length).toBe(1);
      const actual = emitted[0][0] as Initiative;

      expect.soft(actual.order).toBe(9);
      expect.soft(actual.name).toBe("A-mi-kuk");
      expect.soft(actual.dex).toBe(8);
      expect.soft(actual.ac).toBe(14);
      expect.soft(actual.maxHp).toBe(115);
      expect.soft(actual.hp).toBe(115);
      expect.soft(actual.actions).not.toBeUndefined();
    });

  });

});

const defaultMonster = { "slug": "a-mi-kuk", "desc": "Crimson slime covers this ungainly creature. Its tiny black eyes sit in an abnormally large head, and dozens of sharp teeth fill its small mouth. Its limbs end in large, grasping claws that look strong enough to crush the life out of a bear._  \n**Hidden Terror.** The dreaded a-mi-kuk is a terrifying creature that feasts on any who venture into the bleak and icy expanses of the world. A-mi-kuks prowl the edges of isolated communities, snatching those careless enough to wander too far from camp. They also submerge themselves beneath frozen waters, coming up from below to grab and strangle lone fishermen.  \n**Fear of Flames.** A-mi-kuks have a deathly fear of fire, and anyone using fire against one has a good chance of making it flee in terror, even if the fire-user would otherwise be outmatched. A-mi-kuks are not completely at the mercy of this fear, however, and lash out with incredible fury if cornered by someone using fire against them.  \n**Unknown Origins.** A-mi-kuks are not natural creatures and contribute little to the ecosystems in which they live. The monsters are never seen together, and some believe them to be a single monster, an evil spirit made flesh that appears whenever a group of humans has angered the gods. A-mi-kuks have no known allies and viciously attack any creatures that threaten them, regardless of the foe’s size or power.", "name": "A-mi-kuk", "size": "Huge", "type": "Aberration", "subtype": "", "group": null, "alignment": "chaotic evil", "armor_class": 14, "armor_desc": "natural armor", "hit_points": 115, "hit_dice": "10d12+50", "speed": { "swim": 40, "burrow": 20, "walk": 30 }, "strength": 21, "dexterity": 8, "constitution": 20, "intelligence": 7, "wisdom": 14, "charisma": 10, "strength_save": null, "dexterity_save": null, "constitution_save": null, "intelligence_save": null, "wisdom_save": null, "charisma_save": null, "perception": 5, "skills": { "athletics": 10, "perception": 5, "stealth": 2 }, "damage_vulnerabilities": "", "damage_resistances": "acid; bludgeoning, piercing, and slashing from nonmagical attacks", "damage_immunities": "cold", "condition_immunities": "paralyzed, restrained", "senses": "darkvision 60 ft., tremorsense 30 ft., passive Perception 15", "languages": "understands Common but can’t speak", "challenge_rating": "7", "cr": 7.0, "actions": [{ "name": "Multiattack", "desc": "The a-mi-kuk makes two attacks: one with its bite and one with its grasping claw." }, { "name": "Bite", "desc": "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 12 (2d6 + 5) piercing damage.", "attack_bonus": 8, "damage_dice": "2d6+5" }, { "name": "Grasping Claw", "desc": "Melee Weapon Attack: +8 to hit, reach 10 ft., one target. Hit: 18 (3d8 + 5) bludgeoning damage, and the target is grappled (escape DC 16). The a-mi-kuk has two grasping claws, each of which can grapple only one target at a time.", "attack_bonus": 8, "damage_dice": "3d8+5" }, { "name": "Strangle", "desc": "The a-mi-kuk strangles one creature grappled by it. The target must make a DC 16 Strength saving throw. On a failure, the target takes 27 (6d8) bludgeoning damage, can’t breathe, speak, or cast spells, and begins suffocating. On a success, the target takes half the bludgeoning damage and is no longer grappled. Until this strangling grapple ends (escape DC 16), the target takes 13 (3d8) bludgeoning damage at the start of each of its turns. The a-mi-kuk can strangle up to two Medium or smaller targets or one Large target at a time." }], "bonus_actions": null, "reactions": null, "legendary_desc": "", "legendary_actions": null, "special_abilities": [{ "name": "Hold Breath", "desc": "The a-mi-kuk can hold its breath for 30 minutes." }, { "name": "Fear of Fire", "desc": "The a-mi-kuk is afraid of fire, and it won’t move toward any fiery or burning objects. If presented forcefully with a flame, or if it is dealt fire damage, the a-mi-kuk must succeed on a DC 13 Wisdom saving throw or become frightened until the end of its next turn. After it has been frightened by a specific source of fire (such as the burning hands spell), the a-mi-kuk can’t be frightened by that same source again for 24 hours." }, { "name": "Icy Slime", "desc": "The a-mi-kuk’s body is covered in a layer of greasy, ice-cold slime that grants it the benefits of freedom of movement. In addition, a creature that touches the a-mi-kuk or hits it with a melee attack while within 5 feet of it takes 7 (2d6) cold damage from the freezing slime. A creature grappled by the a-mi-kuk takes this damage at the start of each of its turns." }], "spell_list": [], "page_no": 15, "environments": [], "img_main": null, "document__slug": "tob2", "document__title": "Tome of Beasts 2", "document__license_url": "http://open5e.com/legal", "document__url": "https://koboldpress.com/kpstore/product/tome-of-beasts-2-for-5th-edition/" } as unknown as MonsterO5e;

