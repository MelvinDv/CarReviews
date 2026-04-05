<script setup>
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '../../stores/auth.js'
import { getFailures, createFailure, castVote, getUserVotes } from '../../services/failures.js'
import AuthModal from '../auth/AuthModal.vue'

const props = defineProps({
  vehicleId: { type: Number, default: null },
})

const auth = useAuthStore()
const showAuthModal = ref(false)

// Filters
const search = ref('')
const selectedStatus = ref(null)
const selectedSort = ref('most-voted')

const statusOptions = [
  { title: 'Resueltos', value: 'resolved' },
  { title: 'No resueltos', value: 'open' },
]
const sortOptions = [
  { title: 'Más votado', value: 'most-voted' },
  { title: 'Menos votado', value: 'least-voted' },
]

// Failures list
const failures = ref([])
const totalCount = ref(0)
const userVotes = ref({})
const pageSize = 5
const currentTo = ref(pageSize - 1)
const loadingFailures = ref(false)
const loadingMore = ref(false)
const hasMore = computed(() => failures.value.length < totalCount.value)

// Inline form
const form = ref({ title: '', problem: '', solution: '', hasSolution: false })
const submitting = ref(false)
const submitError = ref('')

watch(() => props.vehicleId, (id) => {
  if (id) fetchFailures()
}, { immediate: true })

watch([selectedStatus, selectedSort], () => {
  currentTo.value = pageSize - 1
  fetchFailures()
})

async function fetchFailures() {
  if (!props.vehicleId) return
  loadingFailures.value = true
  const { failures: data, count } = await getFailures(props.vehicleId, {
    from: 0,
    to: currentTo.value,
    status: selectedStatus.value,
    sort: selectedSort.value,
  })
  failures.value = data
  totalCount.value = count
  if (auth.isLoggedIn) {
    userVotes.value = await getUserVotes(auth.user.id, data.map(f => f.id))
  }
  loadingFailures.value = false
}

async function loadMore() {
  loadingMore.value = true
  currentTo.value += pageSize
  const { failures: data, count } = await getFailures(props.vehicleId, {
    from: 0,
    to: currentTo.value,
    status: selectedStatus.value,
    sort: selectedSort.value,
  })
  failures.value = data
  totalCount.value = count
  if (auth.isLoggedIn) {
    userVotes.value = await getUserVotes(auth.user.id, data.map(f => f.id))
  }
  loadingMore.value = false
}

function requireAuth() {
  if (!auth.isLoggedIn) showAuthModal.value = true
}

async function submitFailure() {
  if (!auth.isLoggedIn) { showAuthModal.value = true; return }
  if (!form.value.title || !form.value.problem) return
  submitting.value = true
  submitError.value = ''
  try {
    await createFailure(props.vehicleId, auth.user.id, {
      title: form.value.title,
      problem: form.value.problem,
      solution: form.value.hasSolution ? form.value.solution : null,
    })
    form.value = { title: '', problem: '', solution: '', hasSolution: false }
    currentTo.value = pageSize - 1
    await fetchFailures()
  } catch {
    submitError.value = 'Error al publicar. Intenta de nuevo.'
  } finally {
    submitting.value = false
  }
}

async function vote(failure, type) {
  if (!auth.isLoggedIn) { showAuthModal.value = true; return }
  await castVote(failure.id, auth.user.id, type)
  await fetchFailures()
}

const filteredFailures = computed(() => {
  if (!search.value) return failures.value
  return failures.value.filter(f =>
    f.title.toLowerCase().includes(search.value.toLowerCase())
  )
})

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}
</script>

<template>
  <section class="failures-section">
    <v-container style="max-width: 1200px;">

      <div class="section-header mb-6">
        <h2 class="section-title">
          <v-icon color="#E53935" size="26" class="mr-2" style="vertical-align: middle;">mdi-alert-circle</v-icon>
          Common Failures &amp; Solutions
        </h2>
        <p class="section-subtitle">Frequent issues owners report and fixes found by the community.</p>
      </div>

      <!-- Inline form -->
      <div class="failure-form mb-8">
        <v-text-field
          v-model="form.title"
          placeholder="Título de la falla"
          variant="outlined"
          density="comfortable"
          hide-details
          class="mb-3"
          bg-color="white"
          @focus="requireAuth"
          :readonly="!auth.isLoggedIn"
        />
        <v-textarea
          v-model="form.problem"
          placeholder="Describe el problema..."
          variant="outlined"
          rows="3"
          hide-details
          class="mb-3"
          bg-color="white"
          @focus="requireAuth"
          :readonly="!auth.isLoggedIn"
        />

        <v-checkbox
          v-model="form.hasSolution"
          label="Ya encontré una solución"
          density="compact"
          hide-details
          class="mb-2"
          :disabled="!auth.isLoggedIn"
          @click="requireAuth"
        />

        <v-expand-transition>
          <v-textarea
            v-if="form.hasSolution"
            v-model="form.solution"
            placeholder="Describe la solución..."
            variant="outlined"
            rows="3"
            hide-details
            class="mb-3"
            bg-color="white"
          />
        </v-expand-transition>

        <v-alert v-if="submitError" type="error" variant="tonal" density="compact" class="mb-3">
          {{ submitError }}
        </v-alert>

        <div class="d-flex justify-end">
          <v-btn
            color="primary"
            flat
            class="submit-btn"
            :loading="submitting"
            :disabled="auth.isLoggedIn && (!form.title || !form.problem)"
            @click="submitFailure"
          >
            Reportar
          </v-btn>
        </div>
      </div>

      <v-divider class="mb-6" />

      <!-- Filters -->
      <div class="filters-bar mb-4">
        <v-text-field
          v-model="search"
          placeholder="Buscar"
          variant="outlined"
          density="compact"
          hide-details
          prepend-inner-icon="mdi-magnify"
          class="filter-search"
          bg-color="white"
        />
        <v-select
          v-model="selectedStatus"
          :items="statusOptions"
          item-title="title"
          item-value="value"
          placeholder="Estado"
          variant="outlined"
          density="compact"
          hide-details
          clearable
          class="filter-select"
          bg-color="white"
        />
        <v-select
          v-model="selectedSort"
          :items="sortOptions"
          item-title="title"
          item-value="value"
          variant="outlined"
          density="compact"
          hide-details
          class="filter-select"
          bg-color="white"
        />
      </div>

      <p class="showing-label mb-4">Mostrando {{ filteredFailures.length }} fallas</p>

      <!-- List -->
      <div v-if="loadingFailures" class="d-flex justify-center py-8">
        <v-progress-circular indeterminate color="primary" />
      </div>

      <div v-else-if="filteredFailures.length === 0" class="text-center py-8">
        <p class="text-medium-emphasis">No hay fallas reportadas aún. ¡Sé el primero!</p>
      </div>

      <div v-else class="issues-list">
        <div v-for="failure in filteredFailures" :key="failure.id" class="issue-card">
          <div class="vote-column">
            <button
              class="vote-btn"
              :class="{ active: userVotes[failure.id] === 'up' }"
              @click="vote(failure, 'up')"
            >
              <v-icon size="18">mdi-thumb-up-outline</v-icon>
            </button>
            <span class="vote-count">{{ failure.votes }}</span>
            <button
              class="vote-btn"
              :class="{ active: userVotes[failure.id] === 'down' }"
              @click="vote(failure, 'down')"
            >
              <v-icon size="18">mdi-thumb-down-outline</v-icon>
            </button>
          </div>

          <div class="issue-content">
            <div class="issue-header">
              <span class="issue-title">{{ failure.title }}</span>
              <v-chip
                :color="failure.status === 'resolved' ? 'success' : 'warning'"
                size="x-small"
                variant="tonal"
                class="status-chip"
              >
                {{ failure.status === 'resolved' ? 'Resolved' : 'Open' }}
              </v-chip>
            </div>

            <div class="issue-meta">
              {{ failure.profiles?.name }} &bull; {{ formatDate(failure.created_at) }}
            </div>

            <div class="issue-block">
              <span class="block-label">Problem:</span>
              <span class="block-text">{{ failure.problem }}</span>
            </div>

            <div v-if="failure.solution" class="issue-block">
              <span class="block-label">Solution:</span>
              <span class="block-text">{{ failure.solution }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="hasMore" class="d-flex justify-center mt-8">
        <v-btn
          variant="outlined"
          color="secondary"
          class="load-more-btn"
          :loading="loadingMore"
          @click="loadMore"
        >
          Load more
        </v-btn>
      </div>

    </v-container>
  </section>

  <AuthModal v-model="showAuthModal" />
</template>

<style scoped>
.failures-section {
  background: #fff;
  padding: 56px 0 80px;
}

.section-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 6px 0;
}

.section-subtitle {
  font-size: 0.875rem;
  color: #757575;
  margin: 0;
}

.failure-form {
  background: #FAFAFA;
  border: 1px solid #EEEEEE;
  border-radius: 12px;
  padding: 20px;
}

.submit-btn {
  text-transform: none;
  letter-spacing: 0;
  font-weight: 600;
}

.filters-bar {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-search {
  flex: 2;
  min-width: 200px;
}

.filter-select {
  flex: 1;
  min-width: 140px;
}

.showing-label {
  font-size: 0.8rem;
  color: #9E9E9E;
  margin: 0;
}

.issues-list {
  display: flex;
  flex-direction: column;
  border: 1px solid #EEEEEE;
  border-radius: 10px;
  overflow: hidden;
}

.issue-card {
  display: flex;
  gap: 20px;
  background: #fff;
  border-bottom: 1px solid #EEEEEE;
  padding: 20px;
}

.issue-card:last-child {
  border-bottom: none;
}

.vote-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 36px;
  padding-top: 2px;
}

.vote-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #BDBDBD;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: color 0.15s;
}

.vote-btn:hover { color: #1565C0; }
.vote-btn.active { color: #1565C0; }

.vote-count {
  font-size: 0.85rem;
  font-weight: 700;
  color: #424242;
}

.issue-content {
  flex: 1;
  min-width: 0;
}

.issue-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
  flex-wrap: wrap;
}

.issue-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a1a1a;
}

.status-chip {
  font-size: 0.7rem !important;
  font-weight: 600;
}

.issue-meta {
  font-size: 0.75rem;
  color: #9E9E9E;
  margin-bottom: 12px;
}

.issue-block {
  font-size: 0.825rem;
  color: #555;
  line-height: 1.6;
  margin-bottom: 8px;
}

.issue-block:last-child { margin-bottom: 0; }

.block-label {
  font-weight: 600;
  color: #424242;
  margin-right: 4px;
}

.block-text { color: #616161; }

.load-more-btn {
  text-transform: none;
  letter-spacing: 0;
  font-weight: 500;
  border-color: #BDBDBD;
  color: #424242;
  padding: 0 32px;
  height: 42px;
}
</style>
