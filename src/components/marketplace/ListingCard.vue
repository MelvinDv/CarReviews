<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../../stores/auth.js'
import AuthModal from '../auth/AuthModal.vue'

const props = defineProps({
  listing: { type: Object, required: true },
})

const { t } = useI18n()
const auth = useAuthStore()
const showContact = ref(false)
const showAuthModal = ref(false)
const currentImage = ref(0)

const images = props.listing.images ?? []

function prevImage() {
  currentImage.value = (currentImage.value - 1 + images.length) % images.length
}

function nextImage() {
  currentImage.value = (currentImage.value + 1) % images.length
}

function revealContact() {
  if (!auth.isLoggedIn) { showAuthModal.value = true; return }
  showContact.value = true
}
</script>

<template>
  <div class="listing-card">
    <!-- Image area -->
    <div class="listing-image-wrap">
      <v-chip
        :color="listing.condition === 'seminuevo' ? 'success' : 'warning'"
        size="small"
        variant="tonal"
        class="condition-chip"
      >
        {{ listing.condition === 'seminuevo' ? t('marketplace.seminuevo') : t('marketplace.usado') }}
      </v-chip>

      <template v-if="images.length">
        <img :src="images[currentImage]" class="listing-img" :alt="`${listing.make} ${listing.model}`" />
        <button v-if="images.length > 1" class="img-nav img-nav--prev" @click.stop="prevImage">
          <v-icon size="18">mdi-chevron-left</v-icon>
        </button>
        <button v-if="images.length > 1" class="img-nav img-nav--next" @click.stop="nextImage">
          <v-icon size="18">mdi-chevron-right</v-icon>
        </button>
      </template>

      <div v-else class="img-placeholder">
        <span class="placeholder-text">{{ listing.make }} {{ listing.model }}</span>
      </div>

      <div class="img-dots">
        <span
          v-for="(_, i) in (images.length || 1)"
          :key="i"
          class="img-dot"
          :class="{ active: i === currentImage }"
        />
      </div>
    </div>

    <!-- Info area -->
    <div class="listing-info">
      <div class="listing-main">
        <div class="listing-header">
          <h3 class="listing-title">{{ listing.make }} {{ listing.model }}</h3>
          <span class="listing-price">${{ listing.price.toLocaleString('es-MX') }}</span>
        </div>

        <p class="listing-meta">
          {{ listing.year }} &middot; {{ listing.km.toLocaleString('es-MX') }} km &middot;
          {{ listing.condition === 'seminuevo' ? t('marketplace.seminuevo') : t('marketplace.usado') }} &middot;
          {{ listing.city }}
        </p>

        <p class="listing-desc">{{ listing.description }}</p>

        <div class="listing-chips">
          <v-chip
            v-for="tag in listing.features"
            :key="tag"
            size="small"
            variant="tonal"
            color="primary"
            class="feature-chip"
          >
            {{ tag }}
          </v-chip>
        </div>
      </div>

      <div class="listing-footer">
        <span class="listing-seller">
          {{ t('marketplace.publishedBy') }} {{ listing.seller_name }} &middot; {{ listing.city }}
        </span>

        <div v-if="showContact" class="contact-reveal">
          <v-icon size="16" color="primary" class="mr-1">mdi-phone</v-icon>
          <span>{{ listing.contact }}</span>
        </div>
        <v-btn
          v-else
          color="primary"
          flat
          class="contact-btn"
          @click="revealContact"
        >
          {{ t('marketplace.showContact') }}
        </v-btn>
      </div>
    </div>
  </div>

  <AuthModal v-model="showAuthModal" />
</template>

<style scoped>
.listing-card {
  display: flex;
  background: #fff;
  border: 1px solid #E8E8E8;
  border-radius: 12px;
  overflow: hidden;
}

.listing-image-wrap {
  position: relative;
  width: 270px;
  flex-shrink: 0;
  background: #EBEBEB;
}

.condition-chip {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
  font-size: 0.7rem !important;
  font-weight: 600 !important;
}

.listing-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.img-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.35);
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: background 0.15s;
}

.img-nav:hover { background: rgba(0, 0, 0, 0.55); }
.img-nav--prev { left: 8px; }
.img-nav--next { right: 8px; }

.img-placeholder {
  width: 100%;
  height: 100%;
  min-height: 210px;
  background-image: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 10px,
    rgba(255, 255, 255, 0.35) 10px,
    rgba(255, 255, 255, 0.35) 20px
  );
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
}

.placeholder-text {
  font-size: 0.75rem;
  color: #9E9E9E;
  text-align: center;
}

.img-dots {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 5px;
}

.img-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transition: background 0.15s;
}
.img-dot.active { background: #fff; }

.listing-info {
  flex: 1;
  min-width: 0;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
}

.listing-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 4px;
}

.listing-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.listing-price {
  font-size: 1.35rem;
  font-weight: 800;
  color: #1565C0;
  white-space: nowrap;
  flex-shrink: 0;
}

.listing-meta {
  font-size: 0.8rem;
  color: #757575;
  margin: 0 0 10px 0;
}

.listing-desc {
  font-size: 0.875rem;
  color: #424242;
  line-height: 1.55;
  margin: 0 0 14px 0;
}

.listing-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.feature-chip {
  font-size: 0.72rem !important;
}

.listing-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 14px;
  border-top: 1px solid #F0F0F0;
}

.listing-seller {
  font-size: 0.8rem;
  color: #9E9E9E;
}

.contact-btn {
  text-transform: none;
  letter-spacing: 0;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.contact-reveal {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1565C0;
  flex-shrink: 0;
}

@media (max-width: 700px) {
  .listing-card { flex-direction: column; }
  .listing-image-wrap { width: 100%; height: 200px; }
}
</style>
