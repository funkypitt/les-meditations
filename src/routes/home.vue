<!--
    Template
-->

<style scoped>

  .line {
    height: 1px;
    background: #cbd5e1;
    margin-block: 32px;
  }

</style>



<!--
    Template
-->

<template>

  <router-link v-for="{ slug, name } in categories" class="tile" :to="{ name: 'category', params: { slug }}">
    <h2 class="t-lg t-blue">{{ name }}</h2>
  </router-link>

  <div class="line" />

  <a class="tile">
    <h2 class="t-lg t-blue">Téléchargements</h2>
    <p class="t-sm t-gray">10 enregistrements</p>
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