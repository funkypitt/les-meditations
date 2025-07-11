<!--
    Template
-->

<template>
  <ui-dynamic class="ui-action flex h-12 w-12 text-theme rounded-[50%]" :class="{ 'text-white bg-theme': primary, 'bg-gray-300 pointer-events-none': disabled }">
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
    primary: Boolean,
    disabled: Boolean,
  })

</script>