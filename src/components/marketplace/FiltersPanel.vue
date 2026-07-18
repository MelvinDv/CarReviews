<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { LISTINGS } from '../../services/marketplace.js'

const props = defineProps({
  modelValue: { type: Object, required: true },
})
const emit = defineEmits(['update:modelValue'])

const { t } = useI18n()

function update(key, val) {
  emit('update:modelValue', { ...props.modelValue, [key]: val })
}

function toggleArray(key, value, checked) {
  const arr = props.modelValue[key]
  update(key, checked ? [...arr, value] : arr.filter(x => x !== value))
}

function clear() {
  emit('update:modelValue', {
    priceMin: null, priceMax: null, makes: [],
    yearMin: null, yearMax: null, conditions: [],
    legalStatuses: [], transmissions: [], hasAc: false,
  })
}

const allMakes = computed(() => {
  const counts = {}
  LISTINGS.forEach(l => { counts[l.make] = (counts[l.make] || 0) + 1 })
  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([make, count]) => ({ make, count }))
})

const hasActiveFilters = computed(() => {
  const f = props.modelValue
  return f.priceMin || f.priceMax || f.makes.length || f.yearMin || f.yearMax ||
    f.conditions.length || f.legalStatuses.length || f.transmissions.length || f.hasAc
})
</script>

<template>
  <div class="filters-panel">
    <div class="filters-header">
      <span class="filters-title">{{ t('marketplace.filters.title') }}</span>
      <button v-if="hasActiveFilters" class="clear-btn" @click="clear">
        {{ t('marketplace.filters.clear') }}
      </button>
    </div>

    <!-- Precio -->
    <div class="filter-section">
      <div class="filter-label">{{ t('marketplace.filters.price') }}</div>
      <div class="range-row">
        <v-text-field
          :model-value="modelValue.priceMin"
          :placeholder="t('marketplace.filters.min')"
          type="number"
          variant="outlined"
          density="compact"
          hide-details
          bg-color="white"
          @update:model-value="val => update('priceMin', val ? +val : null)"
        />
        <v-text-field
          :model-value="modelValue.priceMax"
          :placeholder="t('marketplace.filters.max')"
          type="number"
          variant="outlined"
          density="compact"
          hide-details
          bg-color="white"
          @update:model-value="val => update('priceMax', val ? +val : null)"
        />
      </div>
    </div>

    <!-- Marca -->
    <div class="filter-section">
      <div class="filter-label">{{ t('marketplace.filters.make') }}</div>
      <div class="checkbox-list">
        <div v-for="{ make, count } in allMakes" :key="make" class="checkbox-row">
          <v-checkbox
            :model-value="modelValue.makes.includes(make)"
            :label="make"
            density="compact"
            hide-details
            color="primary"
            @update:model-value="val => toggleArray('makes', make, val)"
          />
          <span class="make-count">{{ count }}</span>
        </div>
      </div>
    </div>

    <!-- Año -->
    <div class="filter-section">
      <div class="filter-label">{{ t('marketplace.filters.year') }}</div>
      <div class="range-row">
        <v-text-field
          :model-value="modelValue.yearMin"
          :placeholder="t('marketplace.filters.min')"
          type="number"
          variant="outlined"
          density="compact"
          hide-details
          bg-color="white"
          @update:model-value="val => update('yearMin', val ? +val : null)"
        />
        <v-text-field
          :model-value="modelValue.yearMax"
          :placeholder="t('marketplace.filters.max')"
          type="number"
          variant="outlined"
          density="compact"
          hide-details
          bg-color="white"
          @update:model-value="val => update('yearMax', val ? +val : null)"
        />
      </div>
    </div>

    <!-- Estado -->
    <div class="filter-section">
      <div class="filter-label">{{ t('marketplace.filters.condition') }}</div>
      <div class="checkbox-list">
        <v-checkbox
          v-for="opt in ['seminuevo', 'usado']"
          :key="opt"
          :model-value="modelValue.conditions.includes(opt)"
          :label="t(`marketplace.${opt}`)"
          density="compact"
          hide-details
          color="primary"
          @update:model-value="val => toggleArray('conditions', opt, val)"
        />
      </div>
    </div>

    <!-- Situación legal -->
    <div class="filter-section">
      <div class="filter-label">{{ t('marketplace.filters.legalStatus') }}</div>
      <div class="checkbox-list">
        <v-checkbox
          v-for="opt in ['mexicano', 'legalizado_mx', 'con_decreto']"
          :key="opt"
          :model-value="modelValue.legalStatuses.includes(opt)"
          :label="t(`marketplace.filters.${opt}`)"
          density="compact"
          hide-details
          color="primary"
          @update:model-value="val => toggleArray('legalStatuses', opt, val)"
        />
      </div>
    </div>

    <!-- Transmisión -->
    <div class="filter-section">
      <div class="filter-label">{{ t('marketplace.filters.transmission') }}</div>
      <div class="checkbox-list">
        <v-checkbox
          v-for="opt in ['automatica', 'manual', 'cvt']"
          :key="opt"
          :model-value="modelValue.transmissions.includes(opt)"
          :label="t(`marketplace.filters.${opt}`)"
          density="compact"
          hide-details
          color="primary"
          @update:model-value="val => toggleArray('transmissions', opt, val)"
        />
      </div>
    </div>

    <!-- Aire acondicionado -->
    <div class="filter-section">
      <v-checkbox
        :model-value="modelValue.hasAc"
        :label="t('marketplace.filters.hasAc')"
        density="compact"
        hide-details
        color="primary"
        @update:model-value="val => update('hasAc', val)"
      />
    </div>
  </div>
</template>

<style scoped>
.filters-panel {
  background: #fff;
  border: 1px solid #E8E8E8;
  border-radius: 12px;
  padding: 20px;
  position: sticky;
  top: 88px;
}

.filters-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.filters-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
}

.clear-btn {
  background: none;
  border: none;
  font-size: 0.825rem;
  font-weight: 600;
  color: #1565C0;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}
.clear-btn:hover { opacity: 0.8; }

.filter-section {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #F0F0F0;
}
.filter-section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.filter-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: #1a1a1a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
}

.range-row {
  display: flex;
  gap: 8px;
}

.checkbox-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.checkbox-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.make-count {
  font-size: 0.75rem;
  color: #BDBDBD;
  flex-shrink: 0;
  margin-left: 4px;
}
</style>
