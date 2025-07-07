<!--
    Styles
-->

<style>

  .l-download {
    bottom: 0;
    height: var(--download);
    padding-block: 16px;
  }

  .l-download .wrapper {
    display: flex;
    flex-flow: column;
    gap: 4px;
  }

  .l-download .progress {
    margin-top: auto;
  }

</style>



<!--
    Template
-->

<template>
  <aside class="l-download overlay">
    <div class="wrapper">
      <p>Downloading 1 item(s)</p>
      <p class="text-xs text-gray">0.1 MB of 120.7 MB</p>
      <div class="progress">
        <div style="width: 33%" />
      </div>
    </div>
  </aside>
</template>


<!--
    Scripts
-->

<script setup lang="ts">


</script>