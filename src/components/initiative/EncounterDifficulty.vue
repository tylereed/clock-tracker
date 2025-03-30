<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-select label="Party" v-model="selectedParty" :items="partyStore.names" />
      </v-col>
      <v-col>
        <v-select label="Monsters" v-model="selectedMonster" :items="monsterStore.names" />
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="isError" cols="12">
        <v-card>
          <v-card-title></v-card-title>
          <v-card-text>Error: {{ error }}</v-card-text>
        </v-card>
      </v-col>
      <template v-else>
        <v-col v-for="rating in difficulties">
          <v-card>
            <v-card-title>{{ rating.name }}</v-card-title>
            <v-card-text>
              <p>XP: {{ rating.value }}</p>
              <br />
              <template v-for="t in rating.thresholds">
                <p :class="{ bold: t.highlight }">{{ t.name }}: {{ t.value }}</p>
              </template>
            </v-card-text>
          </v-card>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<style lang="css">
p.bold {
  font-weight: bold;
}
</style>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { crToXp, MonsterNamePrefix, PartyNamePrefix } from "./encounterHelpers";
import { useGroupStoreNamed } from "@/stores/groups";
import { Initiatives } from "@/types/Initiative";

interface DifficultyRating {
  name: string;
  difficulty: string;
  value: number;
  thresholds: { name: string; value: number; highlight: boolean }[]
}

const partyStore = useGroupStoreNamed(PartyNamePrefix);
const monsterStore = useGroupStoreNamed(MonsterNamePrefix);

const error = ref<string | null>(null);
const isError = computed(() => error.value != null);
const difficulties = ref<DifficultyRating[]>([]);

const selectedParty = ref<string>();
const selectedMonster = ref<string>();

watch([selectedParty, selectedMonster], ([newParty, newMonster]) => {
  const result = calculateDifficulty(newParty, newMonster);
  if ("error" in result) {
    error.value = result.error;
    difficulties.value = [];
    return;
  }

  error.value = null;
  difficulties.value = result;
});


const easy5e14 = [25, 50, 75, 125, 250, 300, 350, 450, 550, 600, 800, 1000, 1100, 1250, 1400, 1600, 2000, 2100, 2400, 2800];
const medium5e14 = [50, 100, 150, 250, 500, 600, 750, 900, 1100, 1200, 1600, 2000, 2200, 2500, 2800, 3200, 3900, 4200, 4900, 5700];
const hard5e14 = [75, 150, 225, 375, 750, 900, 1100, 1400, 1600, 1900, 2400, 3000, 3400, 3800, 4300, 4800, 5900, 6300, 7300, 8500];
const deadly5e14 = [100, 200, 400, 500, 1100, 1400, 1700, 2100, 2400, 2800, 3600, 4500, 5100, 5700, 6400, 7200, 8800, 9500, 10900, 12700];

const low5e24 = [50, 100, 150, 250, 500, 600, 750, 1000, 1300, 1600, 1900, 2200, 2600, 2900, 3300, 3800, 4500, 5000, 5500, 6400];
const moderate5e24 = [75, 150, 225, 375, 750, 1000, 1300, 1700, 2000, 2300, 2900, 3700, 4200, 4900, 5400, 6100, 7200, 8700, 10700, 13200];
const high5e24 = [100, 200, 400, 500, 1100, 1400, 1700, 2100, 2600, 3100, 4100, 4700, 5400, 6200, 7800, 9800, 11700, 14200, 17200, 22000];

function calc5e2014(party: Initiatives, monsters: Initiatives): DifficultyRating {

  const indexes = party.map(p => p.level! - 1);
  const easyFloor = indexes.map(i => easy5e14[i]).reduce((x, y) => x + y, 0);
  const mediumFloor = indexes.map(i => medium5e14[i]).reduce((x, y) => x + y, 0);
  const hardFloor = indexes.map(i => hard5e14[i]).reduce((x, y) => x + y, 0);
  const deadlyFloor = indexes.map(i => deadly5e14[i]).reduce((x, y) => x + y, 0);

  const xp = monsters.map(m => m.cr!).map(crToXp).reduce((x, y) => x + y, 0);

  let difficulty: string = "N/A";
  if (xp >= deadlyFloor) difficulty = "deadly";
  else if (xp >= hardFloor) difficulty = "hard";
  else if (xp >= mediumFloor) difficulty = "medium";
  else if (xp >= easyFloor) difficulty = "easy";

  return {
    name: "5e 2014",
    difficulty: difficulty,
    value: xp,
    thresholds: [
      { name: "easy", value: easyFloor, highlight: difficulty === "easy" },
      { name: "medium", value: mediumFloor, highlight: difficulty === "medium" },
      { name: "hard", value: hardFloor, highlight: difficulty === "hard" },
      { name: "deadly", value: deadlyFloor, highlight: difficulty === "deadly" },
    ]
  }
}

function calc5e2024(party: Initiatives, monsters: Initiatives): DifficultyRating {

  const indexes = party.map(p => p.level! - 1);
  const lowCeiling = indexes.map(i => low5e24[i]).reduce((x, y) => x + y, 0);
  const moderateCeiling = indexes.map(i => moderate5e24[i]).reduce((x, y) => x + y, 0);
  const highCeiling = indexes.map(i => high5e24[i]).reduce((x, y) => x + y, 0);

  const xp = monsters.map(m => m.cr!).map(crToXp).reduce((x, y) => x + y, 0);

  let difficulty: string = "N/A";
  if (xp <= lowCeiling) difficulty = "low";
  else if (xp <= moderateCeiling) difficulty = "moderate";
  else if (xp <= highCeiling) difficulty = "high";

  return {
    name: "5e 2024",
    difficulty: difficulty,
    value: xp,
    thresholds: [
      { name: "low", value: lowCeiling, highlight: difficulty === "low" },
      { name: "moderate", value: moderateCeiling, highlight: difficulty === "moderate" },
      { name: "high", value: highCeiling, highlight: difficulty === "high" },
    ]
  }
}

function calculateDifficulty(partyName?: string, monsterName?: string): DifficultyRating[] | { error: string } {

  const party = partyStore.getInitiative(partyName);
  const monsters = monsterStore.getInitiative(monsterName);

  if (!party?.length || !monsters?.length) {
    return { error: "Unable to calculate encounter rating" };
  }

  const partyValid = party?.reduce((r, p) => r && p.level != null, true) ?? false;
  const monstersValid = monsters?.reduce((r, m) => r && m.cr != null, true) ?? false;

  if (!partyValid || !monstersValid) {
    return { error: "Unable to calculate encounter rating" };
  }

  const difficulty5e14 = calc5e2014(party, monsters);
  const difficulty5e24 = calc5e2024(party, monsters);

  return [difficulty5e14, difficulty5e24];
}

</script>