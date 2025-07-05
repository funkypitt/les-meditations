<!--
    Template
-->

<style>



</style>



<!--
    Template
-->

<template>
  <router-link v-for="{ slug, name, recordings } in categories" class="tile" :to="{ name: 'category', params: { slug }}">
    <h2 class="text-lg text-sky-600">{{ name }}</h2>
    <p class="text-sm text-slate-600">{{ recordings.length }} enregistrements</p>
  </router-link>

  <div class="h-px bg-slate-300 my-8" />

  <a class="tile">
    <h2 class="text-lg text-sky-600">Téléchargements</h2>
    <p class="text-sm text-slate-600">10 enregistrements</p>
  </a>

</template>



<!--
    Scripts
-->

<script setup>

  import { useHeader } from '#src/store.js'
  import categories from '#src/config/categories.js'

  useHeader({
    title: 'Méditations guidées',
    note: 'd\'enpleineconscience.ch'
  })

</script>