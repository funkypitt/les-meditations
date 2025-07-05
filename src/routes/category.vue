<!--
    Template
-->

<style>



</style>



<!--
    Template
-->

<template>

  <p>{{ category.description }}</p>

  <div v-for="(item, index) in category.recordings" class="tile">

    <div class="flex items-center">

      <button class="flex shrink-0 h-12 w-12 bg-sky-600 text-white rounded-[50%]" @click="toggle(index)">
        <icon-pause v-if="index === active" class="h-6 m-auto" />
        <icon-play v-else class="h-6 m-auto" />
      </button>

      <div class="ml-4 grow">
        <h2>{{ item.name }}</h2>
        <p class="text-sm text-slate-600">{{ item.description }}</p>
      </div>

      <button class="flex shrink-0 h-12 w-12 text-sky-600 rounded-[50%]">
        <icon-download v-if="cached[index]" class="m-auto h-6" />
        <icon-clear v-else class="m-auto h-6" />
      </button>

    </div>

    <div class="mt-4" v-if="index === active">
      <div class="h-1 bg-slate-200 mb-2">
        <div class="h-full bg-blue-500 w-[33%]" />
      </div>
      <div class="flex justify-between text-xs text-slate-600">
        <span>01:01</span>
        <span>45:12</span>
      </div>
    </div>


    <audio>
      <source :src="item.url">
    </audio>
  </div>
</template>



<!--
    Scripts
-->

<script setup>

  import { computed, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { useHeader } from '#src/store.js'
  import categories from '#src/config/categories.js'
  import IconPlay from '#src/icons/play.svg'
  import IconPause from '#src/icons/pause.svg'
  import IconDownload from '#src/icons/download.svg'
  import IconClear from '#src/icons/clear.svg'

  const route = useRoute();
  const active = ref(-1);

  const category = computed(() => {
    return categories.find(category => category.slug === route.params.slug)
  })

  const cached = computed(() => {
    return category.value.recordings.map(_ => Math.random() > 0.3)
  })

  function toggle (index) {
    if (active.value === index) active.value = -1;
    else active.value = index;
  }

  useHeader({
    back: true,
    title: category.value.name,
    note: `${ category.value.recordings.length } enregistrements`
  })

</script>