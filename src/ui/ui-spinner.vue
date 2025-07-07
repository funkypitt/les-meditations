<!--
    Styles
-->

<style>

  .ui-spinner path,
  .ui-spinner circle {
    fill: none;
    stroke: currentColor;
    stroke-width: 6px;
    vector-effect: non-scaling-stroke;
  }

</style>



<!--
    Template
-->

<template>
  <svg class="ui-spinner overflow-hidden animate-spin rounded-[50%]" viewBox="0 0 32 32">
    <circle class="opacity-25" r="16" cx="16" cy="16" />
    <path d="M 29.85640646055102 24 A 16 16 0 0 0 16 0" />
  </svg>
</template>