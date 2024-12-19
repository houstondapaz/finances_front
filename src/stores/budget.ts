import { defineStore } from 'pinia'
import { getBudget } from '@/services/transactions.service';
import dayjs, { Dayjs } from 'dayjs';

export interface BudgetStore {
    budget: number,
    spent: number,
    today: Dayjs
}

export const useBudgetStore = defineStore('budget', {
    state: (): BudgetStore => ({
        budget: 0,
        spent: 0,
        today: dayjs(),
    }),
    getters: {
        dailyBudget: (store) => (store.budget - store.spent) / (store.today.daysInMonth() - store.today.date()),
        percentColor: (store) => store.spent > store.budget ? "negative" : "primary",
        monthSpentPercent: (store) => store.spent / store.budget
    },
    actions: {
        async getBudget() {
            const budget = await getBudget()
            this.budget = budget.budget || 0
            this.spent = budget.spent || 0
        }
    },
})
