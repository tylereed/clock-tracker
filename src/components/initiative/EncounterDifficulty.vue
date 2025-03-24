<template>

</template>

<script setup lang="ts">
import { ref } from "vue";
import { MonsterNamePrefix, PartyNamePrefix } from "./encounterHelpers";

const party = ref(PartyNamePrefix);
const monster = ref(MonsterNamePrefix);

</script>