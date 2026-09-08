import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useQuasar } from 'quasar'

const APPLY_FALLBACK_MS = 15000

export function usePwaUpdate () {
  const $q = useQuasar()

  const isSupported = ref(typeof navigator !== 'undefined' && 'serviceWorker' in navigator)
  const isChecking = ref(false)
  const isDownloading = ref(false)
  const isUpdating = ref(false)
  const updateAvailable = ref(false)
  const isRegistered = ref(false)
  const lastCheckedAt = ref(null)
  const lastError = ref('')
  const remoteVersion = ref('')

  const currentVersion = process.env.APP_VERSION || 'dev'
  const appName = process.env.APP_NAME || 'AQL'
  const buildTime = process.env.BUILD_TIME || ''

  let registration = null
  let applying = false
  let applyTimer = null
  let listenersBound = false

  const status = computed(() => {
    if (!isSupported.value) return { label: 'Not supported', color: 'grey-6', icon: 'block' }
    if (isUpdating.value) return { label: 'Applying', color: 'orange', icon: 'sync' }
    if (updateAvailable.value) return { label: 'Update ready', color: 'warning', icon: 'system_update_alt' }
    if (isDownloading.value) return { label: 'Downloading', color: 'info', icon: 'cloud_download' }
    if (isChecking.value) return { label: 'Checking', color: 'info', icon: 'sync' }
    if (isRegistered.value) return { label: 'Active', color: 'positive', icon: 'verified' }
    return { label: 'Inactive', color: 'grey-6', icon: 'cloud_off' }
  })

  const lastCheckedLabel = computed(() => {
    if (!lastCheckedAt.value) return 'Not checked yet'
    return new Date(lastCheckedAt.value).toLocaleString()
  })

  const buildTimeLabel = computed(() => (buildTime ? new Date(buildTime).toLocaleString() : '—'))

  function markReady () {
    isDownloading.value = false
    updateAvailable.value = true
  }

  function watchWorker (worker) {
    if (!worker) return

    // A first install has no controller, so it is not an update the user must apply.
    if (!navigator.serviceWorker.controller) return

    if (worker.state === 'installing') isDownloading.value = true
    if (worker.state === 'installed') markReady()

    worker.addEventListener('statechange', () => {
      if (worker.state === 'installing') isDownloading.value = true
      else if (worker.state === 'installed') markReady()
      else if (worker.state === 'redundant') isDownloading.value = false
    })
  }

  function bind (reg) {
    registration = reg
    isRegistered.value = !!reg
    if (!reg) return

    if (reg.waiting) markReady()
    watchWorker(reg.installing)

    reg.addEventListener('updatefound', () => watchWorker(reg.installing))
  }

  function onSwUpdated (event) {
    if (event.detail) registration = event.detail
    markReady()
  }

  function onControllerChange () {
    if (!applying) return
    applying = false
    if (applyTimer) clearTimeout(applyTimer)
    window.location.reload()
  }

  async function fetchRemoteVersion () {
    try {
      const response = await fetch(`/version.json?_t=${Date.now()}`, { cache: 'no-store' })
      if (!response.ok) return null
      return await response.json()
    } catch (error) {
      return null
    }
  }

  async function checkForUpdate () {
    lastError.value = ''

    if (!isSupported.value) {
      $q.notify({ message: 'Service workers are not available in this browser.', color: 'grey-8', icon: 'block', position: 'top' })
      return
    }

    if (!registration) {
      registration = await navigator.serviceWorker.getRegistration()
      if (registration) bind(registration)
    }

    if (!registration) {
      lastError.value = 'No service worker is registered. Updates only work in a built (production) app.'
      $q.notify({ message: lastError.value, color: 'grey-8', icon: 'info', position: 'top' })
      return
    }

    isChecking.value = true
    $q.notify({ message: 'Checking for updates…', color: 'info', icon: 'sync', position: 'top', timeout: 1200 })

    try {
      const remote = await fetchRemoteVersion()
      remoteVersion.value = remote?.version || ''

      await registration.update()
      lastCheckedAt.value = Date.now()

      if (registration.waiting) markReady()
      else if (registration.installing) watchWorker(registration.installing)

      if (updateAvailable.value) {
        $q.notify({ message: 'A new version is ready to install.', color: 'warning', icon: 'system_update_alt', position: 'top' })
      } else if (isDownloading.value) {
        $q.notify({ message: 'Downloading the new version…', color: 'info', icon: 'cloud_download', position: 'top' })
      } else if (remoteVersion.value && remoteVersion.value !== currentVersion) {
        $q.notify({ message: `Version ${remoteVersion.value} is on the server. Files are still being fetched.`, color: 'info', icon: 'info', position: 'top' })
      } else {
        $q.notify({ message: 'App is up to date.', color: 'positive', icon: 'check_circle', position: 'top' })
      }
    } catch (error) {
      lastError.value = error?.message || 'Update check failed.'
      $q.notify({ message: lastError.value, color: 'negative', icon: 'error', position: 'top' })
    } finally {
      isChecking.value = false
    }
  }

  async function applyUpdate () {
    if (!updateAvailable.value || isUpdating.value) return

    isUpdating.value = true
    applying = true

    try {
      if (!registration) registration = await navigator.serviceWorker.getRegistration()
      const worker = registration?.waiting
      if (!worker) throw new Error('The new version is not ready yet. Please check again.')

      worker.postMessage({ type: 'SKIP_WAITING' })

      // Some browsers activate without firing controllerchange, so reload anyway.
      applyTimer = setTimeout(() => {
        if (!applying) return
        applying = false
        window.location.reload()
      }, APPLY_FALLBACK_MS)
    } catch (error) {
      isUpdating.value = false
      applying = false
      lastError.value = error?.message || 'Could not apply the update.'
      $q.notify({ message: lastError.value, color: 'negative', icon: 'error', position: 'top' })
    }
  }

  onMounted(async () => {
    if (!isSupported.value) return
    document.addEventListener('swUpdated', onSwUpdated)
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange)
    listenersBound = true

    const reg = await navigator.serviceWorker.getRegistration()
    bind(reg || null)
  })

  onBeforeUnmount(() => {
    if (applyTimer) clearTimeout(applyTimer)
    if (!listenersBound) return
    document.removeEventListener('swUpdated', onSwUpdated)
    navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange)
  })

  return {
    isSupported,
    isRegistered,
    isChecking,
    isDownloading,
    isUpdating,
    updateAvailable,
    lastError,
    status,
    lastCheckedAt,
    lastCheckedLabel,
    buildTimeLabel,
    appName,
    currentVersion,
    remoteVersion,
    checkForUpdate,
    applyUpdate
  }
}
