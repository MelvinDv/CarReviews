import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import CarDetailPage from '../pages/CarDetailPage.vue'
import MarketplacePage from '../pages/MarketplacePage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/car/:make/:model/:year', component: CarDetailPage },
  { path: '/marketplace', component: MarketplacePage },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
