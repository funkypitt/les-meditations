<!--
    Template
-->

<template>
  <header class="l-header overlay top-0 h-(--h-header)">
    <div class="wrapper flex items-center">

      <ui-action v-if="back" :to="back" :icon="IconBack" />
      <img v-else class="h-12 w-12" src="/logo.png">

      <div class="ml-2">
        <h1 class="text-lg font-normal">{{ title }}</h1>
        <p class="text-sm text-gray" v-if="note">{{ note }}</p>
      </div>

      <div class="ml-auto">
        <icon-online v-if="isOnline" class="icon" />
        <icon-offline v-else class="icon" />
      </div>

    </div>
  </header>
</template>



<!--
    Scripts
-->

<script setup>

  import { ref, onMounted, onUnmounted } from 'vue'
  import UiAction from '#src/ui/ui-action.vue'
  import IconBack from '#src/icons/back.svg'
  import IconOnline from '#src/icons/online.svg'
  import IconOffline from '#src/icons/oflline.svg'

  defineProps([
    'title',
    'note',
    'back'
  ])

  const isOnline = ref(navigator.onLine);

  function setOnline () {
    isOnline.value = navigator.onLine;
  }

  onMounted(() => {
    window.addEventListener('online', setOnline);
    window.addEventListener('offline', setOnline);
  })

  onUnmounted(() => {
    window.removeEventListener('online', setOnline);
    window.removeEventListener('offline', setOnline);
  })

</script>