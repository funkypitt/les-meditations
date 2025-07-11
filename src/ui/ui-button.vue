<!--
    Template
-->

<template>
  <button class="block bg-theme text-white px-4 py-2 rounded-sm" :class="{ 'bg-gray-300 pointer-events-none': disabled }">{{ text }}</button>
</template>



<!--
    Scripts
-->

<script setup>

  defineProps({
    text: String,
    disabled: Boolean
  })

</script>