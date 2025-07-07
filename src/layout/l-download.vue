<!--
    Template
-->

<template>
  <aside class="l-download overlay bottom-0 h-(--h-download) py-4" v-if="store.downloads.length">
    <div class="wrapper flex flex-col">
      <p>Downloading {{ store.downloads.length }} item(s)</p>
      <p class="text-xs text-gray">80%</p>
      <ui-progress class="mt-auto" :value="0.3" />
    </div>
  </aside>
</template>


<!--
    Scripts
-->

<script setup>

  import { ref, watch } from 'vue'
  import store from '#src/services/store.js'
  import UiProgress from '#src/ui/ui-progress.vue'


  const active = ref(null);
  const progress = ref(null);



  // -----------------
  // Request
  // -----------------

  async function request () {

    const response = await fetch(active.value.url);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${active.value.name}: ${response.status}`);
    }

    const total = parseInt(response.headers.get('Content-Length'));
    const reader = response.body.getReader();
    const chunks = [];
    let received = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      received += value.length;
      progress.value = received / total;
    }

    return new Blob(chunks);
  }



  // -----------------
  // Callbacks
  // -----------------

  function onError () {

  }

  function onSuccess () {
    active.value =
    download();
  }



  // -----------------
  // Actions
  // -----------------

  async function download (rec) {
    active.value = rec;
    progress.value = 0;
    request().then(onSuccess).catch(onError);
  }



  // -----------------
  // Listeners
  // -----------------

  watch(() => store.downloads.length, length => {
    if (!active.value && length) download();
  })



</script>