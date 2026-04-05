<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth.js'
import { useI18n } from 'vue-i18n'

defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue'])

const { t } = useI18n()
const auth = useAuthStore()
const tab = ref('login')
const loading = ref(false)
const errorMsg = ref('')
const registered = ref(false)

const loginForm = ref({ email: '', password: '' })
const registerForm = ref({ name: '', email: '', password: '' })

function close() {
  emit('update:modelValue', false)
  errorMsg.value = ''
  registered.value = false
  loginForm.value = { email: '', password: '' }
  registerForm.value = { name: '', email: '', password: '' }
}

function switchTab(t) {
  tab.value = t
  errorMsg.value = ''
}

async function handleLogin() {
  errorMsg.value = ''
  loading.value = true
  try {
    await auth.signIn(loginForm.value.email, loginForm.value.password)
    close()
  } catch {
    errorMsg.value = t('auth.loginError')
  } finally {
    loading.value = false
  }
}

async function handleRegister() {
  errorMsg.value = ''
  loading.value = true
  try {
    await auth.signUp(registerForm.value.email, registerForm.value.password, registerForm.value.name)
    registered.value = true
    registerForm.value = { name: '', email: '', password: '' }
  } catch (e) {
    errorMsg.value = e.message ?? t('auth.registerError')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-dialog :model-value="modelValue" max-width="440" @update:model-value="close">
    <v-card rounded="xl">
      <v-card-text class="pa-10">

        <!-- Success state -->
        <div v-if="registered" class="success-view">
          <div class="success-icon-wrapper mb-6">
            <v-icon color="#6aaa64" size="72">mdi-check-circle-outline</v-icon>
          </div>
          <h2 class="success-title mb-4">{{ t('auth.successTitle') }}</h2>
          <p class="success-subtitle mb-8">{{ t('auth.successMessage') }}</p>
          <v-btn variant="outlined" class="close-btn" @click="close">{{ t('auth.close') }}</v-btn>
        </div>

        <!-- Form state -->
        <template v-else>
          <div class="d-flex align-center justify-space-between mb-6">
            <h2 class="modal-title">
              {{ tab === 'login' ? t('auth.login') : t('auth.createAccount') }}
            </h2>
            <v-btn icon variant="text" size="small" @click="close">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>

          <div class="tab-switcher mb-6">
            <button class="tab-btn" :class="{ active: tab === 'login' }" @click="switchTab('login')">
              {{ t('auth.login') }}
            </button>
            <button class="tab-btn" :class="{ active: tab === 'register' }" @click="switchTab('register')">
              {{ t('auth.register') }}
            </button>
          </div>

          <v-alert v-if="errorMsg" type="error" variant="tonal" class="mb-4" density="compact">
            {{ errorMsg }}
          </v-alert>

          <!-- Login -->
          <form v-if="tab === 'login'" @submit.prevent="handleLogin">
            <div class="field-label">{{ t('auth.email') }}</div>
            <v-text-field
              v-model="loginForm.email"
              type="email"
              :placeholder="t('auth.emailPlaceholder')"
              variant="outlined"
              density="comfortable"
              hide-details
              class="mb-4"
              required
            />
            <div class="field-label">{{ t('auth.password') }}</div>
            <v-text-field
              v-model="loginForm.password"
              type="password"
              placeholder="••••••••"
              variant="outlined"
              density="comfortable"
              hide-details
              class="mb-6"
              required
            />
            <v-btn type="submit" color="primary" block flat :loading="loading" class="auth-btn">
              {{ t('auth.login') }}
            </v-btn>
          </form>

          <!-- Register -->
          <form v-else @submit.prevent="handleRegister">
            <div class="field-label">{{ t('auth.name') }}</div>
            <v-text-field
              v-model="registerForm.name"
              :placeholder="t('auth.namePlaceholder')"
              variant="outlined"
              density="comfortable"
              hide-details
              class="mb-4"
              required
            />
            <div class="field-label">{{ t('auth.email') }}</div>
            <v-text-field
              v-model="registerForm.email"
              type="email"
              :placeholder="t('auth.emailPlaceholder')"
              variant="outlined"
              density="comfortable"
              hide-details
              class="mb-4"
              required
            />
            <div class="field-label">{{ t('auth.password') }}</div>
            <v-text-field
              v-model="registerForm.password"
              type="password"
              :placeholder="t('auth.passwordPlaceholder')"
              variant="outlined"
              density="comfortable"
              hide-details
              class="mb-6"
              required
            />
            <v-btn type="submit" color="primary" block flat :loading="loading" class="auth-btn">
              {{ t('auth.createAccount') }}
            </v-btn>
          </form>
        </template>

      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.modal-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a1a1a;
}

.tab-switcher {
  display: flex;
  background: #F5F5F5;
  border-radius: 8px;
  padding: 4px;
  gap: 4px;
}

.tab-btn {
  flex: 1;
  border: none;
  background: transparent;
  padding: 8px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #757575;
  cursor: pointer;
  transition: all 0.15s;
}

.tab-btn.active {
  background: white;
  color: #1a1a1a;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}

.field-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: #424242;
  margin-bottom: 6px;
}

.auth-btn {
  text-transform: none;
  letter-spacing: 0;
  font-weight: 600;
  height: 44px;
}

.success-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 16px 0;
}

.success-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #1a1a1a;
  line-height: 1.2;
}

.success-subtitle {
  font-size: 1rem;
  color: #424242;
  line-height: 1.5;
  margin: 0;
}

.close-btn {
  text-transform: none;
  letter-spacing: 0;
  font-weight: 500;
  font-size: 1rem;
  border-color: #1a1a1a;
  color: #1a1a1a;
  border-radius: 10px;
  padding: 0 32px;
  height: 48px;
}
</style>
