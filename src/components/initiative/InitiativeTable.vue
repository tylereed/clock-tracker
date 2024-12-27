<template>
  <v-container class="init-table" fluid>
    <v-row class="font-weight-bold" dense>
      <v-col v-if="hasTurnOrder">Round {{ round }}</v-col>
      <v-col v-if="hasInitiative">Initiative</v-col>
      <v-col v-if="hasDex">Dex</v-col>
      <v-col cols="3" v-if="hasName">Name</v-col>
      <v-col v-if="hasAc">AC</v-col>
      <v-col v-if="hasMaxHp">Max HP</v-col>
      <v-col v-if="hasHp">HP</v-col>
      <v-col v-if="hasConditions" cols="3">Conditions</v-col>
      <v-col cols="1"></v-col>
    </v-row>
    <v-row align="center" v-for="(init, i) in initiatives" :key="i" :class="getRowClass(i)" dense>
      <v-col v-if="hasTurnOrder" text-align="center"><v-icon v-show="i === turn" icon="mdi-circle-medium" /></v-col>
      <v-col v-if="hasInitiative">
        <v-text-field :hide-details="true" density="compact" v-model="init.order" :rules="r.OrderRules"
          @update:focused="(focused) => updateUndoRedo(i, 'order', focused)" @keyup.enter.stop="nextRow($event)" />
      </v-col>
      <v-col v-if="hasDex">
        <v-text-field :hide-details="true" density="compact" v-model="init.dex" :rules="r.DexRules"
          @update:focused="(focused) => updateUndoRedo(i, 'dex', focused)" @keyup.enter.stop="nextRow($event)" />
      </v-col>
      <v-col cols="3" v-if="hasName">
        <v-text-field :hide-details="true" density="compact" v-model="init.name" :rules="r.NameRules"
          @update:focused="(focused) => updateUndoRedo(i, 'name', focused)" @keyup.enter.stop="nextRow($event)" />
      </v-col>
      <v-col v-if="hasAc">
        <v-text-field :hide-details="true" density="compact" v-model="init.ac" :rules="r.AcRules"
          @update:focused="(focused) => updateUndoRedo(i, 'ac', focused)" @keyup.enter.stop="nextRow($event)" />
      </v-col>
      <v-col v-if="hasMaxHp">
        <v-text-field :hide-details="true" density="compact" v-model="init.maxHp" :rules="r.MaxHpRules"
          @update:focused="(focused) => updateUndoRedo(i, 'maxHp', focused)" @keyup.enter.stop="nextRow($event)" />
      </v-col>
      <v-col v-if="hasHp">
        <v-menu location="end center" :close-on-content-click="false" :open-on-focus="true" :offset="2">
          <template v-slot:activator="{ props }">
            <v-text-field v-bind="props" :hide-details="true" density="compact" v-model="init.hp" :rules="[validateHp]"
              @update:focused="(focused) => handleHpChange(i, focused)" @keyup.enter.stop="nextRow($event)" />
          </template>
          <v-card>
            <div align="center" class="ma-2">
              <v-btn class="ma-1" variant="outlined" color="primary" prepend-icon="mdi-flask"
                @click="changeHealth(i, '+')" :disabled="!healAndDamageValid" tabindex="-1">Heal</v-btn>
              <v-text-field class="ma-1" density="compact" v-model="hpChange" hide-details="auto"
                :rules="[validateHpChange]" tabindex="-1" />
              <v-btn class="ma-1" variant="outlined" color="error" prepend-icon="mdi-bandage"
                @click="changeHealth(i, '-')" :disabled="!healAndDamageValid" tabindex="-1">Damage</v-btn>
            </div>
          </v-card>
        </v-menu>
      </v-col>
      <v-col v-if="hasConditions" cols="3">
        <conditions-vue v-bind="init.conditions" @apply-condition="name => emit('applyCondition', i, name)"
          @remove-condition="name => emit('removeCondition', i, name)" />
      </v-col>
      <v-col cols="1">
        <show-stats class="mr-1" v-if="init.open5eId" :id="init.open5eId" style="background-color: transparent" />
        <v-btn icon @click.stop="emit('deleteInitiative', i)" style="background-color: transparent">
          <v-icon icon="mdi-delete-forever" color="error" />
        </v-btn>
      </v-col>
      <v-col cols="12" v-if="init.actions?.length || init.bonusActions?.length" v-show="i === turn">
        <template v-if="init.actions?.length">
          <p><b>Actions</b></p>
          <p v-for="attack in init.actions">
            <b>{{ attack.name }}</b> {{ attack.desc }}
          </p>
        </template>
        <template v-if="init.bonusActions?.length">
          <p><b>Bonus Actions</b></p>
          <p v-for="bonus in init.bonusActions">
            <b>{{ bonus.name }}</b> {{ bonus.desc }}
          </p>
        </template>
      </v-col>
      <v-col cols="12" v-if="init.reactions?.length" v-show="i !== turn">
        <p><b>Reactions</b></p>
        <p v-for="reaction in init.reactions">
          <b>{{ reaction.name }}</b> {{ reaction.desc }}
        </p>
      </v-col>
      <v-col cols="12" v-if="init.saves" v-show="i !== turn">
        <v-row>
          <v-col><b>Saves</b></v-col>
          <v-col><b>STR</b>:&nbsp;{{ init.saves.str }}</v-col>
          <v-col><b>DEX</b>:&nbsp;{{ init.saves.dex }}</v-col>
          <v-col><b>CON</b>:&nbsp;{{ init.saves.con }}</v-col>
          <v-col><b>INT</b>:&nbsp;{{ init.saves.int }}</v-col>
          <v-col><b>WIS</b>:&nbsp;{{ init.saves.wis }}</v-col>
          <v-col><b>CHA</b>:&nbsp;{{ init.saves.cha }}</v-col>
          <v-col cols="5" />
        </v-row>
      </v-col>
      <v-col cols="12" v-if="init.traits?.length">
        <p>
          <b>Traits</b>
          <v-chip v-for="trait in init.traits" size="small" class="mx-1" v-tooltip:bottom="trait.desc">{{ trait.name
            }}</v-chip>
        </p>
      </v-col>
      <v-col cols="12" v-if="init.legendaryActions?.length" v-show="i !== turn">
        <p><b>Legendary Actions</b></p>
        <p v-for="legendary in init.legendaryActions">
          <b>{{ legendary.name }}</b> {{ legendary.desc }}
        </p>
      </v-col>
    </v-row>
    <v-row v-show="hasTurnOrder">
      <v-col><v-btn @click="emit('decrementTurn')" :disabled="turn === 0 && round === 1">Previous</v-btn></v-col>
      <v-col><v-btn @click="emit('incrementTurn')" :disabled="initiatives.length === 0">Next</v-btn></v-col>
      <v-col><v-btn @click="emit('resetTurn')">Reset</v-btn></v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.alternate-row {
  background: #c2cdd2;
}

.alternate-row-dark {
  background: #424242;
}
</style>

<script setup lang="ts">
import { computed, ref, toRefs } from "vue";
import ConditionsVue from "@/components/initiative/Conditions.vue";
import { useTheme } from "vuetify";

import ShowStats from "./ShowStats.vue";

import Conditions from "@/types/Conditions";
import { findSibling, findPreviousSibling } from "@/utils/helpers";
import Initiative, { InitiativeColumns, Initiatives } from "@/types/Initiative";
import r from "@/components/initiative/InitiativeRules";

import * as v from "@/utils/validators";
const vTheme = useTheme();

const props = defineProps<{
  initiatives: Initiatives,
  turn?: number,
  round?: number,
  columns: InitiativeColumns
}>();
const { initiatives, turn, round, columns } = toRefs(props);
const { hasInitiative, hasDex, hasName, hasAc, hasMaxHp, hasHp, hasConditions } = columns.value;
const hasTurnOrder = computed(() => turn.value != null && round.value != null);

const emit = defineEmits<{
  applyCondition: [id: number, name: keyof Conditions],
  removeCondition: [id: number, name: keyof Conditions],
  addInitiative: [],
  deleteInitiative: [id: number],
  incrementTurn: [],
  decrementTurn: [],
  resetTurn: [],
  insertInitCommand: [index: number, propName: keyof Initiative, newValue: any, oldValue: any],
}>();

function getRowClass(index: number) {
  const classes = ["init-row", "border-background", "border-t-md"];

  if (index % 2 === 1) {
    if (vTheme.current.value.dark) {
      classes.push("alternate-row-dark");
    }
    classes.push("alternate-row");
  }

  if (index === turn.value) {
    classes.push("elevation-10");
  }

  return classes;
}

const oldValues = new Map<string, any>();
function updateUndoRedo(index: number, propName: keyof Initiative, focused: boolean) {
  if (focused) {
    const value = initiatives.value[index][propName];
    if (value !== "") {
      oldValues.set(propName + index, value);
    }
  } else {
    const newValue = initiatives.value[index][propName];
    const oldValue = oldValues.get(propName + index);
    emit("insertInitCommand", index, propName, newValue, oldValue);
  }
}

function nextRow(event: KeyboardEvent) {
  const forward = !event.getModifierState("Shift");
  const textfield = event.target as HTMLElement;
  const parentRow = textfield.closest(".init-row") as HTMLElement;

  if (forward) {
    const nextRow = findSibling(parentRow, ".init-row") ?? parentRow?.closest(".init-table")?.querySelector(".init-row");
    const nextInit = nextRow?.querySelector("input");
    if (nextInit) {
      nextInit.focus();
    }
  } else {
    let previousRow = findPreviousSibling(parentRow, ".init-row");
    if (!previousRow) {
      const table = parentRow?.closest(".init-table");
      const allRows = table?.querySelectorAll(".init-row");
      if (allRows && allRows.length > 1) {
        previousRow = allRows[allRows.length - 1] as HTMLElement;
      }
    }
    const previousInit = previousRow?.querySelector("input");
    if (previousInit) {
      previousInit.focus();
    }
  }
}


const hpChange = ref(0);
const hpValid = ref(true);
const hpChangeValid = ref(true);
const healAndDamageValid = computed(() => hpValid.value && hpChangeValid.value);

function validateHp(value: string) {
  return v.validate(hpValid, value, ...r.HpRules);
}

function validateHpChange(value: string) {
  return v.validate(hpChangeValid, value, v.isRequiredRule, v.isWholeNumber);
}

function changeHealth(index: number, type: "+" | "-") {
  const change = +hpChange.value;
  const oldValue = +(initiatives.value[index].hp ?? 0);
  const newValue = type === "+" ?
    Math.min(oldValue + change, initiatives.value[index].maxHp || Number.MAX_SAFE_INTEGER) :
    Math.max(oldValue - change, 0);
  initiatives.value[index].hp = newValue;
  hpChange.value = 0;
  emit("insertInitCommand", index, "hp", newValue, oldValue);
}

function handleHpChange(index: number, focused: boolean) {
  if (focused) {
    updateUndoRedo(index, 'hp', focused);
    hpChange.value = 0;
  } else {
    const sNewValue = initiatives.value[index].hp as unknown as string | undefined;
    const maybeSymbol = sNewValue?.charAt(0);
    if (maybeSymbol === "+" || maybeSymbol === "-") {
      const change = +(sNewValue ?? 0);
      const oldValue = +oldValues.get("hp" + index);
      const newValue = maybeSymbol === "+" ?
        Math.min(oldValue + change, initiatives.value[index].maxHp || Number.MAX_SAFE_INTEGER) :
        Math.max(oldValue + change, 0);
      initiatives.value[index].hp = newValue;
      emit("insertInitCommand", index, "hp", newValue, oldValue);
    } else {
      updateUndoRedo(index, 'hp', focused);
    }
    hpChange.value = 0;
  }
}

</script>