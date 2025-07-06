<!--
    Styles
-->

<style>

  .l-header {
    top: 0;
    height: var(--header);
  }

  .l-header .wrapper {
    display: flex;
    align-items: center;
  }

  .l-header img {
    width: 48px;
    height: 48px;
  }

  .l-header_text {
    margin-left: 8px;
  }
  .l-header_text .t-sm {
    margin-top: 4px;
  }

  .l-header svg:last-child {
    margin-left: auto;
  }

</style>



<!--
    Template
-->

<template>
  <header class="l-header overlay">
    <div class="wrapper">

      <img v-if="route.name === 'home'" src="/logo.png">

      <router-link v-else to="/" class="button">
        <icon-back class="icon" />
      </router-link>

      <div class="l-header_text">
        <h1 class="t-lg">{{ state.header.title }}</h1>
        <p class="t-sm t-gray">{{ state.header.note }}</p>
      </div>

      <icon-online class="icon" />

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