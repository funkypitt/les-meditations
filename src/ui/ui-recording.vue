<!--
    Template
-->

<template>
  <div class="ui-recording tile" @click="test">


    <!-- main -->

    <div class="flex items-center">

      <div class="shrink-0">
        <ui-action v-if="active" primary :icon="IconPause" @click="emit('stop')" />
        <ui-action v-else primary :disabled="loading" :icon="IconPlay" @click="emit('play')" />
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

    <audio ref="$audio" @loadedmetadata="onMetadata" @canplay="onCanPlay" @timeupdate="onTime">
      <source :src="url" />
    </audio>


  </div>
</template>


<!--
    Scripts
-->

<script setup>

  import { computed, ref, watch, onMounted } from 'vue'
  import { useDB } from '#src/utils/uses.js'
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
    'delete'
  ])

  const props = defineProps([
    'value',
    'active'
  ])



  // -----------------
  // Data
  // -----------------

  let watcher;
  const db = useDB();
  const duration = ref(0);
  const time = ref(0);
  const loading = ref(true);
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

  function onCanPlay () {
    loading.value = false;
    if (props.active) $audio.value.play();
  }

  function onMetadata () {
    duration.value = $audio.value.duration;
  }

  function onTime () {
    time.value = $audio.value.currentTime;
  }



  // -----------------
  // Actions
  // -----------------

  function clear () {
    // if (!clearable.value) return;
    // if (cache.value) db.del(props.value.url);
    // else loader.del(props.value);
    // emit('delete');
  }

  function stop () {
    if (loading.value) return;
    $audio.value.pause();
    $audio.value.currentTime = 0;
  }

  function play () {
    const url = getUrl();
    if (url === $audio.value.src) return $audio.value.play();
    loading.value = true;
    $audio.value.src = url;
  }



  // -----------------
  // Listeners
  // -----------------

  onMounted(() => {
    watch(() => props.active, value => value ? play() : stop(), { immediate: true })
  })

</script>