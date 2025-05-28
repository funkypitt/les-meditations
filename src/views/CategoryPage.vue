<template>
  <div class="category-page">
    <h1>Méditations guidées d'enpleineconscience.ch</h1>
    <router-link to="/" class="back-button">Retour aux catégories</router-link>
    <button class="clear-cache-button" @click="clearCache">Vider le cache</button>
    <h2>{{ category }}</h2>
    <div v-if="categoryDescription" class="category-description" v-html="categoryDescription"></div>
    <div v-for="meditation in filteredRecordings" :key="meditation.id" class="recording">
      <h3 v-html="meditation.name"></h3>
      <p v-if="meditation.description">{{ meditation.description }}</p>
      <audio controls :src="meditation.url"></audio>
      <button
        :class="{ 'downloaded-button': isDownloaded(meditation.url) }"
        @click="downloadMeditation(meditation.url)"
      >
        <span v-if="isDownloading(meditation.url)">
          Téléchargement... {{ downloadProgress(meditation.url) }}%
        </span>
        <span v-else>
          {{ isDownloaded(meditation.url) ? 'Téléchargé' : 'Télécharger' }}
        </span>
      </button>
      <p v-if="isDownloaded(meditation.url)" class="download-message">
        Vous avez téléchargé cet enregistrement et pouvez maintenant l'écouter en mode avion.
        <a href="#" @click.prevent="deleteSingleRecording(meditation.url)">Cliquez ici</a>
        pour effacer la version téléchargée (ou utilisez le bouton "Vider le cache" pour effacer toutes les données téléchargées).
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    category: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      recordings: [],
      categoryDescription: '',
      downloadedFiles: [],
      downloadingFiles: new Map()
    };
  },
  computed: {
    filteredRecordings() {
      return this.recordings
        .filter(rec => rec.category === this.category)
        .sort((a, b) => a.recording_order - b.recording_order);
    }
  },
  async created() {
    try {
      const response = await axios.get(`http://localhost:3000/api/recordings/${this.category}`);
      this.recordings = response.data.recordings;
      this.categoryDescription = response.data.categoryDescription;

      const cache = await caches.open('audio-cache');
      const keys = await cache.keys();
      this.downloadedFiles = keys.map(key => key.url);
    } catch (error) {
      console.error('Error fetching recordings:', error);
    }
  },
  methods: {
    async downloadMeditation(src) {
      if (this.isDownloaded(src) || this.isDownloading(src)) return;

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
        const cache = await caches.open('audio-cache');
        await cache.put(src, new Response(blob));
        this.downloadedFiles.push(src);
        this.downloadingFiles.delete(src);
        this.$forceUpdate();
      } catch (error) {
        console.error('Download failed:', error);
        this.downloadingFiles.delete(src);
        this.$forceUpdate();
      }
    },
    async clearCache() {
      try {
        const cache = await caches.open('audio-cache');
        const keys = await cache.keys();
        await Promise.all(keys.map(key => cache.delete(key)));
        this.downloadedFiles = [];
        this.downloadingFiles.clear();
        this.$forceUpdate();
        alert('Cache vidé avec succès !');
      } catch (error) {
        console.error('Error clearing cache:', error);
        alert('Erreur lors du vidage du cache.');
      }
    },
    async deleteSingleRecording(src) {
      try {
        const cache = await caches.open('audio-cache');
        await cache.delete(src);
        this.downloadedFiles = this.downloadedFiles.filter(url => url !== src);
        this.$forceUpdate();
        alert('Enregistrement supprimé avec succès !');
      } catch (error) {
        console.error('Error deleting recording:', error);
        alert('Erreur lors de la suppression de l\'enregistrement.');
      }
    },
    isDownloaded(src) {
      return this.downloadedFiles.includes(src);
    },
    isDownloading(src) {
      return this.downloadingFiles.has(src);
    },
    downloadProgress(src) {
      return this.downloadingFiles.get(src) || 0;
    }
  }
};
</script>

<style scoped>
.category-page {
  padding: 20px;
  font-family: 'Arial', sans-serif;
}
.back-button {
  display: inline-block;
  margin-bottom: 20px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  background: #f0f0f0;
  text-decoration: none;
  color: #333;
  border-radius: 5px;
}
.back-button:hover {
  background: #ddd;
}
.clear-cache-button {
  display: inline-block;
  margin-bottom: 20px;
  margin-left: 10px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  background: #ff4d4f;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}
.clear-cache-button:hover {
  background: #e6393b;
}
.category-description {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: #f0f0f0;
}
.recording {
  margin-bottom: 20px;
}
h1 {
  font-family: 'Arial', sans-serif;
  font-size: 1.17rem;
}
h2, h3, p {
  font-family: 'Arial', sans-serif;
}
button {
  margin-left: 10px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  background: #f0f0f0;
  cursor: pointer;
  border-radius: 5px;
  font-family: 'Arial', sans-serif;
}
button:hover {
  background: #007bff;
  color: white;
  border-color: #007bff;
}
.downloaded-button {
  background: #48BB78; /* Vert discret pour "Téléchargé" */
}
.downloaded-button:hover {
  background: #38A169; /* Vert plus foncé au survol */
  color: white;
  border-color: #38A169;
}
.download-message {
  margin-top: 10px;
  font-size: 0.9rem;
  color: #555;
}
.download-message a {
  color: #ff4d4f;
  text-decoration: none;
}
.download-message a:hover {
  text-decoration: underline;
}
</style>
