<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-select label="Party" v-model="selectedParty" :items="partyStore.names" />
        <p v-for="p in partyLevels">Level {{ p.level }}: {{ p.count }}</p>
      </v-col>
      <v-col>
        <v-select label="Monsters" v-model="selectedMonster" :items="monsterStore.names" />
        <p v-for="m in monsterCrs">CR {{ m.cr }}: {{ m.count }}</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="isError" cols="12">
        <v-card>
          <v-card-text>Error: {{ error }}</v-card-text>
        </v-card>
      </v-col>
      <template v-else>
        <v-col v-for="rating in difficulties">
          <v-card>
            <v-card-title>{{ rating.name }}</v-card-title>
            <v-card-text>
              <p>{{ rating.valueName ?? "XP" }}: {{ rating.value }}</p>
              <br />
              <p v-for="t in rating.thresholds" :class="{ bold: t.highlight }">{{ t.name }}: {{ t.value }}</p>
              <br />
              <p v-if="rating.other?.length" v-for="o in rating.other" :class="{ bold: o.highlight }">{{ o.name }}: {{
                o.value }}</p>
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
import { crToIndex, crToXp, indexToCr, MonsterNamePrefix, PartyNamePrefix } from "./encounterHelpers";
import { useGroupStoreNamed } from "@/stores/groups";
import { Initiatives } from "@/types/Initiative";
import { stringToCr } from "./templates/utils";

interface Description {
  name: string;
  value: number | string;
  highlight?: boolean
}
interface DifficultyRating {
  name: string;
  difficulty: string;
  valueName?: string;
  value: number;
  thresholds: Description[],
  other?: Description[],
}

const partyStore = useGroupStoreNamed(PartyNamePrefix);
const monsterStore = useGroupStoreNamed(MonsterNamePrefix);

const error = ref<string | null>(null);
const isError = computed(() => error.value != null);
const difficulties = ref<DifficultyRating[]>([]);

const selectedParty = ref<string>();
const partyLevels = computed(() => {
  const party = partyStore.getInitiative(selectedParty.value);
  if (!party) return null;

  const levels = Array.from({ length: 20 }, () => 0);
  party.forEach(p => levels[p.level! - 1]++);
  return levels.map((count, index) => ({ count, level: index + 1 })).filter(p => p.count > 0)
});

const selectedMonster = ref<string>();
const monsterCrs = computed(() => {
  const monsters = monsterStore.getInitiative(selectedMonster.value);
  if (!monsters) return null;

  const crs = Array.from({ length: 34 }, () => 0);
  monsters.forEach(m => crs[crToIndex(m.cr!)]++);
  return crs.map((count, index) => ({ count, cr: indexToCr(index) })).filter(m => m.count > 0);
});

watch([selectedParty, selectedMonster], ([newParty, newMonster]) => updateCalculation(newParty, newMonster));

partyStore.$subscribe(() => updateCalculation(selectedParty.value, selectedMonster.value));

function updateCalculation(partyName?: string, monsterName?: string) {
  const result = calculateDifficulty(partyName, monsterName);
  if ("error" in result) {
    error.value = result.error;
    difficulties.value = [];
    return;
  }

  error.value = null;
  difficulties.value = result;
}


const easy5e14 = [25, 50, 75, 125, 250, 300, 350, 450, 550, 600, 800, 1000, 1100, 1250, 1400, 1600, 2000, 2100, 2400, 2800];
const medium5e14 = [50, 100, 150, 250, 500, 600, 750, 900, 1100, 1200, 1600, 2000, 2200, 2500, 2800, 3200, 3900, 4200, 4900, 5700];
const hard5e14 = [75, 150, 225, 375, 750, 900, 1100, 1400, 1600, 1900, 2400, 3000, 3400, 3800, 4300, 4800, 5900, 6300, 7300, 8500];
const deadly5e14 = [100, 200, 400, 500, 1100, 1400, 1700, 2100, 2400, 2800, 3600, 4500, 5100, 5700, 6400, 7200, 8800, 9500, 10900, 12700];

const low5e24 = [50, 100, 150, 250, 500, 600, 750, 1000, 1300, 1600, 1900, 2200, 2600, 2900, 3300, 3800, 4500, 5000, 5500, 6400];
const moderate5e24 = [75, 150, 225, 375, 750, 1000, 1300, 1700, 2000, 2300, 2900, 3700, 4200, 4900, 5400, 6100, 7200, 8700, 10700, 13200];
const high5e24 = [100, 200, 400, 500, 1100, 1400, 1700, 2100, 2600, 3100, 4100, 4700, 5400, 6200, 7800, 9800, 11700, 14200, 17200, 22000];

function getMultiplier2014(countMonsters: number) {
  if (countMonsters === 1) return 1;
  if (countMonsters === 2) return 1.5;
  if (countMonsters <= 6) return 2;
  if (countMonsters <= 10) return 2.5;
  if (countMonsters <= 14) return 3;
  return 4;
}
function calc5e2014(party: Initiatives, monsters: Initiatives): DifficultyRating {

  const indexes = party.map(p => p.level! - 1);
  const easyFloor = indexes.map(i => easy5e14[i]).reduce((x, y) => x + y, 0);
  const mediumFloor = indexes.map(i => medium5e14[i]).reduce((x, y) => x + y, 0);
  const hardFloor = indexes.map(i => hard5e14[i]).reduce((x, y) => x + y, 0);
  const deadlyFloor = indexes.map(i => deadly5e14[i]).reduce((x, y) => x + y, 0);

  const mult = getMultiplier2014(monsters.length);
  const totalXp = monsters.map(m => m.cr!).map(crToXp).reduce((x, y) => x + y, 0);
  const xp = totalXp * mult;

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
    ],
    other: [
      { name: "XP earned", value: totalXp },
      { name: "XP multiplier", value: mult }
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

function tier01Increase(cr: string) {
  if (cr === "0") return "1/8";
  if (cr === "1/8") return "1/8";
  if (cr === "1/4") return "1/4";
  if (cr === "1/2") return "1";
  return cr;
}
function calcA5e(party: Initiatives, monsters: Initiatives): DifficultyRating {
  const partyLevel = party.map(p => +p.level!).reduce((x, y) => x + y, 0);
  const averageLevel = partyLevel / party.length;

  const easyCr = partyLevel / 6;
  const mediumCr = partyLevel / 3;
  const hardCr = partyLevel / 2;
  const deadlyCr = partyLevel * 2 / 3;
  const impossibleCr = partyLevel;

  let crCalc = monsters.map(m => m.cr!);
  if (averageLevel <= 4) {
    crCalc = crCalc.map(tier01Increase);
  }
  const monsterCr = crCalc.map(stringToCr).reduce((x, y) => x + y, 0);

  const crLevels = ["easy", "medium", "hard", "deadly", "impossible"];
  const [_, minIndex] = [easyCr, mediumCr, hardCr, deadlyCr, impossibleCr].map(cr => Math.abs(monsterCr - cr))
    .reduce(([diff, index], currentDiff, currentIndex) => currentDiff < diff ? [currentDiff, currentIndex] : [diff, index], [Number.MAX_VALUE, -1]);
  const difficulty = crLevels[minIndex];

  const maxCr = averageLevel * 1.5;
  const strongMonsters = monsters.map(m => ({ name: m.name, cr: stringToCr(m.cr!) })).filter(m => m.cr > maxCr).map(m => m.name).join(", ");

  const other: Description[] = [{ name: "Maximum monster CR", value: Math.floor(maxCr) + 1, highlight: strongMonsters.length > 0 }];
  if (strongMonsters.length) {
    other.push({ name: "Impossible monsters", value: strongMonsters, highlight: true })
  }

  return {
    name: "A5E",
    difficulty: difficulty,
    valueName: "Encounter CR",
    value: monsterCr,
    thresholds: [
      { name: "easy", value: easyCr.toFixed(3), highlight: difficulty === "easy" },
      { name: "medium", value: mediumCr.toFixed(3), highlight: difficulty === "medium" },
      { name: "hard", value: hardCr.toFixed(3), highlight: difficulty === "hard" },
      { name: "deadly", value: deadlyCr.toFixed(3), highlight: difficulty === "deadly" },
      { name: "impossible", value: impossibleCr, highlight: difficulty === "impossible" },
    ],
    other: other
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
  const difficultya5e = calcA5e(party, monsters);

  return [difficulty5e14, difficulty5e24, difficultya5e];
}

</script>