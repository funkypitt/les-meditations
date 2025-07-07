<!--
    Template
-->

<template>
  <header class="l-error flex p-4 fixed inset-0 bg-black/75" v-if="state.error">
    <div class="tile bg-white m-auto w-full max-w-sm">
      <p class="text-lg mb-2">{{ state.error.message }}</p>
      <p class="text-sm text-gray mb-4 wrap-break-word">{{ state.error.stack }}</p>
      <ui-button class="ml-auto" text="OK" @click="state.error = false" />
    </div>
  </header>
</template>



<!--
    Scripts
-->

<script setup>

  import { inject } from 'vue'
  import UiButton from '#src/ui/ui-button.vue'

  const state = inject('state');

</script>