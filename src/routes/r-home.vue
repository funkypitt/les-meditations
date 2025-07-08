<!--
    Template
-->

<template>
  <l-header title="Méditations guidées" note="d'enpleineconscience.ch" />
  <l-section>

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

    <router-link v-for="{ slug, name } in categories" class="tile" :to="{ name: 'category', params: { slug }}">
      <p class="text-lg text-blue">{{ name }}</p>
    </router-link>

    <div class="line" />

    <router-link class="tile" :to="{ name: 'downloads' }">
      <p class="text-lg text-blue">Téléchargements</p>
      <p class="text-sm text-gray">10 enregistrements</p>
    </router-link>

  </l-section>
</template>



<!--
    Scripts
-->

<script setup>

  import { ref, onMounted, onUnmounted } from 'vue'
  import state from '#src/utils/state.js'
  import LHeader from '#src/layout/l-header.vue'
  import LSection from '#src/layout/l-section.vue'
  import UiButton from '#src/ui/ui-button.vue'
  import IconShare from '#src/icons/share.svg'
  import categories from '#database/categories.js'

  const isInstalled = ref(window.matchMedia('(display-mode: standalone)').matches);
  const isIos = ref(/iPad|iPhone|iPod/.test(navigator.userAgent));

  async function install () {
    await state.installPrompt.prompt();
    state.installPrompt = null;
  }

  function onInstall () {
    isInstalled.value = true;
  }

  onMounted(() => {
    window.addEventListener('appinstalled', onInstall);
  })

  onUnmounted(() => {
    window.removeEventListener('appinstalled', onInstall);
  })

</script>