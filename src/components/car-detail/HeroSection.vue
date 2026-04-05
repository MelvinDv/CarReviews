<script setup>
defineProps({
  car: {
    type: Object,
    default: () => ({
      make: 'MAZDA',
      model: '3',
      year: 2017,
      rating: 4,
      reviewCount: 128,
      image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1600&q=80',
    }),
  },
})
</script>

<template>
  <div class="hero-section">
    <div
      class="hero-bg"
      :style="{ backgroundImage: `url(${car.image})` }"
    />
    <div class="hero-overlay" />

    <div class="hero-content">
      <v-container style="max-width: 1200px;" class="h-100 d-flex flex-column justify-end pb-10">
        <div class="d-flex align-end justify-space-between">
          <h1 class="hero-title">{{ car.make }} {{ car.model }} {{ car.year }}</h1>

          <div class="rating-badge">
            <span class="rating-number">{{ car.rating ?? '—' }}</span>
            <v-icon color="#FFC107" size="18">mdi-star</v-icon>
            <div class="rating-label">{{ car.reviewCount }} {{ car.reviewCount === 1 ? 'review' : 'reviews' }}</div>
          </div>
        </div>
      </v-container>
    </div>
  </div>
</template>

<style scoped>
.hero-section {
  position: relative;
  width: 100%;
  height: 75vh;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center 40%;
  background-repeat: no-repeat;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.35) 0%,
    rgba(0, 0, 0, 0.1) 40%,
    rgba(0, 0, 0, 0.65) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 2;
  height: 100%;
}

.hero-title {
  font-size: 3.2rem;
  font-weight: 900;
  color: white;
  letter-spacing: 2px;
  text-transform: uppercase;
  line-height: 1;
  text-shadow: 0 2px 12px rgba(0,0,0,0.4);
  margin: 0;
}

.rating-badge {
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 72px;
  flex-shrink: 0;
}

.rating-number {
  font-size: 2rem;
  font-weight: 800;
  color: white;
  line-height: 1;
}

.rating-label {
  font-size: 0.65rem;
  color: rgba(255,255,255,0.7);
  text-align: center;
  margin-top: 2px;
}
</style>
