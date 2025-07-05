<!--
    Template
-->

<template>
    <l-header />
    <main class="wrapper mt-20 mb-24 py-8">
      <router-view />
    </main>
    <l-download />
</template>



<!--
    Script
-->

<script setup>

  import LHeader from '#src/components/l-header.vue'
  import LDownload from '#src/components/l-download.vue'

</script>
