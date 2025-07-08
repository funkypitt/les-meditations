<!--
    Template
-->

<template>
  <l-header :title="category.name" back="/" />
  <l-section>

    <div v-html="category.description" />
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

  const category = computed(() => {
    return categories.find(category => category.slug === route.params.slug)
  })

  function onPlay (index) {
    active.value = index;
  }

  function onPause () {
    active.value = -1;
  }


</script>