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
    <v-row align="center" v-for="(init, i) in initiatives" :key="i" :class="getRowClass(i) + ' init-row'" dense
      style="border-top: 1px solid darkgray;">
      <v-col v-if="hasTurnOrder" text-align="center"><v-icon v-show="i === turn" icon="mdi-circle-medium" /></v-col>
      <v-col v-if="hasInitiative">
        <v-text-field :hide-details="true" density="compact" v-model="init.order" :rules="r.OrderRules"
          @update:focused="(focused) => updateUndoRedo(i, 'order', focused)" @keyup.enter.stop="nextRow($event)" />
      </v-col>
      <v-col v-if="hasDex">
        <v-text-field :hide-details="true" density="compact" v-model="init.dex" :rules="r.DexRules"
          @update:focused="(focused) => updateUndoRedo(i, 'dex', focused)" @keyup.enter.stop="nextRow($event)" />
      </v-col>
      <v-col cols="3" v-if="hasName"><v-text-field :hide-details="true" density="compact" v-model="init.name"
          :rules="r.NameRules" @update:focused="(focused) => updateUndoRedo(i, 'name', focused)"
          @keyup.enter.stop="nextRow($event)" /></v-col>
      <v-col v-if="hasAc"><v-text-field :hide-details="true" density="compact" v-model="init.ac" :rules="r.AcRules"
          @update:focused="(focused) => updateUndoRedo(i, 'ac', focused)" @keyup.enter.stop="nextRow($event)" /></v-col>
      <v-col v-if="hasMaxHp"><v-text-field :hide-details="true" density="compact" v-model="init.maxHp"
          :rules="r.MaxHpRules" @update:focused="(focused) => updateUndoRedo(i, 'maxHp', focused)"
          @keyup.enter.stop="nextRow($event)" /></v-col>
      <v-col v-if="hasHp">
        <v-menu location="end center" :close-on-content-click="false" :open-on-focus="true" :offset="2">
          <template v-slot:activator="{ props }">
            <v-text-field v-bind="props" :hide-details="true" density="compact" v-model="init.hp" :rules="[validateHp]"
              @update:focused="(focused) => { updateUndoRedo(i, 'hp', focused); hpChange = 0; }"
              @keyup.enter.stop="nextRow($event)" />
          </template>
          <v-card>
            <div align="center" class="ma-2">
              <v-btn class="ma-1" variant="outlined" color="primary" prepend-icon="mdi-flask"
                @click="changeHealth(i, '+')" :disabled="!healAndDamageValid">Heal</v-btn>
              <v-text-field class="ma-1" density="compact" v-model="hpChange" hide-details="auto"
                :rules="[validateHpChange]" />
              <v-btn class="ma-1" variant="outlined" color="error" prepend-icon="mdi-bandage"
                @click="changeHealth(i, '-')" :disabled="!healAndDamageValid">Damage</v-btn>
            </div>
          </v-card>
        </v-menu>
      </v-col>
      <v-col v-if="hasConditions" cols="3">
        <conditions-vue v-bind="init.conditions" @apply-condition="name => emit('applyCondition', i, name)"
          @remove-condition="name => emit('removeCondition', i, name)" />
      </v-col>
      <v-col cols="1">
        <v-btn @click.stop="emit('deleteInitiative', i)" :class="getRowClass(i)">
          <v-icon icon="mdi-delete-forever" color="error" />
        </v-btn>
      </v-col>
      <v-col cols="12" v-show="i === turn && init.actions">
        <p v-for="attack in init.actions">
          <b>{{ attack.name }}</b> {{ attack.desc }}
        </p>
      </v-col>
    </v-row>
    <v-row v-if="hasTurnOrder">
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
  if (index % 2 === 1) {
    if (vTheme.current.value.dark) {
      return "alternate-row-dark";
    }
    return "alternate-row";
  }
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

</script>