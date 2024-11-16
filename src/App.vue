<template>
  <v-app>
    <v-main>
      <!-- <timer />
      <clocks />
      <encounters />

      <dark-mode-toggle class="position-absolute top-0 right-0 mr-3" /> -->

      <v-textarea v-model="text" />
      <v-btn @click="parse">Parse</v-btn>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import Clocks from "@/pages/Clocks.vue";
import Timer from "@/pages/Timers.vue";
import Encounters from "@/pages/Encounters.vue";
import DarkModeToggle from "@/components/DarkModeToggle.vue";

import { clearCaches } from "@/utils/Cache";


import AttackParser from "./generated/parsers/AttackParser";
import AttackLexer from "./generated/parsers/AttackLexer";
import AttackListener from "./generated/parsers/AttackListener";
import { ref } from "vue";
import { CharStream, CommonTokenStream, ParseTreeWalker } from "antlr4";
import RollLexer from "./generated/parsers/RollLexer";
import RollParser from "./generated/parsers/RollParser";
import HealthListener from "./listeners/HealthListener";

const text = ref("Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 12 (2d6 + 5) piercing damage.");

function parse() {
  const chars = new CharStream(text.value, true);
  const lexer = new AttackLexer(chars);
  const tokens = new CommonTokenStream(lexer);
  const parser = new AttackParser(tokens);

  const tree = parser.attack();
  const listener = new AttackListener();

  try {
    ParseTreeWalker.DEFAULT.walk(listener, tree);
  } catch (e) {
    console.error(e);
    return;
  }
}

clearCaches();


</script>