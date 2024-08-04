<template>
  <v-card class="ma-2">
    <v-card-title>
      Monster data uses the Open5e API. Content is licensed by the respective owners through the OGL.
    </v-card-title>
    <v-card-text>
      <template v-for="license in licenses">
        <v-card flat class="mb-5"><v-chip>{{ license.slug }}</v-chip> {{ license.copyright }} <a
            :href="license.url">Website</a></v-card>
      </template></v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const licenses = [
  {
    slug: "cc",
    copyright: "Creature Codex. © 2018 Open Design LLC; Authors Wolfgang Baur, Dan Dillon, Richard Green, James Haeck, Chris Harris, Jeremy Hochhalter, James Introcaso, Chris Lockey, Shawn Merwin, and Jon Sawatsky.",
    url: "https://koboldpress.com/kpstore/product/creature-codex-for-5th-edition-dnd/"
  },
  {
    slug: "menagerie",
    copyright: "Level Up: Advanced 5th Edition Monstrous Menagerie. Copyright 2021, EN Publishing.",
    url: "https://www.levelup5e.com"
  },
  {
    slug: "taldorei",
    copyright: "Critical Role: Tal’Dorei Campaign Setting is ©2017 Green Ronin Publishing, LLC. All rights reserved.",
    url: "https://greenronin.com/blog/2017/09/25/ronin-round-table-integrating-wizards-5e-adventures-with-the-taldorei-campaign-setting/"
  },
  {
    slug: "tob",
    copyright: "Tome of Beasts. Copyright 2016, Open Design; Authors Chris Harris, Dan Dillon, Rodrigo Garcia Carmona, and Wolfgang Baur.",
    url: "https://koboldpress.com/kpstore/product/tome-of-beasts-for-5th-edition-print/"
  },
  {
    slug: "tob-2023",
    copyright: "Tome of Beasts. 2023 Open Design LLC. All rights reserved.",
    url: "https://koboldpress.com/kpstore/product/tome-of-beasts-1-2023-edition/"
  },
  {
    slug: "tob2",
    copyright: "Tome of Beasts 2. Copyright 2020 Open Design LLC; Authors Wolfgang Baur, Celeste Conowitch, Darrin Drader, James Introcaso, Philip Larwood, Jeff Lee, Kelly Pawlik, Brian Suskind, Mike Welham.",
    url: "https://koboldpress.com/kpstore/product/tome-of-beasts-2-for-5th-edition/"
  },
  {
    slug: "tob3",
    copyright: "Tome of Beasts 3. ©2022 Open Design LLC. All rights reserved.",
    url: "https://koboldpress.com/kpstore/product/tome-of-beasts-3-for-5th-edition/"
  },
  {
    slug: "wotc-srd",
    copyright: "System Reference Document 5.1 Copyright 2016, Wizards of the Coast, Inc.; Authors Mike Mearls, Jeremy Crawford, Chris Perkins, Rodney Thompson, Peter Lee, James Wyatt, Robert J. Schwalb, Bruce R. Cordell, Chris Sims, and Steve Townshend, based on original material by E. Gary Gygax and Dave Arneson.",
    url: "http://dnd.wizards.com/articles/features/systems-reference-document-srd"
  }
];
</script>