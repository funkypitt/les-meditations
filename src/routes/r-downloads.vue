<!--
    Template
-->

<template>
  <l-header title="Téléchargements" back="/" />
  <l-section>


    <!-- recordings -->

    <template v-if="recordings.length">
      <ui-recording
        v-for="(recording, index) in recordings"
        :active="index === active"
        :value="recording"
        @play="onPlay(index)"
        @stop="onStop()"
        @clear="onClear(index)"
      />
    </template>


    <!-- no entries -->

    <p v-else>Aucun téléchargement trouvé</p>


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

  const active = ref(-1);
  const route = useRoute();
  const recordings = reactive(route.meta.recordings || []);



  // -----------------
  // Handlers
  // -----------------

  function onPlay (index) {
    active.value = index;
  }

  function onStop () {
    active.value = -1;
  }

  function onClear (index) {
    recordings.splice(index, 1);
    if (index === active.value) active.value = -1;
  }

  function onLoad (rec) {
    recordings.push(rec);
  }



  // -----------------
  // Hooks
  // -----------------

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

  import db from '#src/utils/db.js'

  export default {
    async beforeRouteEnter (to) {
      to.meta.recordings = await db.list();
    }
  }

</script>