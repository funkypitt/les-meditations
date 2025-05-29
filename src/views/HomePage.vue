<template>
  <div class="home">
    <div class="offline-indicator" v-if="!isOnline">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 3L3 10L12 12L14 21L21 3Z" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
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
    <div v-if="showUpdatePrompt" class="update-prompt">
      <p>Une nouvelle version est disponible !</p>
      <button @click="updateApp">Mettre à jour maintenant</button>
    </div>
    <div v-if="isLoadingCategories" class="loading">
      Chargement des catégories...
    </div>
    <div v-else-if="categories.length === 0" class="error">
      Impossible de charger les catégories. Veuillez vérifier votre connexion.
    </div>
    <div v-else class="categories">
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
      isIOS: false,
      isLoadingCategories: true,
      isOnline: navigator.onLine,
      showUpdatePrompt: false, // Ajouté pour afficher la notification de mise à jour
      newWorker: null // Ajouté pour stocker le nouveau service worker
    };
  },
  async created() {
    // Écouter les changements de connexion
    window.addEventListener('online', this.updateOnlineStatus);
    window.addEventListener('offline', this.updateOnlineStatus);

    // Detect iOS
    const userAgent = window.navigator.userAgent;
    this.isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    this.showIOSPrompt = this.isIOS && !window.matchMedia('(display-mode: standalone)').matches;

    // Charger les catégories depuis localStorage (si disponibles)
    const cachedCategories = localStorage.getItem('meditations-categories');
    if (cachedCategories) {
      this.categories = JSON.parse(cachedCategories).filter(category => category.name !== 'lisez - moi');
      this.isLoadingCategories = false;
    }

    // Charger les catégories depuis l’API
    try {
      const response = await axios.get('/api/categories');
      console.log('Categories received from API:', response.data);
      this.categories = response.data.filter(category => category.name !== 'lisez - moi');
      localStorage.setItem('meditations-categories', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error fetching categories:', error);
      if (!cachedCategories) {
        this.categories = [];
      }
    } finally {
      this.isLoadingCategories = false;
    }
  },
  mounted() {
    this.updateInstallButtonVisibility();

    // Gérer les mises à jour du service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(registration => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Une nouvelle version est disponible
              this.newWorker = newWorker;
              this.showUpdatePrompt = true;
            }
          });
        });
      });
    }

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
    window.removeEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt);
    window.removeEventListener('appinstalled', this.handleAppInstalled);
    window.removeEventListener('online', this.updateOnlineStatus);
    window.removeEventListener('offline', this.updateOnlineStatus);
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
      this.showInstallButton = !this.isIOS && !window.matchMedia('(display-mode: standalone)').matches && !!this.deferredPrompt;
    },
    updateOnlineStatus() {
      this.isOnline = navigator.onLine;
      console.log('Online status:', this.isOnline ? 'Online' : 'Offline');
    },
    updateApp() {
      if (this.newWorker) {
        this.newWorker.postMessage({ type: 'SKIP_WAITING' });
        this.showUpdatePrompt = false;
        window.location.reload();
      }
    }
  }
};
</script>

<style scoped>
.home {
  text-align: center;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  position: relative;
}
.offline-indicator {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
}
.update-prompt {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #f0f0f0;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  text-align: center;
}
.update-prompt p {
  margin: 0 0 10px 0;
  color: #333;
  font-family: 'Arial', sans-serif;
}
.update-prompt button {
  padding: 5px 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Arial', sans-serif;
}
.update-prompt button:hover {
  background: #0056b3;
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
.loading, .error {
  margin: 20px 0;
  color: #666;
  font-family: 'Arial', sans-serif;
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
