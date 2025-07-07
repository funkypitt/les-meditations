<!--
    Template
-->

<template>
  <div class="ui-recording tile" @click="test">

<!--    <div class="flex items-center">-->

<!--      <button class="button _primary shrink-0" @click="toggle()">-->
<!--        <icon-pause v-if="active" class="icon" />-->
<!--        <icon-play v-else class="icon" />-->
<!--      </button>-->

<!--      <div class="ml-4 grow">-->
<!--        <h2>{{ value.name }}</h2>-->
<!--        <p class="text-sm text-grey">{{ value.description }}</p>-->
<!--      </div>-->

<!--      <div class="shrink-0" v-if="cache !== 'pending'">-->

<!--        <button class="button" v-if="cache || downloading" @click="clear">-->
<!--          <icon-clear class="icon" />-->
<!--        </button>-->

<!--        <button class="button" v-else @click="download">-->
<!--          <icon-download class="icon" />-->
<!--        </button>-->

<!--      </div>-->
<!--    </div>-->

<!--    <div class="mt-4" v-if="active">-->
<!--      <ui-progress :value="0.5" />-->
<!--      <div class="flex justify-between mt-2 text-xs text-gray">-->
<!--        <span>01:01</span>-->
<!--        <span>45:12</span>-->
<!--      </div>-->
<!--    </div>-->

<!--    <audio>-->
<!--      <source :src="value.url">-->
<!--    </audio>-->

  </div>
</template>


<!--
    Scripts
-->

<script setup>

  import { computed, ref } from 'vue'
  import db from '#src/services/db.js'
  import store from '#src/services/store.js'
  import IconPlay from '#src/icons/play.svg'
  import IconPause from '#src/icons/pause.svg'
  import IconDownload from '#src/icons/download.svg'
  import IconClear from '#src/icons/clear.svg'
  import UiProgress from '#src/ui/ui-progress.vue'

  const emit = defineEmits([
    'play',
    'pause'
  ])

  const props = defineProps([
    'value',
    'active'
  ])

  function test () {
    store.test()
  }

  // const cache = ref('pending');
  //
  // // const downloading = computed(() => {
  // //   return store.downloads.find(recording => recording.url === props.value.url);
  // // })
  //
  // function toggle () {
  //   if (props.active) emit('pause');
  //   else emit('play');
  // }
  //
  // function download () {
  //   store.downloads.push(props.value);
  // }
  //
  // function clear () {
  //
  // }
  //
  // db.get(props.value.url).then(data => {
  //   cache.value = data;
  // })



</script>