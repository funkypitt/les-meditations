<!--
    Template
-->

<template>
  <div class="ui-recording tile" @click="test">

    <div class="flex items-center">

      <ui-action v-if="active" primary :icon="IconPause" />
      <ui-action v-else primary :icon="IconPlay" />

      <div class="ml-4 grow">
        <h2>{{ value.name }}</h2>
        <p class="text-sm text-grey">{{ value.description }}</p>
      </div>

      <div class="shrink-0" v-if="cache !== 'pending'">
        <ui-action v-if="cache || loader.has(props.value)" :icon="IconClear" @click="loader.del(value)" />
        <ui-action v-else :icon="IconDownload" @click="loader.load(value)" />
      </div>

    </div>

    <div class="mt-4" v-if="active">
      <ui-progress :value="0.5" />
      <div class="flex justify-between mt-2 text-xs text-gray">
        <span>01:01</span>
        <span>45:12</span>
      </div>
    </div>

    <audio>
      <source :src="value.url">
    </audio>

  </div>
</template>


<!--
    Scripts
-->

<script setup>

  import { computed, ref } from 'vue'
  import db from '#src/services/db.js'
  import loader from '#src/services/loader.js'
  import IconPlay from '#src/icons/play.svg'
  import IconPause from '#src/icons/pause.svg'
  import IconDownload from '#src/icons/download.svg'
  import IconClear from '#src/icons/clear.svg'
  import UiAction from '#src/ui/ui-action.vue'
  import UiProgress from '#src/ui/ui-progress.vue'

  const emit = defineEmits([
    'play',
    'pause'
  ])

  const props = defineProps([
    'value',
    'active'
  ])



  const cache = ref('pending');

  const downloading = computed(() => {
    return loader.has(props.value)
  })

  function toggle () {
    if (props.active) emit('pause');
    else emit('play');
  }

  db.get(props.value.url).then(data => {
    cache.value = data;
  })



</script>