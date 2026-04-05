<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppNavbar from '../car-detail/AppNavbar.vue'
import { getMakes, getModels, getYears } from '../../services/carquery.js'

const router = useRouter()

const makes = ref([])
const models = ref([])
const years = ref([])

const selectedMake = ref(null)
const selectedModel = ref(null)
const selectedYear = ref(null)

const loadingMakes = ref(true)
const loadingModels = ref(false)
const loadingYears = ref(false)  // kept for template compatibility

getMakes().then(data => {
  makes.value = data
  loadingMakes.value = false
})

watch(selectedMake, async (make) => {
  selectedModel.value = null
  selectedYear.value = null
  models.value = []
  years.value = []
  if (!make) return
  loadingModels.value = true
  models.value = await getModels(make)
  loadingModels.value = false
})

watch(selectedModel, (model) => {
  selectedYear.value = null
  years.value = []
  if (!model) return
  years.value = getYears()
})

function search() {
  if (!selectedMake.value || !selectedModel.value || !selectedYear.value) return
  router.push(`/car/${selectedMake.value}/${selectedModel.value}/${selectedYear.value}`)
}
</script>

<template>
  <AppNavbar variant="light" />
  <section class="search-section">
    <v-container style="max-width: 800px" class="text-center">
      <h1 class="search-title">
        Searching for a car?<br />
        <span class="search-title-bold">We'll help you find the best option!</span>
      </h1>
      <p class="search-subtitle">
        Discover real reviews, repair costs, and common failures from<br />
        actual owners before making your decision.
      </p>

      <v-card class="search-card mt-8" rounded="lg" elevation="0">
        <v-card-text class="pa-8">
          <h3 class="card-title mb-6">Find Your Vehicle</h3>

          <v-row>
            <v-col cols="12" md="4">
              <div class="field-label">Make</div>
              <v-autocomplete
                v-model="selectedMake"
                :items="makes"
                item-title="title"
                item-value="value"
                placeholder="Select make"
                variant="outlined"
                density="comfortable"
                hide-details
                bg-color="white"
                :loading="loadingMakes"
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">Model</div>
              <v-autocomplete
                v-model="selectedModel"
                :items="models"
                item-title="title"
                item-value="value"
                placeholder="Select model"
                variant="outlined"
                density="comfortable"
                hide-details
                bg-color="white"
                :disabled="!selectedMake"
                :loading="loadingModels"
              />
            </v-col>
            <v-col cols="12" md="4">
              <div class="field-label">Year</div>
              <v-autocomplete
                v-model="selectedYear"
                :items="years"
                placeholder="Select year"
                variant="outlined"
                density="comfortable"
                hide-details
                bg-color="white"
                :disabled="!selectedModel"
                :loading="loadingYears"
              />
            </v-col>
          </v-row>

          <v-btn
            color="primary"
            size="large"
            block
            flat
            class="search-btn mt-6"
            :disabled="!selectedMake || !selectedModel || !selectedYear"
            @click="search"
          >
            Search Vehicle
          </v-btn>
        </v-card-text>
      </v-card>
    </v-container>
  </section>
</template>

<style scoped>
.search-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 16px;
  min-height: calc(100vh - 64px);
  background: #f5f5f5;
}

.search-title {
  font-size: 2rem;
  font-weight: 400;
  color: #1a1a1a;
  line-height: 1.3;
  margin: 0 0 16px 0;
}

.search-title-bold {
  font-weight: 800;
}

.search-subtitle {
  font-size: 0.9rem;
  color: #757575;
  line-height: 1.65;
  margin: 0;
}

.search-card {
  border: 1px solid #e8e8e8;
  text-align: left;
}

.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
  text-align: center;
}

.field-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: #424242;
  margin-bottom: 6px;
}

.search-btn {
  text-transform: none;
  letter-spacing: 0;
  font-weight: 600;
  font-size: 0.95rem;
  height: 48px;
}
</style>
