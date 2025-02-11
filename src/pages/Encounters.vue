<template>
  <v-card flat>
    <v-card-item>
      <v-card-title>
        <v-tabs v-model="selectedTab">
          <v-tab value="Initiative">Initiative</v-tab>
          <v-tab value="Party">Manage Party</v-tab>
          <v-tab value="Monsters">Manage Monsters</v-tab>
        </v-tabs>
      </v-card-title>
    </v-card-item>
    <v-card-text>
      <v-tabs-window v-model="selectedTab">
        <v-tabs-window-item value="Initiative">
          <initiative-tracker ref="tracker" />
        </v-tabs-window-item>
        <v-tabs-window-item value="Party">
          <manage-party @send-to-initiative="addParty" />
        </v-tabs-window-item>
        <v-tabs-window-item value="Monsters">
          <manage-monsters @send-to-initiative="addMonsters" />
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useStorage } from "@vueuse/core";

import InitiativeTracker from "./InitiativeTracker.vue";
import ManageParty from "./ManageParty.vue";
import ManageMonsters from "./ManageMonsters.vue";

import { Initiatives } from "@/types/Initiative";

type TabTypes = "Initiative" | "Party" | "Monsters";
const selectedTab = useStorage<TabTypes>("encounter-selectedTab", "Initiative", sessionStorage);

const tracker = ref<{ insertInitiatives: (inits: Initiatives, clear?: boolean) => void }>();

function addParty(inits: Initiatives) {
  tracker.value?.insertInitiatives(inits);
  selectedTab.value = "Initiative";
}

function addMonsters(inits: Initiatives) {
  tracker.value?.insertInitiatives(inits, false);
  selectedTab.value = "Initiative";
}
</script>