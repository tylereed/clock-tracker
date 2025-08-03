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
</template>

<script setup lang="ts">
import formatParagraph from '@/utils/wordParser';
import parseCustomMonster from '@/utils/statblockParser';
import { useStorage } from '@vueuse/core';
import { ref } from 'vue';

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

function importCustomMonster() {
  const customMonster = parseCustomMonster(words.value);
}

</script>