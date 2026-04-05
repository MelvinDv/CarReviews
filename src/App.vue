<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth.js'

const auth = useAuthStore()
onMounted(() => auth.init())
</script>

<template>
  <v-app>
    <router-view />
  </v-app>
</template>
