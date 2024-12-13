import {
    createRouter,
    createWebHashHistory,
} from 'vue-router';
import { routes } from './routes';
import { useAuthStore } from '../stores/auth';

export const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
});


router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    try {
        // If not authenticated, try to fetch user data
        if (!authStore.isAuthenticated) {
            await authStore.setUser();
        }
        next(); // Allow navigation if authenticated
    } catch {
        authStore.authenticate()
    }

});