<!--
    Template
-->

<template>
  <div class="ui-recording tile" @click="test">


    <!-- main -->

    <div class="flex items-center">

      <div class="shrink-0">
        <ui-action v-if="active" primary :icon="IconPause" @click="emit('stop')" />
        <ui-action v-else primary :icon="IconPlay" @click="emit('play')" />
      </div>

      <div class="ml-4 grow">
        <h2>{{ value.name }}</h2>
        <p class="text-sm text-gray">{{ value.description }}</p>
      </div>

      <div class="shrink-0 -mr-2" :class="{ invisible: db.loading }">
          <ui-action v-if="clearable" :icon="IconClear" @click="clear" />
          <ui-action v-else :icon="IconDownload" @click="loader.load(value)" />
      </div>

    </div>


    <!-- progress -->

    <div class="pt-4" v-if="active">

      <ui-progress :value="progress" />

      <div class="flex justify-between mt-2 text-xs text-gray">
        <span>{{ format(time) }}</span>
        <span>{{ format(duration) }}</span>
      </div>

    </div>


    <!-- audio -->

    <audio ref="$audio" @loadedmetadata="onMetadata" @timeupdate="onTime" @ended="emit('stop')" @error="onError">
      <source :src="url" />
    </audio>


  </div>
</template>



<!--
    Scripts
-->

<script setup>

  import { computed, ref, watch, onMounted } from 'vue'
  import db from '#src/utils/db.js'
  import state from '#src/utils/state.js'
  import loader from '#src/utils/loader.js'
  import IconPlay from '#src/icons/play.svg'
  import IconPause from '#src/icons/pause.svg'
  import IconDownload from '#src/icons/download.svg'
  import IconClear from '#src/icons/clear.svg'
  import UiAction from '#src/ui/ui-action.vue'
  import UiProgress from '#src/ui/ui-progress.vue'

  const emit = defineEmits([
    'play',
    'stop',
    'clear'
  ])

  const props = defineProps([
    'value',
    'active'
  ])



  // -----------------
  // Data
  // -----------------

  const duration = ref(0);
  const time = ref(0);
  const url = getUrl();
  const $audio = ref(null);

  const clearable = computed(() => {
    return props.value.blob || loader.has(props.value)
  })

  const progress = computed(() => {
    return time.value / duration.value;
  })



  // -----------------
  // Helpers
  // -----------------

  function format (seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }

  function getUrl () {
    return props.value.blob ? URL.createObjectURL(props.value.blob) : props.value.url;
  }



  // -----------------
  // Handlers
  // -----------------

  function onMetadata () {
    duration.value = $audio.value?.duration || 0;
  }

  function onTime () {
    time.value = $audio.value?.currentTime || 0;
  }

  function onError () {
    const messages = {
      1: 'MEDIA_ERR_ABORTED',
      2: 'MEDIA_ERR_NETWORK',
      3: 'MEDIA_ERR_DECODE',
      4: 'MEDIA_ERR_SRC_NOT_SUPPORTED'
    };
    const error = $audio.value.error;
    const message = messages[error.code] || 'Erreur audio inconnue'
    state.error = new Error(message);
  }



  // -----------------
  // Actions
  // -----------------

  function clear () {
    if (!clearable.value) return;
    if (props.value.blob) db.del(props.value.url);
    else loader.del(props.value);
    emit('clear');
  }

  function stop () {
    $audio.value.pause();
    $audio.value.currentTime = 0;
  }

  function play () {
    $audio.value.src = getUrl();
    $audio.value.play();
  }



  // -----------------
  // Listeners
  // -----------------

  onMounted(() => {
    watch(() => props.active, value => value ? play() : stop(), { immediate: true })
  })



</script>