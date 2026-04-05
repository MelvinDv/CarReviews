<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../../stores/auth.js'
import { getReviews, createReview } from '../../services/reviews.js'
import AuthModal from '../auth/AuthModal.vue'

const props = defineProps({
  vehicleId: { type: Number, default: null },
})
const emit = defineEmits(['review-added'])

const { t } = useI18n()
const auth = useAuthStore()
const showAuthModal = ref(false)

// Form
const form = ref({ rating: 0, title: '', body: '' })
const hoverRating = ref(0)
const displayRating = computed(() => hoverRating.value || form.value.rating)
const submitting = ref(false)
const submitError = ref('')

// Reviews list
const reviews = ref([])
const totalCount = ref(0)
const pageSize = 5
const currentTo = ref(pageSize - 1)
const loadingReviews = ref(false)
const loadingMore = ref(false)

const hasMore = computed(() => reviews.value.length < totalCount.value)

watch(() => props.vehicleId, (id) => {
  if (id) fetchReviews()
}, { immediate: true })

async function fetchReviews() {
  if (!props.vehicleId) return
  loadingReviews.value = true
  const { reviews: data, count } = await getReviews(props.vehicleId, { from: 0, to: currentTo.value })
  reviews.value = data
  totalCount.value = count
  loadingReviews.value = false
}

async function loadMore() {
  loadingMore.value = true
  currentTo.value += pageSize
  const { reviews: data, count } = await getReviews(props.vehicleId, { from: 0, to: currentTo.value })
  reviews.value = data
  totalCount.value = count
  loadingMore.value = false
}

function requireAuth() {
  if (!auth.isLoggedIn) showAuthModal.value = true
}

async function submitReview() {
  if (!auth.isLoggedIn) { showAuthModal.value = true; return }
  if (!form.value.rating || !form.value.title || !form.value.body) return
  submitting.value = true
  submitError.value = ''
  try {
    await createReview(props.vehicleId, auth.user.id, form.value)
    form.value = { rating: 0, title: '', body: '' }
    currentTo.value = pageSize - 1
    await fetchReviews()
    emit('review-added')
  } catch (e) {
    submitError.value = t('reviews.error')
  } finally {
    submitting.value = false
  }
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}
</script>

<template>
  <section class="reviews-section">
    <v-container style="max-width: 1200px;">

      <div class="section-header mb-6">
        <h2 class="section-title">{{ t('reviews.title') }}</h2>
        <p class="section-subtitle">{{ t('reviews.subtitle') }}</p>
      </div>

      <!-- Inline review form -->
      <div class="review-form mb-8">
        <!-- Stars -->
        <div class="form-stars mb-3">
          <v-icon
            v-for="i in 5"
            :key="i"
            size="28"
            :color="i <= displayRating ? '#FFC107' : '#E0E0E0'"
            :style="{ cursor: auth.isLoggedIn ? 'pointer' : 'default' }"
            @mouseenter="auth.isLoggedIn && (hoverRating = i)"
            @mouseleave="auth.isLoggedIn && (hoverRating = 0)"
            @click="auth.isLoggedIn ? (form.rating = i) : requireAuth()"
          >
            mdi-star
          </v-icon>
        </div>

        <!-- Title -->
        <v-text-field
          v-model="form.title"
          :placeholder="t('reviews.titlePlaceholder')"
          variant="outlined"
          density="comfortable"
          hide-details
          class="mb-3"
          bg-color="white"
          @focus="requireAuth"
          :readonly="!auth.isLoggedIn"
        />

        <!-- Body -->
        <v-textarea
          v-model="form.body"
          :placeholder="t('reviews.bodyPlaceholder')"
          variant="outlined"
          rows="3"
          hide-details
          class="mb-3"
          bg-color="white"
          @focus="requireAuth"
          :readonly="!auth.isLoggedIn"
        />

        <v-alert v-if="submitError" type="error" variant="tonal" density="compact" class="mb-3">
          {{ submitError }}
        </v-alert>

        <div class="d-flex justify-end">
          <v-btn
            color="primary"
            flat
            class="submit-btn"
            :loading="submitting"
            :disabled="auth.isLoggedIn && (!form.rating || !form.title || !form.body)"
            @click="submitReview"
          >
            {{ t('reviews.submit') }}
          </v-btn>
        </div>
      </div>

      <v-divider class="mb-6" />

      <!-- Reviews list -->
      <div v-if="loadingReviews" class="d-flex justify-center py-8">
        <v-progress-circular indeterminate color="primary" />
      </div>

      <div v-else-if="reviews.length === 0" class="text-center py-8">
        <p class="text-medium-emphasis">{{ t('reviews.empty') }}</p>
      </div>

      <div v-else class="reviews-list">
        <div v-for="review in reviews" :key="review.id" class="review-card">
          <div class="review-header">
            <v-avatar size="48" class="review-avatar" color="primary">
              <v-img v-if="review.profiles?.avatar_url" :src="review.profiles.avatar_url" />
              <span v-else class="text-white" style="font-size: 0.85rem; font-weight: 600;">
                {{ review.profiles?.name?.charAt(0).toUpperCase() ?? '?' }}
              </span>
            </v-avatar>

            <div class="review-meta">
              <span class="reviewer-name">{{ review.profiles?.name }}</span>
              <span class="review-date">{{ formatDate(review.created_at) }}</span>
              <div class="review-stars">
                <v-icon
                  v-for="i in 5"
                  :key="i"
                  size="16"
                  :color="i <= review.rating ? '#FFC107' : '#E0E0E0'"
                >
                  mdi-star
                </v-icon>
              </div>
            </div>
          </div>

          <div class="review-body">
            <h4 class="review-title">{{ review.title }}</h4>
            <p class="review-text">{{ review.body }}</p>
          </div>

          <v-divider class="mt-4" />
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
          {{ t('reviews.loadMore') }}
        </v-btn>
      </div>

    </v-container>
  </section>

  <AuthModal v-model="showAuthModal" />
</template>

<style scoped>
.reviews-section {
  background: #fff;
  padding: 56px 0;
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

.review-form {
  background: #FAFAFA;
  border: 1px solid #EEEEEE;
  border-radius: 12px;
  padding: 20px;
}

.form-stars {
  display: flex;
  gap: 4px;
}

.submit-btn {
  text-transform: none;
  letter-spacing: 0;
  font-weight: 600;
}

.reviews-list {
  display: flex;
  flex-direction: column;
}

.review-card {
  padding: 24px 0;
}

.review-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 12px;
}

.review-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.reviewer-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a1a1a;
}

.review-date {
  font-size: 0.75rem;
  color: #9E9E9E;
}

.review-stars {
  display: flex;
  gap: 1px;
  margin-top: 2px;
}

.review-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.review-text {
  font-size: 0.875rem;
  color: #555;
  line-height: 1.65;
  margin: 0;
}

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
