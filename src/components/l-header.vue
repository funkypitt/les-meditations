<!--
    Template
-->

<template>
  <header class="l-header fixed w-full h-20 top-[0] left-[0] bg-white shadow-(--shadow)">
    <div class="wrapper h-full flex items-center">

      <img v-if="route.name === 'home'" class="h-12 w-12" src="/logo.png">

      <router-link v-else to="/" class="flex w-12 h-12 text-sky-600 rounded-[50%]">
        <icon-back class="m-auto h-6" />
      </router-link>

      <div class="ml-2">
        <h1 class="text-lg">{{ state.header.title }}</h1>
        <p class="text-sm text-slate-600">{{ state.header.note }}</p>
      </div>

      <icon-online class="h-6 ml-auto" />

    </div>
  </header>
</template>



<!--
    Scripts
-->

<script setup>

  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useState } from '#src/store.js'
  import IconBack from '#src/icons/back.svg'
  import IconOnline from '#src/icons/online.svg'
  import IconOffline from '#src/icons/oflline.svg'


  const route = useRoute();
  const state = useState();

  console.log(route)


</script>