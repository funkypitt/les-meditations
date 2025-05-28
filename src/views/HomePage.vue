<template>
  <div class="home">
    <img src="/logo.png" alt="Logo" class="logo" />
    <h1>Méditations guidées d'enpleineconscience.ch</h1>
    <button v-if="showInstallButton" @click="installPWA" class="install-button">
      Installer l'app sur votre smartphone
    </button>
    <div v-if="showIOSPrompt" class="ios-prompt">
      <p>Pour installer cette application sur iOS :</p>
      <p>1. Appuyez sur l'icône de partage <img src="/share-icon.png" alt="Share Icon" class="share-icon" /> dans Safari.</p>
      <p>2. Sélectionnez "Ajouter à l'écran d'accueil".</p>
    </div>
    <div class="categories">
      <router-link
        v-for="(category, index) in categories"
        :key="category.name"
        :to="{ name: 'Category', params: { category: category.name } }"
        class="category-button"
        :style="{ backgroundColor: getCategoryColor(index) }"
      >
        {{ category.name }}
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      categories: [],
      colors: [
        '#7287F1',
        '#4ED8C7',
        '#F687B3',
        '#B794F4',
        '#68D391',
        '#B794F4',
        '#F687B3',
        '#63B3ED',
        '#76E4F7',
        '#A3BFFA'
      ],
      deferredPrompt: null,
      showInstallButton: false,
      showIOSPrompt: false,
      isIOS: false
    };
  },
 async created() {
  try {
    const response = await axios.get('/api/categories'); // Doit être relatif
    console.log('Categories received from API:', response.data);
    this.categories = response.data.filter(category => category.name !== 'lisez - moi');
  } catch (error) {
    console.error('Error fetching categories:', error);
  }

    // Detect iOS
    const userAgent = window.navigator.userAgent;
    this.isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    this.showIOSPrompt = this.isIOS && !window.matchMedia('(display-mode: standalone)').matches;
  },
  mounted() {
    // Réévaluer les conditions d'affichage à chaque montage
    this.updateInstallButtonVisibility();

    // Ajouter les écouteurs d'événements
    this.handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.updateInstallButtonVisibility();
    };

    this.handleAppInstalled = () => {
      this.showInstallButton = false;
      this.deferredPrompt = null;
    };

    window.addEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', this.handleAppInstalled);
  },
  beforeDestroy() {
    // Supprimer les écouteurs d'événements pour éviter les fuites de mémoire
    window.removeEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt);
    window.removeEventListener('appinstalled', this.handleAppInstalled);
  },
  methods: {
    getCategoryColor(index) {
      return this.colors[index % this.colors.length];
    },
    async installPWA() {
      if (this.deferredPrompt) {
        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        this.deferredPrompt = null;
        this.showInstallButton = false;
      }
    },
    updateInstallButtonVisibility() {
      // Vérifier les conditions pour afficher le bouton
      this.showInstallButton = !this.isIOS && !window.matchMedia('(display-mode: standalone)').matches && !!this.deferredPrompt;
    }
  }
};
</script>

<style scoped>
.home {
  text-align: center;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}
.logo {
  width: 112.5px;
  height: 112.5px;
  margin-bottom: 20px;
}
h1 {
  font-family: 'Arial', sans-serif;
  color: #333;
  margin-bottom: 20px;
  font-size: 1.17rem;
}
.install-button {
  display: block;
  margin: 0 auto 20px;
  padding: 10px 20px;
  border: 1px solid #ccc;
  background: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Arial', sans-serif;
}
.install-button:hover {
  background: #0056b3;
}
.ios-prompt {
  margin: 0 auto 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: #f0f0f0;
  max-width: 300px;
  text-align: left;
}
.share-icon {
  width: 20px;
  height: 20px;
  vertical-align: middle;
}
.categories {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}
.category-button {
  display: block;
  width: 200px;
  padding: 15px;
  text-decoration: none;
  color: white;
  font-family: 'Arial', sans-serif;
  font-size: 18px;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.2s;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}
.category-button:hover {
  transform: scale(1.05);
}
</style>
