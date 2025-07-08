<!--
    Template
-->

<template>
  <div class="ui-progress h-1 bg-slate-200">
    <div class="h-full bg-blue" :style="{ width }" />
  </div>
</template>



<!--
    Scripts
-->

<script setup>

  import { computed } from 'vue'

  const props = defineProps([
    'value'
  ])

  const width = computed(() => {
    return props.value * 100 + '%';
  })

</script>