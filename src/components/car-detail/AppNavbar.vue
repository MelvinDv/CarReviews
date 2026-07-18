<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth.js'
import AuthModal from '../auth/AuthModal.vue'
import { useI18n } from 'vue-i18n'

defineProps({
  variant: {
    type: String,
    default: 'transparent', // 'transparent' | 'light'
  },
})

const auth = useAuthStore()
const showAuthModal = ref(false)
const drawerOpen = ref(false)
const { t, locale } = useI18n()

function toggleLocale() {
  locale.value = locale.value === 'es' ? 'en' : 'es'
  localStorage.setItem('locale', locale.value)
}
</script>

<template>
  <v-app-bar
    flat
    :color="variant === 'light' ? 'white' : 'transparent'"
    :class="['app-navbar', `app-navbar--${variant}`]"
    :elevation="0"
    :border="variant === 'light' ? 'b' : false"
  >
    <v-container class="d-flex align-center pa-0 px-sm-0 px-2" style="max-width: 1200px">
      <router-link to="/" class="navbar-logo" :class="`navbar-logo--${variant}`">
        <v-icon :color="variant === 'light' ? '#1565C0' : 'white'" size="20" class="mr-1">mdi-car</v-icon>
        <span>Car</span><span class="logo-accent">Reviews.</span>
      </router-link>

      <v-spacer />

      <!-- Desktop -->
      <nav class="navbar-links d-none d-md-flex">
        <router-link to="/marketplace" class="nav-link" :class="`nav-link--${variant}`">{{ t('nav.marketplace') }}</router-link>
        <a href="#" class="nav-link" :class="`nav-link--${variant}`">{{ t('nav.about') }}</a>
        <a href="#" class="nav-link" :class="`nav-link--${variant}`">{{ t('nav.testimonials') }}</a>
      </nav>

      <v-btn
        v-if="!auth.isLoggedIn"
        variant="outlined"
        size="small"
        class="ml-6 login-btn d-none d-md-flex"
        :class="`login-btn--${variant}`"
        @click="showAuthModal = true"
      >
        {{ t('nav.login') }}
      </v-btn>

      <v-menu v-else class="d-none d-md-flex">
        <template #activator="{ props: menuProps }">
          <v-avatar
            v-bind="menuProps"
            size="34"
            class="ml-6 user-avatar d-none d-md-flex"
            color="primary"
            style="cursor: pointer;"
          >
            <v-img v-if="auth.profile?.avatar_url" :src="auth.profile.avatar_url" />
            <span v-else class="text-white" style="font-size: 0.8rem; font-weight: 600;">
              {{ auth.profile?.name?.charAt(0).toUpperCase() ?? '?' }}
            </span>
          </v-avatar>
        </template>
        <v-list density="compact" min-width="180">
          <v-list-item>
            <v-list-item-title class="font-weight-medium">{{ auth.profile?.name }}</v-list-item-title>
            <v-list-item-subtitle style="font-size: 0.75rem;">{{ auth.user?.email }}</v-list-item-subtitle>
          </v-list-item>
          <v-divider class="my-1" />
          <v-list-item prepend-icon="mdi-logout" :title="t('nav.logout')" @click="auth.signOut()" />
        </v-list>
      </v-menu>

      <!-- Language toggle -->
      <v-btn
        variant="text"
        size="small"
        class="ml-4 locale-btn"
        :class="`locale-btn--${variant}`"
        @click="toggleLocale"
      >
        <span class="locale-flag">{{ locale === 'es' ? '🇺🇸' : '🇲🇽' }}</span>
        <span class="locale-code">{{ locale === 'es' ? 'EN' : 'ES' }}</span>
      </v-btn>

      <!-- Mobile hamburger -->
      <v-btn
        icon
        variant="text"
        class="d-flex d-md-none"
        :color="variant === 'light' ? '#1a1a1a' : 'white'"
        @click="drawerOpen = true"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-container>
  </v-app-bar>

  <!-- Mobile drawer -->
  <v-navigation-drawer
    v-model="drawerOpen"
    location="right"
    temporary
    width="260"
  >
    <div class="drawer-header">
      <router-link to="/" class="drawer-logo" @click="drawerOpen = false">
        <v-icon color="#1565C0" size="20" class="mr-1">mdi-car</v-icon>
        <span>Car</span><span class="drawer-logo-accent">Reviews.</span>
      </router-link>
      <v-btn icon variant="text" size="small" @click="drawerOpen = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>

    <v-divider />

    <v-list nav>
      <v-list-item :title="t('nav.marketplace')" to="/marketplace" @click="drawerOpen = false" />
      <v-list-item :title="t('nav.about')" href="#" @click="drawerOpen = false" />
      <v-list-item :title="t('nav.testimonials')" href="#" @click="drawerOpen = false" />
    </v-list>

    <v-divider />

    <div class="drawer-auth pa-4">
      <template v-if="!auth.isLoggedIn">
        <v-btn
          color="primary"
          block
          flat
          class="auth-drawer-btn"
          @click="showAuthModal = true; drawerOpen = false"
        >
          {{ t('nav.login') }}
        </v-btn>
      </template>
      <template v-else>
        <div class="drawer-user mb-3">
          <v-avatar size="36" color="primary" class="mr-3">
            <v-img v-if="auth.profile?.avatar_url" :src="auth.profile.avatar_url" />
            <span v-else class="text-white" style="font-size: 0.8rem; font-weight: 600;">
              {{ auth.profile?.name?.charAt(0).toUpperCase() ?? '?' }}
            </span>
          </v-avatar>
          <div>
            <div class="drawer-username">{{ auth.profile?.name }}</div>
            <div class="drawer-email">{{ auth.user?.email }}</div>
          </div>
        </div>
        <v-btn
          variant="outlined"
          block
          class="auth-drawer-btn"
          prepend-icon="mdi-logout"
          @click="auth.signOut(); drawerOpen = false"
        >
          {{ t('nav.logout') }}
        </v-btn>
      </template>
    </div>
  </v-navigation-drawer>

  <AuthModal v-model="showAuthModal" />
</template>

<style scoped>
.app-navbar--transparent {
  position: absolute !important;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
}

.navbar-logo {
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 1.1rem;
  text-decoration: none;
  letter-spacing: -0.3px;
}

.navbar-logo--transparent span { color: white; }
.navbar-logo--light span { color: #1565C0; }
.logo-accent { font-weight: 900; }

.navbar-links {
  display: flex;
  gap: 32px;
}

.nav-link {
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  opacity: 0.9;
  transition: opacity 0.2s;
}

.nav-link--transparent { color: white; }
.nav-link--light { color: #1a1a1a; }
.nav-link:hover { opacity: 1; }

.login-btn {
  text-transform: none;
  letter-spacing: 0;
  font-weight: 500;
  font-size: 0.825rem;
}

.login-btn--transparent {
  color: white !important;
  border-color: rgba(255,255,255,0.6) !important;
}

.login-btn--light {
  color: #1565C0 !important;
  border-color: #1565C0 !important;
}

.user-avatar { transition: opacity 0.2s; }
.user-avatar:hover { opacity: 0.85; }

.locale-btn {
  text-transform: none;
  font-weight: 700;
  font-size: 0.8rem;
  min-width: 36px;
  letter-spacing: 0.5px;
}

.locale-btn--transparent { color: rgba(255,255,255,0.9) !important; }
.locale-btn--light { color: #1a1a1a !important; }

.locale-flag {
  font-size: 1rem;
  line-height: 1;
  margin-right: 4px;
}

.locale-code {
  font-size: 0.75rem;
  font-weight: 700;
}

/* Drawer */
.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
}

.drawer-logo {
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  color: #1565C0;
}

.drawer-logo-accent {
  font-weight: 900;
  color: #1565C0;
}

.drawer-auth {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.auth-drawer-btn {
  text-transform: none;
  letter-spacing: 0;
  font-weight: 600;
}

.drawer-user {
  display: flex;
  align-items: center;
}

.drawer-username {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a1a1a;
}

.drawer-email {
  font-size: 0.75rem;
  color: #9E9E9E;
}
</style>
