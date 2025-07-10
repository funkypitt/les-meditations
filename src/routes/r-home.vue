<!--
    Template
-->

<template>
  <l-header title="Méditations guidées" note="d'enpleineconscience.ch" />
  <l-section>

    <!-- install -->

    <div v-if="!isInstalled">
      <div v-if="isIos" class="html tile bg-blue-200">
          <p class="font-medium">Pour installer cette application sur iOS :</p>
          <ol>
            <li>Appuyez sur l'icône de partage<icon-share class="inline-block align-baseline h-4" />dans Safari.</li>
            <li>Sélectionnez "Ajouter à l'écran d'accueil".</li>
          </ol>
      </div>
      <ui-button v-else class="mx-auto" text="Installer l'app sur votre smartphone" :disabled="!state.installPrompt" @click="install"/>
      <div class="line" />
    </div>


    <!-- categories -->

    <router-link v-for="{ slug, name, color } in categories" class="tile" :to="{ name: 'category', params: { slug }}" :style="{ backgroundColor: color }">
      <p class="text-lg font-normal text-white text-shadow-md">{{ name }}</p>
    </router-link>

    <div class="line" />


    <!-- downloads -->

    <router-link class="tile" :to="{ name: 'downloads' }">
      <p class="text-lg text-blue">Téléchargements</p>
      <p class="text-sm text-gray">{{ downloads }} enregistrements</p>
    </router-link>


  </l-section>
</template>



<!--
    Scripts
-->

<script setup>

  import { ref, onMounted, onUnmounted } from 'vue'
  import { useRoute } from 'vue-router'
  import state from '#src/utils/state.js'
  import loader from '#src/utils/loader.js'
  import LHeader from '#src/layout/l-header.vue'
  import LSection from '#src/layout/l-section.vue'
  import UiButton from '#src/ui/ui-button.vue'
  import IconShare from '#src/icons/share.svg'
  import categories from '#database/categories.js'



  // -----------------
  // Data
  // -----------------

  const route = useRoute();
  const downloads = ref(route.meta.downloads || 0)
  const isInstalled = ref(window.matchMedia('(display-mode: standalone)').matches);
  const isIos = ref(/iPad|iPhone|iPod/.test(navigator.userAgent));



  // -----------------
  // Actions
  // -----------------

  async function install () {
    await state.installPrompt.prompt();
    state.installPrompt = null;
  }



  // -----------------
  // Handlers
  // -----------------

  function onInstall () {
    isInstalled.value = true;
  }

  function onLoad () {
    downloads.value++;
  }



  // -----------------
  // Hooks
  // -----------------

  onMounted(() => {
    window.addEventListener('appinstalled', onInstall);
    loader.emitter.on('load', onLoad);
  })

  onUnmounted(() => {
    window.removeEventListener('appinstalled', onInstall);
    loader.emitter.off('load', onLoad);
  })



</script>



<!--
    Options
-->

<script>

  import db from '#src/utils/db.js'

  export default {
    async beforeRouteEnter (to) {
      to.meta.downloads = await db.count();
    }
  }

</script>