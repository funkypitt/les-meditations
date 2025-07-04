<template>
  <div class="category-page">
    <div class="connection-indicator">
      <svg v-if="!isOnline" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 3L3 10L12 12L14 21L21 3Z" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 20H12.01" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 16C13.6569 16 15 14.6569 15 13C15 11.3431 13.6569 10 12 10C10.3431 10 9 11.3431 9 13C9 14.6569 10.3431 16 12 16Z" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M5.636 18.364C8.464 15.536 15.536 15.536 18.364 18.364" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M2.807 15.536C7.269 11.074 16.731 11.074 21.193 15.536" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <h1>{{ category }}</h1>
    <p>{{ categoryDescription }}</p>
    <div v-if="isLoadingRecordings" class="loading">
      Chargement des enregistrements...
    </div>
    <div v-else-if="recordings.length === 0" class="error">
      Aucun enregistrement disponible. Veuillez vérifier votre connexion.
    </div>
    <div v-else class="recordings">
      <div v-for="recording in recordings" :key="recording.id" class="recording">
        <h3>{{ recording.name }}</h3>
        <p>{{ recording.description }}</p>
        <audio controls :src="recording.url" @loadeddata="checkDownloadStatus(recording)"></audio>
        <button v-if="isOnline && !isDownloaded(recording)" @click="downloadRecording(recording)" class="download-button">
          Télécharger
        </button>
        <p v-if="isDownloaded(recording)" class="download-status">
          Vous avez téléchargé cet enregistrement et pouvez maintenant l'écouter en mode avion. 
          <a href="#" @click.prevent="clearDownload(recording)">Cliquez ici</a> pour effacer la version téléchargée 
          (ou utilisez le bouton "Vider le cache" pour effacer toutes les données téléchargées) (maximum 1 téléchargement).
        </p>
      </div>
    </div>
    <div class="version-info">
      App version ({{ buildCode }})
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      category: this.$route.params.category,
      categoryDescription: '',
      recordings: [],
      isLoadingRecordings: true,
      isOnline: navigator.onLine,
      downloadedUrl: null,
      undefined
    };
  },
  async created() {
    window.addEventListener('online', this.updateOnlineStatus);
    window.addEventListener('offline', this.updateOnlineStatus);

    const cachedData = localStorage.getItem('meditations-data');
    let cachedRecordings = [];
    let cachedCategoryDescription = '';

    if (cachedData) {
      const data = JSON.parse(cachedData);
      cachedRecordings = (data.recordings || []).filter(rec => rec.category === this.category);
      const categoryRow = (data.categories || []).find(cat => cat.name === this.category);
      cachedCategoryDescription = categoryRow ? categoryRow.description : '';
      this.recordings = cachedRecordings;
      this.categoryDescription = cachedCategoryDescription;
      this.isLoadingRecordings = false;
    }

    try {
      const response = await axios.get(`/api/recordings/${this.category}`);
      console.log('Recordings received from API:', response.data);
      this.recordings = response.data.recordings || [];
      this.categoryDescription = response.data.categoryDescription || '';
      const existingData = localStorage.getItem('meditations-data');
      if (!existingData) {
        const categoriesResponse = await axios.get('/api/categories');
        localStorage.setItem('meditations-data', JSON.stringify({
          categories: categoriesResponse.data,
          recordings: (await axios.get('/api/recordings')).data
        }));
      }
    } catch (error) {
      console.error('Error fetching recordings:', error);
      if (!cachedData) {
        this.recordings = [];
        this.categoryDescription = '';
      }
    } finally {
      this.isLoadingRecordings = false;
    }
  },
  beforeDestroy() {
    window.removeEventListener('online', this.updateOnlineStatus);
    window.removeEventListener('offline', this.updateOnlineStatus);
  },
  methods: {
    updateOnlineStatus() {
      this.isOnline = navigator.onLine;
      console.log('Online status:', this.isOnline ? 'Online' : 'Offline');
    },
    isDownloaded(recording) {
      return this.downloadedUrl === recording.url;
    },
    async downloadRecording(recording) {
      if (!this.isOnline) {
        alert('Veuillez vous connecter à Internet pour télécharger.');
        return;
      }
      if (this.downloadedUrl) {
        const cache = await caches.open('meditations-mp3-cache-v1');
        await cache.delete(this.downloadedUrl);
        console.log('Précédent MP3 effacé:', this.downloadedUrl);
      }
      const response = await fetch(recording.url);
      if (response.status === 200) {
        const blob = await response.blob();
        const cache = await caches.open('meditations-mp3-cache-v1');
        await cache.put(recording.url, new Response(blob));
        this.downloadedUrl = recording.url;
        console.log('Nouveau MP3 téléchargé:', recording.url);
      } else {
        alert('Erreur lors du téléchargement.');
      }
    },
    checkDownloadStatus(recording) {
      if (this.isDownloaded(recording) && !this.isOnline) {
        console.log('Lecture hors ligne confirmée:', recording.url);
      }
    },
    async clearDownload(recording) {
      if (this.downloadedUrl === recording.url) {
        const cache = await caches.open('meditations-mp3-cache-v1');
        await cache.delete(this.downloadedUrl);
        this.downloadedUrl = null;
        console.log('MP3 effacé:', recording.url);
        alert('Le téléchargement a été effacé.');
      }
    }
  }
};
</script>

<style scoped>
.category-page {
  text-align: center;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  position: relative;
}
.connection-indicator {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
}
h1 {
  font-size: 1.5rem;
  color: #333;
}
p {
  color: #666;
  margin-bottom: 20px;
}
.loading, .error {
  margin: 20px 0;
  color: #666;
  font-family: 'Arial', sans-serif;
}
.recordings {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.recording {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
}
.download-button {
  padding: 5px 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}
.download-button:hover {
  background: #0056b3;
}
.download-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.download-status {
  color: #28a745;
  font-size: 0.9rem;
  margin-top: 5px;
}
.download-status a {
  color: #dc3545;
  text-decoration: underline;
  cursor: pointer;
}
.download-status a:hover {
  color: #a71d2a;
}
.version-info {
  font-size: 0.7rem;
  color: #666;
  position: fixed;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}
</style>
