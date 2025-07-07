<!--
    Styles
-->

<style>

</style>



<!--
    Template
-->

<template>
  <section class="l-main wrapper py-8 mt-(--h-header)" :class="{ 'mb-(--h-download)': pending }">
    <slot />
  </section>
</template>



<!--
    Scripts
-->

<script setup>

  import { pending } from '#src/utils/loader.js'

</script>