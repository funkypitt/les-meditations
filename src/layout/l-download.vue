<!--
    Styles
-->

<style>

  .l-download.v-enter-active, .l-download.v-leave-active {
    transition: transform 0.3s ease;
  }
  .l-download.v-enter-from, .l-download.v-leave-to {
    transform: translateY(100%);
  }

</style>



<!--
    Template
-->

<template>
  <Transition>
    <aside class="l-download overlay bottom-0 h-(--h-download) py-4" v-if="loader.queue.length">
      <div class="wrapper flex flex-col">
        <p>Downloading {{ loader.queue.length }} item(s)</p>
        <p class="text-xs text-gray text-ellipsis overflow-hidden">{{ loader.active?.url }}</p>
        <ui-progress class="mt-auto" :value="loader.progress" />
      </div>
    </aside>
  </Transition>
</template>



<!--
    Scripts
-->

<script setup>

  import loader from '#src/utils/loader.js'
  import UiProgress from '#src/ui/ui-progress.vue'

</script>