<!--
    Template
-->

<template>
  <l-header title="Méditations guidées" note="d'enpleineconscience.ch" />
  <l-section>

    <div v-if="!isInstalled">
      <div v-if="isIos">
          <p class="mb-2 font-medium">Pour installer cette application sur iOS :</p>
          <p class="">1. Appuyez sur l'icône de partage<icon-share class="inline-block align-baseline h-4" />dans Safari.</p>
          <p class="">2. Sélectionnez "Ajouter à l'écran d'accueil".</p>
      </div>
      <button v-else class="block mx-auto bg-blue text-white px-4 py-2 rounded-sm" :class="{ 'bg-gray-300 pointer-events-none': !installPrompt }" @click="install">Installer l'app sur votre smartphone</button>
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
  import LHeader from '#src/layout/l-header.vue'
  import LSection from '#src/layout/l-section.vue'
  import IconShare from '#src/icons/share.svg'
  import categories from '#database/categories.js'

  const isInstalled = ref(window.matchMedia('(display-mode: standalone)').matches);
  const isIos = ref(/iPad|iPhone|iPod/.test(navigator.userAgent));
  const installPrompt = ref(null);

  async function install () {
    await installPrompt.value.prompt();
    installPrompt.value = null;
  }

  function beforeInstall (event) {
    event.preventDefault();
    installPrompt.value = event;
  }

  function onInstall () {
    isInstalled.value = true;
  }

  onMounted(() => {
    window.addEventListener('beforeinstallprompt', beforeInstall);
    window.addEventListener('appinstalled', onInstall);
  })

  onUnmounted(() => {
    window.removeEventListener('beforeinstallprompt', beforeInstall);
    window.removeEventListener('appinstalled', onInstall);
  })

</script>