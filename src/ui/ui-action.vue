<!--
    Template
-->

<template>
  <ui-dynamic class="ui-action flex h-12 w-12 text-blue rounded-[50%]" :class="{ 'text-white bg-blue': primary }">
    <component :is="icon" class="m-auto" />
  </ui-dynamic>
</template>



<!--
    Scripts
-->

<script setup>

  import UiDynamic from '#src/ui/ui-dynamic.vue'

  defineProps({
    icon: Object,
    primary: Boolean
  })

</script>