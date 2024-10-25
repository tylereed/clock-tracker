<template>
  <v-card class="ma-2">
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
          <initiative-tracker :initiatives="encounter" @set-initiatives="updateEncounter" />
        </v-tabs-window-item>
        <v-tabs-window-item value="Party">
          <manage-party @send-to-initiative="addParty" />
        </v-tabs-window-item>
        <v-tabs-window-item value="Monsters">
          <manage-monsters />
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";

import InitiativeTracker from "./InitiativeTracker.vue";
import ManageParty from "./ManageParty.vue";
import ManageMonsters from "./ManageMonsters.vue";

import { Initiatives } from "@/types/Initiative";

type TabTypes = "Initiative" | "Party" | "Monsters";
const selectedTab = ref<TabTypes>("Initiative");

const encounter = ref<Initiatives>([]);

function updateEncounter(inits: Initiatives) {
  encounter.value = inits.sort((a, b) => b.order - a.order || (b.dex ?? 0) - (a.dex ?? 0));
}

function addParty(inits: Initiatives) {
  updateEncounter([...encounter.value, ...inits]);
}
</script>