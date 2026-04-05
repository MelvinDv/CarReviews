<script setup>
const repairs = [
  {
    id: 1,
    name: 'Brake Pad Replacement',
    description: 'Brake pads take over time and need replacement. Includes parts and labor mounting if needed.',
    partsCost: { min: 60, max: 190 },
    laborCost: { min: 80, max: 500 },
  },
  {
    id: 2,
    name: 'Brake Pad Replacement',
    description: 'Brake pads take over time and need replacement. Includes parts and labor mounting if needed.',
    partsCost: { min: 60, max: 190 },
    laborCost: { min: 80, max: 500 },
  },
  {
    id: 3,
    name: 'Brake Pad Replacement',
    description: 'Brake pads take over time and need replacement. Includes parts and labor mounting if needed.',
    partsCost: { min: 60, max: 190 },
    laborCost: { min: 80, max: 500 },
  },
  {
    id: 4,
    name: 'Brake Pad Replacement',
    description: 'Brake pads take over time and need replacement. Includes parts and labor mounting if needed.',
    partsCost: { min: 60, max: 190 },
    laborCost: { min: 80, max: 500 },
  },
]

function formatRange(min, max) {
  return `$${min} – $${max}`
}

function calcTotal(repair) {
  return `$${repair.partsCost.min + repair.laborCost.min} – $${repair.partsCost.max + repair.laborCost.max}`
}
</script>

<template>
  <section class="pricing-section">
    <v-container style="max-width: 1200px;">
      <div class="section-header mb-6">
        <h2 class="section-title">Repair Pricing</h2>
        <p class="section-subtitle">
          Estimated costs for common repairs and maintenance. Prices may vary by location and service provider.
        </p>
      </div>

      <v-alert
        type="info"
        variant="tonal"
        class="mb-8 pricing-alert"
        :icon="false"
      >
        <template #prepend>
          <v-icon color="info" class="mr-3">mdi-information-outline</v-icon>
        </template>
        These prices are sourced from Vehicle Database Repair Pricing API and represent average costs. Always get quotes from multiple service providers before making a decision.
      </v-alert>

      <v-row :gutter="24">
        <v-col
          v-for="repair in repairs"
          :key="repair.id"
          cols="12"
          md="6"
        >
          <div class="repair-card">
            <h3 class="repair-name">{{ repair.name }}</h3>
            <p class="repair-description">{{ repair.description }}</p>

            <div class="cost-table">
              <div class="cost-row">
                <span class="cost-label">Parts Cost</span>
                <span class="cost-value">{{ formatRange(repair.partsCost.min, repair.partsCost.max) }}</span>
              </div>
              <v-divider class="my-2" />
              <div class="cost-row">
                <span class="cost-label">Labor Cost</span>
                <span class="cost-value">{{ formatRange(repair.laborCost.min, repair.laborCost.max) }}</span>
              </div>
            </div>

            <div class="total-row">
              <div class="total-label">
                <v-icon size="16" color="#1565C0" class="mr-1">mdi-currency-usd</v-icon>
                Total Estimated Cost
              </div>
              <span class="total-value">{{ calcTotal(repair) }}</span>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<style scoped>
.pricing-section {
  background: #F5F5F5;
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

.pricing-alert {
  font-size: 0.875rem;
  border-radius: 8px;
}

.repair-card {
  background: #fff;
  border-radius: 10px;
  padding: 24px;
  height: 100%;
  border: 1px solid #E8E8E8;
}

.repair-name {
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.repair-description {
  font-size: 0.8rem;
  color: #757575;
  line-height: 1.55;
  margin: 0 0 16px 0;
}

.cost-table {
  margin-bottom: 0;
}

.cost-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.cost-label {
  font-size: 0.8rem;
  color: #757575;
}

.cost-value {
  font-size: 0.8rem;
  color: #424242;
  font-weight: 500;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #E3F2FD;
  border-radius: 6px;
  padding: 10px 14px;
  margin-top: 12px;
}

.total-label {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: #1565C0;
}

.total-value {
  font-size: 1rem;
  font-weight: 800;
  color: #1565C0;
}
</style>
