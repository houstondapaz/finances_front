import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'


export const createStore = () => {
    const pinia = createPinia()

    pinia.use(piniaPluginPersistedstate)
    return pinia
}