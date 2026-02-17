<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import { requestNotificationPermission, subscribeToPush } from 'src/utils/notifications'

// Use your actual VAPID public key here
const VAPID_PUBLIC_KEY = 'BI-L6k-1_rY9m5_nL0E3X7pA_your_vapid_key_here'

onMounted(async () => {
  const authStore = useAuthStore()
  
  // Sync token with Service Worker on app load
  if (authStore.token) {
    authStore.notifyServiceWorker(authStore.token)
  }

  // Handle Notifications
  const granted = await requestNotificationPermission()
  if (granted && authStore.token) {
    try {
      const subscription = await subscribeToPush(VAPID_PUBLIC_KEY)
      console.log('[App] Push Subscription:', subscription)
      // TODO: Send subscription to your backend (GAS)
    } catch (error) {
      console.error('[App] Push subscription failed:', error)
    }
  }
})
</script>
