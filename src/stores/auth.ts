import { defineStore } from 'pinia'
import { User } from '../interfaces';
import { baseURL } from '../services/http-client';
import { getUser } from '../services/auth.service';

export interface AuthStore {
    user: User | null
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthStore => ({
        user: null
    }),
    getters: {
        isAuthenticated: (state) => !!state.user,
    },
    actions: {
        async setUser() {
            this.user = await getUser()
        },
        authenticate(){
            window.location.href = `${baseURL}/auth/google`
        }
    },
})
