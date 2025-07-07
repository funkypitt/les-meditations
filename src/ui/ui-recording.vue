<!--
    Template
-->

<template>
  <div class="ui-recording tile" @click="test">


    <!-- main -->

    <div class="flex items-center">

      <ui-action v-if="active" primary :icon="IconPause" />
      <ui-action v-else primary :icon="IconPlay" />

      <div class="ml-4 grow">
        <h2>{{ value.name }}</h2>
        <p class="text-sm text-gray">{{ value.description }}</p>
      </div>

      <div class="shrink-0">
        <ui-spinner class="m-3 text-blue" v-if="db.loading" />
        <ui-action v-else-if="clearable" :icon="IconClear" @click="clear" />
        <ui-action v-else :icon="IconDownload" @click="loader.load(value)" />
      </div>

    </div>


    <!-- progress -->

    <div class="mt-4" v-if="active">

      <ui-progress :value="0.5" />

      <div class="flex justify-between mt-2 text-xs text-gray">
        <span>01:01</span>
        <span>45:12</span>
      </div>

    </div>


    <!-- audio -->

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
  import db from '#src/utils/db.js'
  import loader from '#src/utils/loader.js'
  import IconPlay from '#src/icons/play.svg'
  import IconPause from '#src/icons/pause.svg'
  import IconDownload from '#src/icons/download.svg'
  import IconClear from '#src/icons/clear.svg'
  import UiAction from '#src/ui/ui-action.vue'
  import UiProgress from '#src/ui/ui-progress.vue'
  import UiSpinner from '#src/ui/ui-spinner.vue'

  const emit = defineEmits([
    'play',
    'pause'
  ])

  const props = defineProps([
    'value',
    'active'
  ])

  const cache = ref(null);


  const clearable = computed(() => {
    return cache.value || loader.has(props.value)
  })

  function clear () {
    if (!clearable.value) return;
    if (cache.value) db.del(props.value.url);
    else loader.del(props.value);
  }

  function toggle () {
    if (props.active) emit('pause');
    else emit('play');
  }

  db.get(props.value.url).then(data => {
    cache.value = data;
  })



</script>