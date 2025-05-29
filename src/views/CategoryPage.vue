<template>
  <div class="category-page">
    <div class="offline-indicator" v-if="!isOnline">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 3L3 10L12 12L14 21L21 3Z" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
        <audio controls :src="recording.url"></audio>
      </div>
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
      isOnline: navigator.onLine // État initial basé sur navigator.onLine
    };
  },
  async created() {
    // Écouter les changements de connexion
    window.addEventListener('online', this.updateOnlineStatus);
    window.addEventListener('offline', this.updateOnlineStatus);

    // Charger les enregistrements depuis localStorage (si disponibles)
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

    // Charger les enregistrements depuis l’API
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
    }
  }
};
</script>

<style scoped>
.category-page {
  text-align: center;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  position: relative; /* Ajouté pour positionner l’icône */
}
.offline-indicator {
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
</style>
