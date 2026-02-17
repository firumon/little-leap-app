import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

/**
 * Replace this with your actual Google Apps Script Web App URL 
 * after deploying auth.gs as a Web App.
 */
const GAS_URL = 'https://script.google.com/macros/s/AKfycbx6ZvveFbx3LQQ9bl2Jo5mSobLc04BMcbplagHVX4NzIqWs52n_P0P1HCKMqcUSUkLr-w/exec'

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter()

    // State
    const user = ref(JSON.parse(localStorage.getItem('user')) || null)
    const token = ref(localStorage.getItem('token') || null)
    const loading = ref(false)

    // Getters
    const isAuthenticated = computed(() => !!token.value)
    const userProfile = computed(() => user.value)
    const userRole = computed(() => user.value?.role || 'User')

    // Actions
    function notifyServiceWorker(authToken) {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'SET_AUTH_TOKEN',
                token: authToken
            })
        }
    }

    async function login(email, password) {
        loading.value = true
        try {
            const response = await axios.post(GAS_URL, {
                action: 'login',
                email,
                password
            }, {
                headers: { 'Content-Type': 'text/plain' }
            })

            const data = response.data
            if (data.success) {
                token.value = data.token
                user.value = data.user

                // Persist to local storage
                localStorage.setItem('token', data.token)
                localStorage.setItem('user', JSON.stringify(data.user))

                // Notify Service Worker for token injection
                notifyServiceWorker(data.token)

                return { success: true }
            } else {
                return { success: false, message: data.message || 'Login failed' }
            }
        } catch (error) {
            console.error('Login Error:', error)
            return { success: false, message: 'Unable to connect to service' }
        } finally {
            loading.value = false
        }
    }

    async function updateAvatar(avatarUrl) {
        if (!token.value) return { success: false, message: 'Not authenticated' }

        try {
            const response = await axios.post(GAS_URL, {
                action: 'updateAvatar',
                token: token.value,
                avatarUrl
            }, {
                headers: { 'Content-Type': 'text/plain' }
            })

            if (response.data.success) {
                if (user.value) {
                    user.value.avatar = avatarUrl
                }
                localStorage.setItem('user', JSON.stringify(user.value))
                return { success: true }
            }
            return { success: false, message: response.data.message }
        } catch (error) {
            return { success: false, message: 'Failed to update avatar' }
        }
    }

    function logout() {
        user.value = null
        token.value = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        notifyServiceWorker(null)

        if (router) {
            router.push('/login')
        } else {
            // Fallback if router is not available (e.g. called outside component setup)
            window.location.href = '#/login'
        }
    }

    return {
        // State
        user,
        token,
        loading,

        // Getters
        isAuthenticated,
        userProfile,
        userRole,

        // Actions
        login,
        updateAvatar,
        logout,
        notifyServiceWorker
    }
})
