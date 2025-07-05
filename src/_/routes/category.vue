<template><div class="category-page">
    <h1>Méditations guidées d'enpleineconscience.ch</h1>
    <router-link to="/" class="back-button">Retour aux catégories</router-link>
    <button class="clear-cache-button" @click="clearCache">Vider le cache</button>
    <h2>{{ category }}</h2>
    <div v-if="categoryDescription" class="category-description" v-html="categoryDescription"></div>
    <div v-for="recording in filteredRecordings" :key="recording.id" class="recording">
      <h3 v-html="recording.name"></h3>
      <p v-if="recording.description">{{ recording.description }}</p>
      <audio controls :src="recording.url"></audio>
      <button
        :class="{ 'downloaded-button': isDownloaded(recording.url) }"
        @click="downloadRecording(recording)"
      >
        <span v-if="isDownloading(recording.url)">
          Téléchargement... {{ downloadProgress(recording.url) }}%
        </span>
        <span v-else>
          {{ isDownloaded(recording.url) ? 'Téléchargé' : 'Télécharger' }}
        </span>
      </button>
      <p v-if="isDownloaded(recording.url)" class="download-message">
        Vous avez téléchargé cet enregistrement et pouvez maintenant l'écouter en mode avion.
        <a href="#" @click.prevent="deleteSingleRecording(recording.url)">Cliquez ici</a>
        pour effacer la version téléchargée (ou utilisez le bouton "Vider le cache" pour effacer toutes les données téléchargées).
      </p>
    </div>
  </div></template>
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
    async async downloadRecording(recording) {
      const src = recording.url;
      if (this.isDownloaded(recording) || this.isDownloading(recording)) return;

      this.downloadingFiles.set(src, 0);

      try {
        const response = await fetch(src);
        const reader = response.body.getReader();
        const contentLength = +response.headers.get('Content-Length');
        let receivedLength = 0;
        const chunks = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          chunks.push(value);
          receivedLength += value.length;

          if (contentLength) {
            const progress = Math.round((receivedLength / contentLength) * 100);
            this.downloadingFiles.set(src, progress);
            this.$forceUpdate();
          }
        }

        const blob = new Blob(chunks);
        const cache = await caches.open('meditations-mp3-cache-v1');
        await cache.put(src, new Response(blob));
        this.downloadedUrl = src;
        this.downloadingFiles.delete(src);
        console.log('Méditation téléchargée :', src);
      } catch (e) {
        console.error("Erreur de téléchargement :", e);
        this.downloadingFiles.delete(src);
        alert("Impossible de télécharger le fichier.");
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
