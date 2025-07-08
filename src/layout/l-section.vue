<!--
    Styles
-->

<style>

</style>



<!--
    Template
-->

<template>
  <section class="l-main wrapper py-8 mt-(--h-header)" :class="{ 'mb-(--h-download)': loader.queue.length }">
    <slot />
  </section>
</template>



<!--
    Scripts
-->

<script setup>

  import loader from '#src/utils/loader.js'

</script>