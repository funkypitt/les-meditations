<!--
    Template
-->

<template>
  <header class="l-error flex p-4 fixed inset-0 bg-black/75" v-if="state.error">
    <div class="tile bg-white m-auto w-full max-w-sm">
      <p class="text-lg mb-2">{{ state.error.message }}</p>
      <p class="text-sm text-gray mb-4 wrap-break-word">{{ state.error.stack }}</p>
      <button class="block ml-auto bg-blue text-white px-4 py-2 rounded-sm" @click="state.error = false">OK</button>
    </div>
  </header>
</template>



<!--
    Scripts
-->

<script setup>

  import { inject } from 'vue'

  const state = inject('state');

</script>