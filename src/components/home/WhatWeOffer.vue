<script setup>
const features = [
  {
    title: 'Real Reviews',
    description: 'Read authentic reviews from real owners about their vehicle experiences.',
    icon: 'mdi-star-outline',
    iconColor: '#F59E0B',
    bgColor: '#FEF3C7',
  },
  {
    title: 'Repair Costs',
    description: 'Get detailed pricing for common repairs including parts and labor.',
    icon: 'mdi-wrench',
    iconColor: '#10B981',
    bgColor: '#D1FAE5',
  },
  {
    title: 'Common Failures',
    description: 'Discover common issues and solutions shared by the community.',
    icon: 'mdi-alert-circle-outline',
    iconColor: '#EF4444',
    bgColor: '#FEE2E2',
  },
  {
    title: 'Community Help',
    description: 'Connect with other owners and get answers to your questions.',
    icon: 'mdi-chat-outline',
    iconColor: '#6366F1',
    bgColor: '#EEF2FF',
  },
]
</script>

<template>
  <section class="offer-section">
    <v-container style="max-width: 1200px;">
      <h2 class="section-title text-center mb-10">What We Offer</h2>

      <v-row>
        <v-col
          v-for="feature in features"
          :key="feature.title"
          cols="12"
          sm="6"
          md="3"
        >
          <v-card class="feature-card" rounded="lg" elevation="0">
            <v-card-text class="d-flex flex-column align-center text-center pa-8">
              <div class="icon-circle mb-5" :style="{ background: feature.bgColor }">
                <v-icon :color="feature.iconColor" size="28">{{ feature.icon }}</v-icon>
              </div>
              <h3 class="feature-title mb-2">{{ feature.title }}</h3>
              <p class="feature-desc">{{ feature.description }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<style scoped>
.offer-section {
  background: #F5F5F5;
  padding: 64px 16px;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1a1a1a;
}

.feature-card {
  border: 1px solid #E8E8E8;
  background: #fff;
  height: 100%;
}

.icon-circle {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
}

.feature-desc {
  font-size: 0.825rem;
  color: #757575;
  line-height: 1.6;
  margin: 0;
}
</style>
