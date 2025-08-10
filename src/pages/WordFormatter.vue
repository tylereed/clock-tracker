<template>
  <v-card flat>
    <v-textarea class="mx-5 mt-2" v-model="words" />
    <v-card-actions>
      <v-btn variant="elevated" color="primary" :loading="loading" @click="formatText()">Format</v-btn>
      <v-btn variant="elevated" @click="openCustomWords()">Add Custom Words</v-btn>
      <v-btn variant="elevated" @click="importCustomMonster()">Import Custom Monster</v-btn>
    </v-card-actions>
  </v-card>
  <v-dialog v-model="showCustomWords">
    <v-card>
      <v-card-title>
        Custom Words
      </v-card-title>
      <v-card-text>
        <v-textarea class="mx-5 mt-2" v-model="customWords" />
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog v-model="showEditCustomMonster" width="50%" min-width="400px">
    <add-edit-initiative class="pa-2 ma-6" :monster-stats="customMonster" @add-init="saveCustom"
      @close="showEditCustomMonster = false" />
  </v-dialog>
</template>

<script setup lang="ts">
import Initiative from '@/types/Initiative';
import formatParagraph from '@/utils/wordParser';
import parseCustomMonster, { StatBlock } from '@/utils/statblockParser';
import { useStorage } from '@vueuse/core';
import { ref } from 'vue';
import { useToast } from 'vue-toast-notification';

import AddEditInitiative from '@/components/initiative/AddEditInitiative.vue';
import { stat } from 'fs';

const words = ref("");
const loading = ref(false);

async function formatText() {
  const custom = customWords.value.split(/\s+/);
  try {
    loading.value = true;
    words.value = await formatParagraph(words.value, custom);
  } finally {
    loading.value = false;
  }
}

const showCustomWords = ref(false);
const customWords = useStorage("customWordsFormatter", "");
function openCustomWords() {
  showCustomWords.value = true;
}

const customMonsters = useStorage("customMonsters", [] as Initiative[]);
const customMonster = ref<Initiative>();
const showEditCustomMonster = ref(false);
const toast = useToast();

function statBlockToInitiative(statBlock: StatBlock): Initiative {
  return {
    name: statBlock.name,
    order: 0,
    dex: statBlock.dex,
    ac: statBlock.ac,
    maxHp: statBlock.hitpoints,
    conditions: {},
    cr: statBlock.cr?.toString(),
    traits: statBlock.traits?.map(a => ({ name: a.name, desc: a.description })),
    actions: statBlock.actions?.map(a => ({ name: a.name, desc: a.description })),
    bonusActions: statBlock.bonusActions?.map(a => ({ name: a.name, desc: a.description })),
    legendaryActions: statBlock.legendaryActions?.map(a => ({ name: a.name, desc: a.description })),
    reactions: statBlock.reactions?.map(a => ({ name: a.name, desc: a.description })),
  };
}

function importCustomMonster() {
  const monster = parseCustomMonster(words.value);
  customMonster.value = statBlockToInitiative(monster);
  showEditCustomMonster.value = true;
}

function saveCustom(monster: Initiative) {
  customMonster.value = undefined;
  showEditCustomMonster.value = false;
  customMonsters.value.push(monster);
  toast.success("Saved Custom Monster!");
}

</script>