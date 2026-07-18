<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppNavbar from '../components/car-detail/AppNavbar.vue'
import FiltersPanel from '../components/marketplace/FiltersPanel.vue'
import ListingCard from '../components/marketplace/ListingCard.vue'
import { LISTINGS, filterListings } from '../services/marketplace.js'

const { t } = useI18n()

const search = ref('')
const sort = ref('recent')

const filters = reactive({
  priceMin: null, priceMax: null, makes: [],
  yearMin: null, yearMax: null, conditions: [],
  legalStatuses: [], transmissions: [], hasAc: false,
})

const sortOptions = computed(() => [
  { title: t('marketplace.sort.recent'),    value: 'recent' },
  { title: t('marketplace.sort.priceAsc'),  value: 'price_asc' },
  { title: t('marketplace.sort.priceDesc'), value: 'price_desc' },
  { title: t('marketplace.sort.kmAsc'),     value: 'km_asc' },
])

const listings = computed(() =>
  filterListings(LISTINGS, { search: search.value, sort: sort.value, ...filters })
)

const activeChips = computed(() => {
  const chips = []

  if (filters.yearMin || filters.yearMax) {
    const label = filters.yearMin && filters.yearMax
      ? `${t('marketplace.filters.year')} ${filters.yearMin} – ${filters.yearMax}`
      : filters.yearMin ? `${t('marketplace.filters.year')} ≥ ${filters.yearMin}`
      : `${t('marketplace.filters.year')} ≤ ${filters.yearMax}`
    chips.push({ key: 'year', label, remove: () => { filters.yearMin = null; filters.yearMax = null } })
  }

  if (filters.priceMin || filters.priceMax) {
    const label = filters.priceMin && filters.priceMax
      ? `$${(+filters.priceMin).toLocaleString('es-MX')} – $${(+filters.priceMax).toLocaleString('es-MX')}`
      : filters.priceMin ? `≥ $${(+filters.priceMin).toLocaleString('es-MX')}`
      : `≤ $${(+filters.priceMax).toLocaleString('es-MX')}`
    chips.push({ key: 'price', label, remove: () => { filters.priceMin = null; filters.priceMax = null } })
  }

  filters.makes.forEach(make =>
    chips.push({ key: `make-${make}`, label: make, remove: () => { filters.makes = filters.makes.filter(m => m !== make) } })
  )
  filters.conditions.forEach(c =>
    chips.push({ key: `cond-${c}`, label: t(`marketplace.${c}`), remove: () => { filters.conditions = filters.conditions.filter(x => x !== c) } })
  )
  filters.legalStatuses.forEach(s =>
    chips.push({ key: `legal-${s}`, label: t(`marketplace.filters.${s}`), remove: () => { filters.legalStatuses = filters.legalStatuses.filter(x => x !== s) } })
  )
  filters.transmissions.forEach(tr =>
    chips.push({ key: `tr-${tr}`, label: t(`marketplace.filters.${tr}`), remove: () => { filters.transmissions = filters.transmissions.filter(x => x !== tr) } })
  )

  if (filters.hasAc)
    chips.push({ key: 'ac', label: t('marketplace.filters.hasAc'), remove: () => { filters.hasAc = false } })

  return chips
})

function updateFilters(val) {
  Object.assign(filters, val)
}
</script>

<template>
  <v-main class="pa-0">
    <AppNavbar variant="light" />

    <div class="marketplace-page">
      <!-- Page header -->
      <div class="page-header">
        <v-container style="max-width: 1200px">
          <h1 class="page-title">{{ t('marketplace.title') }}</h1>
          <p class="page-subtitle">{{ t('marketplace.subtitle') }}</p>
        </v-container>
      </div>

      <!-- Search + sort bar -->
      <div class="search-bar-wrap">
        <v-container style="max-width: 1200px; gap: 12px" class="d-flex align-center">
          <v-text-field
            v-model="search"
            :placeholder="t('marketplace.search')"
            variant="outlined"
            density="comfortable"
            hide-details
            prepend-inner-icon="mdi-magnify"
            bg-color="white"
            class="flex-grow-1"
          />
          <v-select
            v-model="sort"
            :items="sortOptions"
            item-title="title"
            item-value="value"
            variant="outlined"
            density="comfortable"
            hide-details
            bg-color="white"
            class="sort-select"
          />
        </v-container>
      </div>

      <!-- Main content -->
      <v-container style="max-width: 1200px" class="content-grid py-6">
        <!-- Filters -->
        <aside>
          <FiltersPanel :model-value="filters" @update:model-value="updateFilters" />
        </aside>

        <!-- Listings -->
        <div>
          <!-- Results bar -->
          <div class="results-bar mb-5">
            <span class="results-count">
              {{ t('marketplace.results', { count: listings.length }) }}
            </span>
            <div class="active-chips">
              <v-chip
                v-for="chip in activeChips"
                :key="chip.key"
                size="small"
                closable
                color="primary"
                variant="tonal"
                class="active-chip"
                @click:close="chip.remove()"
              >
                {{ chip.label }}
              </v-chip>
            </div>
          </div>

          <div v-if="listings.length === 0" class="no-results">
            <p class="text-medium-emphasis">{{ t('marketplace.noResults') }}</p>
          </div>

          <div v-else class="listings-list">
            <ListingCard
              v-for="listing in listings"
              :key="listing.id"
              :listing="listing"
            />
          </div>
        </div>
      </v-container>
    </div>
  </v-main>
</template>

<style scoped>
.marketplace-page {
  background: #F5F5F5;
  min-height: calc(100vh - 64px);
}

.page-header {
  background: #fff;
  border-bottom: 1px solid #E8E8E8;
  padding: 92px 0 20px;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 6px 0;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #757575;
  margin: 0;
}

.search-bar-wrap {
  background: #fff;
  border-bottom: 1px solid #E8E8E8;
  padding: 14px 0;
}

.sort-select {
  max-width: 210px;
  flex-shrink: 0;
}

.content-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  align-items: start;
}

.results-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.results-count {
  font-size: 0.875rem;
  font-weight: 600;
  color: #424242;
  flex-shrink: 0;
}

.active-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.active-chip {
  font-size: 0.75rem !important;
}

.listings-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.no-results {
  text-align: center;
  padding: 64px 0;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  .sort-select {
    max-width: none;
    width: 100%;
  }
}
</style>
