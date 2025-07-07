<!--
    Template
-->

<style scoped>

  .recording {
    display: flex;
    align-items: center;
  }
  .recording .button {
    flex-shrink: 0;
  }
  .recording_text {
    margin-left: 16px;
    flex-grow: 1;
  }

  .player {
    margin-top: 16px;
  }
  .player_time {
    display: flex;
    justify-content: space-between;
    margin-top: 6px;
  }

</style>



<!--
    Template
-->

<template>

  <p>{{ category.description }}</p>

  <div v-for="(item, index) in category.recordings" class="tile">

    <div class="recording">

      <button class="button _primary" @click="toggle(index)">
        <icon-pause v-if="index === active" class="icon" />
        <icon-play v-else class="icon" />
      </button>

      <div class="recording_text">
        <h2>{{ item.name }}</h2>
        <p class="text-sm text-grey">{{ item.description }}</p>
      </div>

      <button class="button">
        <icon-download v-if="cached[index]" class="icon" />
        <icon-clear v-else class="icon" />
      </button>

    </div>

    <div class="player" v-if="index === active">
      <div class="progress">
        <div style="width: 33%" />
      </div>
      <div class="player_time text-xs text-gray">
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
  import categories from '#database/categories.js'
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


</script>