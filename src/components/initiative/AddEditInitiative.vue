<template>
  <v-form v-model="isFormValid" @submit.prevent="addEditInitiative" data-test="frmInitiative">
    <v-card>
      <v-card-title>{{ isEdit ? "Edit" : "Add" }} {{ isMonster ? "Monster" : "PC" }} Initiative</v-card-title>
      <v-card-text>
        <v-container>
          <v-row v-if="monsterStats">
            <v-col cols="9">
              <v-select v-model="selectedTemplate" density="compact" label="Template" :items="templates" />
            </v-col>
            <v-col cols="3">
              <v-btn @click="applyTemplate()">Apply Template</v-btn>
            </v-col>
          </v-row>
          <v-row v-show="selectedTemplate === 'Zombie'">
            <v-col>
              <v-checkbox label="Undead Fortitude" density="compact" v-model="undeadFortitude"
                v-tooltip:top="'If the zombie is reduced to 0 hit points by damage that isnt radiant or from a critical hit, its instead reduced to 1 hit point, falls prone, and is stunned until the end of its next turn, appearing to be dead.'" />
            </v-col>
            <v-col>
              <v-checkbox label="Infectious Bite" density="compact" v-model="infectiousBite"
                v-tooltip:top="'A creature bitten by the zombie takes 2 (1d4) ongoing necrotic damage until it regains hit points or a creature makes a DC 15 Medicine check to treat the wound. If a beast, dragon, giant, humanoid, or monstrosity dies while suffering from this effect, it becomes a zombie after 1 minute, gaining the zombie template.'" />
            </v-col>
            <v-col>
              <v-checkbox label="Vile Discharge" density="compact" v-model="vileDischarge"
                v-tooltip:top="'The zombie\'s melee attacks deal an extra 2 (1d4) poison damage. Additionally, when it\'s reduced to 0 hit points, it explodes. Creatures within 5 feet make a Dexterity saving throw against the zombie\'s maneuver DC, taking 5 (2d4) poison damage on a failure.'" />
            </v-col>
            <v-col>
              <v-checkbox label="Vigor Mortis" density="compact" v-model="vigorMortis"
                v-tooltip:top="'The zombie can take the Dash action as a bonus action. It can\'t do so again until it moves 0 feet on one of its turns.'" />
            </v-col>
          </v-row>
          <v-row v-show="selectedTemplate === 'Merfolk'">
            <v-col>
              <v-checkbox label="Include Trident" density="compact" v-model="includeTrident"
                v-tooltip:top="'Add a trident to the creature\'s equipment if it doesn\'t already have one.'" />
            </v-col>
          </v-row>
          <v-row v-show="selectedTemplate === 'Half-Dragon'">
            <v-col>
              <v-select v-model="selectedDragonType" density="compact" label="Dragon Type" :items="halfDragonTypes" />
            </v-col>
          </v-row>
          <v-row>
            <v-col :cols="isMonster ? 9 : 12"><v-text-field label="Initiative" density="compact" v-model="newInit.order"
                :rules="v.OrderRules" data-test="txtInitiative" /></v-col>
            <v-col v-if="isMonster" cols="3">
              <v-btn @click="rollInitiative()" v-tooltip:top="initiativeDice.toString()"
                data-test="btnInitiative">Roll</v-btn>
            </v-col>
            <v-col cols="isEdit ? 11 : 12"><v-text-field label="Name" density="compact" v-model="newInit.name"
                :rules="v.NameRules" data-test="txtName" /></v-col>
            <v-col cols="1" v-if="newInit?.open5eId">
              <show-stats :id="newInit.open5eId" />
            </v-col>
            <v-col cols="12"><v-text-field label="Dex Score" density="compact" v-model="newInit.dex" :rules="v.DexRules"
                data-test="txtDex" /></v-col>
            <v-col cols="12"><v-text-field label="AC" density="compact" v-model="newInit.ac" :rules="v.AcRules"
                data-test="txtAc" /></v-col>
            <v-col cols="12" v-if="isMonster"><v-text-field label="CR" density="compact" v-model="newInit.cr"
                :rules="v.CrRules" data-test="txtCr" /></v-col>
            <v-col cols="12" v-else><v-text-field label="Level" density="compact" v-model="newInit.level"
                :rules="v.LevelRules" data-test="txtLevel" /></v-col>
            <v-col :cols="isMonster && healthDice ? 9 : 12"><v-text-field label="HP" density="compact"
                v-model="newInit.maxHp" :rules="v.MaxHpRules" data-test="txtMaxHp" /></v-col>
            <v-col v-if="isMonster && healthDice" cols="3">
              <ts-expando-button v-bind="props" :actions="healthRollActions" v-tooltip:top="healthDice.toString()"
                data-test="btnHealth" />
            </v-col>
          </v-row>
          <v-row>
            <action-control class="mb-2" label="Actions" :actions="newInit.actions"
              @add-action="addAction('actions')" />
            <action-control class="mb-2" label="Bonus Actions" :actions="newInit.bonusActions"
              @add-action="addAction('bonusActions')" />
            <action-control class="mb-2" label="Reactions" :actions="newInit.reactions"
              @add-action="addAction('reactions')" />
            <action-control class="mb-2" label="Legendary Actions" :actions="newInit.legendaryActions"
              @add-action="addAction('legendaryActions')" />
            <action-control class="mb-2" label="Traits" :actions="newInit.traits" @add-action="addAction('traits')" />
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn variant="elevated" color="primary" :disabled="!isFormValid" type="submit">
          {{ isEdit ? "Edit" : "Add" }}
        </v-btn>
        <v-btn @click="emit('close')" variant="outlined">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, toRefs, watch } from "vue";

import ActionControl from "./ActionControl.vue";
import ShowStats from "./ShowStats.vue";
import TsExpandoButton from "@/components/common/TsExpandoButton.vue";

import Dice from "@/utils/Dice";
import Initiative, { ActionDescription, InitiativeActionKey, InitWithId } from "@/types/Initiative";
import { MonsterO5e } from "@/utils/Open5e";
import v from "./InitiativeRules";
import { monsterO5eToInitiative } from "./initiativeHelpers";
import { TemplateType, DragonType, dragonTypes, TemplateOptions, templates as templateNames } from "@/components/initiative/templates/types";
import * as t from "@/components/initiative/templates";

const props = defineProps<{ monsterStats?: MonsterO5e | null, initStats?: InitWithId | null }>();
const { monsterStats, initStats } = toRefs(props);

const emit = defineEmits<{
  (e: "addInit", init: Initiative): void,
  (e: "editInit", id: number, init: Initiative): void,
  (e: "close"): void,
}>();

type NewInitiative = Omit<Initiative, "hp">;

const isFormValid = ref(false);
const isMonster = ref(false);
const isEdit = ref(false);
const newInit = ref<NewInitiative>({} as NewInitiative);
let defaultHealth = 0;

function setMonster(monster: MonsterO5e) {
  initiativeDice.value = Dice.D20.ofStat(monster.dexterity);
  healthDice.value = Dice.parse(monster.hit_dice);
  defaultHealth = monster.hit_points;
  newInit.value = monsterO5eToInitiative(monster);
}

function cloneActions(actions?: ActionDescription[]): ActionDescription[] {
  if (actions?.length) {
    return actions.map(x => ({ ...x }));
  }
  return [];
}

function cloneInitiative(init: Initiative): NewInitiative {
  return {
    ...init,
    actions: cloneActions(init.actions),
    bonusActions: cloneActions(init.bonusActions),
    reactions: cloneActions(init.reactions),
    legendaryActions: cloneActions(init.legendaryActions),
    traits: cloneActions(init.traits),
    saves: init.saves ? { ...init.saves } : undefined,
    conditions: { ...init.conditions },
  }
}

function addAction(actionName: InitiativeActionKey) {
  newInit.value[actionName] ??= [];
  newInit.value[actionName].push({ name: "", desc: "" });
}

onMounted(() => {
  if (monsterStats?.value) {
    isMonster.value = true;
    isEdit.value = false;
    setMonster(monsterStats.value);
  } else if (initStats?.value) {
    isMonster.value = !!initStats.value.open5eId;
    isEdit.value = true;
    newInit.value = cloneInitiative(initStats.value);
  } else {
    isMonster.value = false;
    isEdit.value = false;
    newInit.value = {} as NewInitiative;
  }
});

const initiativeDice = ref<Dice>(Dice.D20.ofModifier(0));
function rollInitiative() {
  newInit.value.order = initiativeDice.value.throw();
}

const healthDice = ref<Dice>();
const healthRollActions = reactive([
  { label: "Roll", action: () => rollHealth() },
  { label: "Roll 1.5x", action: () => rollHealth(1.5) },
  { label: "Roll 2x", action: () => rollHealth(2) },
  { label: "Min", action: () => newInit.value.maxHp = healthDice.value?.Min },
  { label: "Max", action: () => newInit.value.maxHp = healthDice.value?.Max },
  { label: "Average", action: () => newInit.value.maxHp = defaultHealth }
]);

function rollHealth(multiplier?: number) {
  newInit.value.maxHp = healthDice.value?.throw(multiplier);
}

function asInt(item?: number | string) {
  if (typeof item !== "undefined") {
    return +item;
  }
  return undefined;
}

function cleanActions(actions?: ActionDescription[]): ActionDescription[] {
  if (actions?.length) {
    return actions.filter(x => x.name && x.desc);
  }
  return [];
}

function addEditInitiative() {
  if (isFormValid.value) {
    const init: Initiative = {
      ...newInit.value,
      order: +newInit.value.order,
      dex: asInt(newInit.value.dex),
      ac: asInt(newInit.value.ac),
      maxHp: asInt(newInit.value.maxHp),
      hp: asInt(newInit.value.maxHp),
      actions: cleanActions(newInit.value.actions),
      bonusActions: cleanActions(newInit.value.bonusActions),
      reactions: cleanActions(newInit.value.reactions),
      legendaryActions: cleanActions(newInit.value.legendaryActions),
      traits: cleanActions(newInit.value.traits),
    };
    if (isEdit.value) {
      emit("editInit", initStats.value!.id, init);
    } else {
      emit("addInit", init);
    }
  }
}

const undeadFortitude = ref(true);
const infectiousBite = ref(false);
const vileDischarge = ref(false);
const vigorMortis = ref(false);

const includeTrident = ref(true);

const halfDragonTypes = ref(dragonTypes);
const selectedDragonType = ref<DragonType>("Amethyst");

function getOptions(type: TemplateType): TemplateOptions | undefined {
  switch (type) {
    case "Zombie":
      return {
        undeadFortitude: undeadFortitude.value,
        infectiousBite: infectiousBite.value,
        vileDischarge: vileDischarge.value,
        vigorMortis: vigorMortis.value
      };
    case "Merfolk":
      return {
        includeTrident: includeTrident.value
      }
    case "Half-Dragon":
      return {
        type: selectedDragonType.value
      }
  }
}

const templates = ref(templateNames);
const selectedTemplate = ref<TemplateType>("Squad");
async function applyTemplate() {
  if (selectedTemplate.value && monsterStats.value) {
    const options = getOptions(selectedTemplate.value);
    const template = await t.applyTemplate(selectedTemplate.value, monsterStats.value, options);
    if (template) {
      setMonster(template);
    }
  }
}

watch(selectedTemplate, value => {
  if (value === "Zombie") {
    undeadFortitude.value = true;
    infectiousBite.value = false;
    vileDischarge.value = false;
    vigorMortis.value = false;
  }
  if (value === "Merfolk") {
    includeTrident.value = true;
  }
  if (value === "Half-Dragon") {
    selectedDragonType.value = "Amethyst";
  }
});

</script>