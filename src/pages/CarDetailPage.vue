<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppNavbar from '../components/car-detail/AppNavbar.vue'
import HeroSection from '../components/car-detail/HeroSection.vue'
import UserReviews from '../components/car-detail/UserReviews.vue'
import RepairPricing from '../components/car-detail/RepairPricing.vue'
import CommonFailures from '../components/car-detail/CommonFailures.vue'
import { resolveVehicle, getVehicleRating } from '../services/reviews.js'
import { getVehicleInfo } from '../services/carquery.js'
import { getCarImage } from '../services/unsplash.js'

const route = useRoute()
const { make, model, year } = route.params

const vehicleId = ref(null)
const car = ref({
  make: make.toUpperCase(),
  model,
  year,
  rating: null,
  reviewCount: 0,
  image: null,
})

onMounted(async () => {
  const [id, image, info] = await Promise.all([
    resolveVehicle(make, model, year),
    getCarImage(make, model, year),
    getVehicleInfo(make, model, year),
  ])

  vehicleId.value = id
  car.value.image = image
  if (info) car.value.make = info.Make_Name ?? make.toUpperCase()
})

watch(vehicleId, async (id) => {
  if (!id) return
  await refreshRating(id)
})

async function refreshRating(id) {
  const { average, count } = await getVehicleRating(id ?? vehicleId.value)
  car.value.rating = average
  car.value.reviewCount = count
}
</script>

<template>
  <v-main class="pa-0">
    <AppNavbar />
    <HeroSection :car="car" />
    <UserReviews :vehicle-id="vehicleId" @review-added="refreshRating()" />
    <RepairPricing />
    <CommonFailures :vehicle-id="vehicleId" />
  </v-main>
</template>
