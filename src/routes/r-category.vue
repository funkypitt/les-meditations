<!--
    Template
-->

<template>
  <l-header :title="category.name" back="/" />
  <l-section>


    <!-- heading -->

    <h1 class="text-2xl font-normal mb-4">{{ category.name }}</h1>
    <div class="html mb-8" v-html="category.description" />


    <!-- information -->

    <div class="html mb-8 tile bg-theme-100 shadow-none">
      <p class="font-medium">Pour une écoute sans interruption, je vous recommande fortement de procéder comme suit:</p>
      <ol>
        <li>Télécharger l'enregistrement choisi à l'aide du bouton à droite de celui-ci.</li>
        <li>Mettre votre appareil en mode avion</li>
        <li>Appuyer sur play! En cas de problème, les enregistrements sont aussi disponibles à l'écoute et au téléchargement au format mp3 <a class="text-theme-700 font-normal hover:underline" target="_blank" href="https://www.enpleineconscience.ch/meditations-guidees-mp3/">sur mon site</a>.</li>
      </ol>
    </div>


    <!-- recordings -->

    <div class="line" />

    <ui-recording
      v-for="(recording, index) in category.recordings"
      :active="index === active"
      :value="recording"
      @play="onPlay(index)"
      @stop="onStop()"
      @clear="onClear(index)"
    />


  </l-section>
</template>



<!--
    Scripts
-->

<script setup>

  import { ref, reactive, onMounted, onUnmounted } from 'vue'
  import { useRoute } from 'vue-router'
  import loader from '#src/utils/loader.js'
  import LHeader from '#src/layout/l-header.vue'
  import LSection from '#src/layout/l-section.vue'
  import UiRecording from '#src/ui/ui-recording.vue'

  const route = useRoute();
  const active = ref(-1);
  const category = reactive(route.meta.category);

  function onPlay (index) {
    active.value = index;
  }

  function onStop () {
    active.value = -1;
  }

  function onLoad (row) {
    const rec = category.recordings.find(rec => rec.url === row.url);
    if (rec) rec.blob = row.blob;
  }

  function onClear (index) {
    delete category.recordings[index].blob;
  }

  onMounted(() => {
    loader.emitter.on('load', onLoad);
  })

  onUnmounted(() => {
    loader.emitter.off('load', onLoad);
  })

</script>



<!--
    Options
-->

<script>

  import categories from '#database/categories.js'
  import db from '#src/utils/db.js'

  export default {
    async beforeRouteEnter(to) {

      const category = categories.find(category => category.slug === to.params.slug);
      if (!category) return { name: 'home' }

      const requests = category.recordings.map(async rec => {
        const clone = structuredClone(rec);
        const cache = await db.get(rec.url);
        if (cache) clone.blob = cache.blob;
        return clone;
      });

      category.recordings = await Promise.all(requests);
      to.meta.category = category;

    }
  }

</script>