<template>
  <v-app>
    <v-main>
      <!-- <timer />
      <clocks />
      <encounters />

      <dark-mode-toggle class="position-absolute top-0 right-0 mr-3" /> -->

      <v-textarea v-model="text" />
      <v-btn @click="parse">Parse</v-btn>

      <v-textarea v-model="succeeded" />

      <v-textarea v-model="failed" />
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
import { forOfStatement } from "@babel/types";
import { fail } from "assert";
import ActionListener from "./listeners/ActionListener";
import { parse as parseAttack } from "@/utils/Attack";

const text = ref("Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 12 (2d6 + 5) piercing damage.");
const succeeded = ref("");
const failed = ref("");


function parse() {
  succeeded.value = "";
  failed.value = "";

  for (let s of text.value.split("\n")) {
    const action = parseAttack(s);
    if (action) {
      succeeded.value += s + "\n\n";
    } else {
      failed.value += s + "\n\n";
    }
  }
}

clearCaches();


</script>