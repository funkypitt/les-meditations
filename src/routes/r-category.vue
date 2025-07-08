<!--
    Template
-->

<template>
  <l-header :title="category.name" back="/" />
  <l-section class="r-category">


    <!-- heading -->

    <h1 class="text-2xl font-normal mb-4">{{ category.name }}</h1>
    <div class="html mb-8" v-html="category.description" />


    <!-- information -->

    <div class="html mb-8 tile bg-blue-200">
      <p class="font-medium">Pour une écoute sans interruption, je vous recommande fortement de procéder comme suit:</p>
      <ol>
        <li>Télécharger l'enregistrement choisi à l'aide du bouton à droite de celui-ci.</li>
        <li>Mettre votre appareil en mode avion</li>
        <li>Appuyer sur play! En cas de problème, les enregistrements sont aussi disponibles à l'écoute et au téléchargement au format mp3 <a class="text-blue hover:underline" target="_blank" href="https://www.enpleineconscience.ch/meditations-guidees-mp3/">sur mon site</a>.</li>
      </ol>
    </div>

    <div class="line" />

    <ui-recording
      v-for="(recording, index) in category.recordings"
      :active="index === active"
      :value="recording"
      @play="onPlay(index)"
      @pause="onPause()"
    />

  </l-section>
</template>



<!--
    Scripts
-->

<script setup>

  import { computed, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import categories from '#database/categories.js'
  import LHeader from '#src/layout/l-header.vue'
  import LSection from '#src/layout/l-section.vue'
  import UiRecording from '#src/ui/ui-recording.vue'

  const route = useRoute();
  const active = ref(-1);
  const category = route.meta.category;

  function onPlay (index) {
    active.value = index;
  }

  function onPause () {
    active.value = -1;
  }


</script>



<!--
    Options
-->

<script>

  import categories from '#database/categories.js'

  export default {
    beforeRouteEnter(to) {
      to.meta.category = categories.find(category => category.slug === to.params.slug);
      if (!to.meta.category) return { name: 'home' }
    }
  }

</script>