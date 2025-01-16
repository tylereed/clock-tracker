<template>

</template>

<script setup lang="ts">
import { ref } from "vue";
import { usePrefixes, PartyNamePrefix, MonsterNamePrefix } from "./encounterHelpers";

const party = ref(PartyNamePrefix);
const monster = ref(MonsterNamePrefix);
const { GroupNamePrefix: PartyPrefix, FullPrefix: PartyFullPrefix } = usePrefixes(party);
const { GroupNamePrefix: MonsterPrefix, FullPrefix: MonsterFullPrefix } = usePrefixes(monster);
</script>