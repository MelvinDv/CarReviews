import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import CarDetailPage from '../pages/CarDetailPage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/car/:make/:model/:year', component: CarDetailPage },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
