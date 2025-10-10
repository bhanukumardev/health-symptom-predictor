import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New version available! Reload to update?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline')
  },
  onRegistered(registration) {
    console.log('Service Worker registered', registration)
  },
  onRegisterError(error) {
    console.error('Service Worker registration failed', error)
  }
})
