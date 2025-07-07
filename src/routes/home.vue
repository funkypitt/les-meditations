<!--
    Template
-->

<template>
  <l-header title="Méditations guidées" note="d'enpleineconscience.ch" />
  <l-section>

    <div>
      <button class="block mx-auto bg-blue text-white px-4 py-2 rounded-sm">Installer l'app sur votre smartphone</button>
      <div class="h-px bg-slate-300 my-8" />
    </div>

    <router-link v-for="{ slug, name } in categories" class="tile" :to="{ name: 'category', params: { slug }}">
      <p class="text-lg text-blue">{{ name }}</p>
    </router-link>

    <div class="h-px bg-slate-300 my-8" />

    <router-link class="tile" :to="{ name: 'downloads' }">
      <p class="text-lg text-blue">Téléchargements</p>
      <p class="text-sm text-gray">10 enregistrements</p>
    </router-link>

  </l-section>
</template>



<!--
    Scripts
-->

<script setup>

  import LHeader from '#src/layout/l-header.vue'
  import LSection from '#src/layout/l-section.vue'
  import categories from '#src/config/categories.js'

</script>