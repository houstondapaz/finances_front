import { defineStore } from 'pinia'
import { User } from '../interfaces';

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
        authenticate(user: User) {
            this.user = user;
        },
    },
})
