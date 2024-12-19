import { defineStore, StoreDefinition } from 'pinia'
import { Transaction } from '../interfaces';
import { ApiPagination, Filter, FilterOperator, filterToApiPagination, QueryFilter } from '../interfaces/pagination';
import { createTransaction, deleteTransaction, filterTransactions, updateTransaction } from '../services/transactions.service';
import { BudgetStore, useBudgetStore } from './budget';
import dayjs, { Dayjs } from 'dayjs';

export interface TransactionStore extends Filter {
    _transactions: Transaction[],
    pagination: {
        page: number,
        rowsNumber: number,
        rowsPerPage: number,
        descending: boolean,
        sortBy: string
    },
    total: number
    filterMonth: Dayjs
    totalPages: number
    searching: boolean
}

export const useTransactionStore = defineStore('transaction', {
    state: (): TransactionStore => ({
        _transactions: [],
        pagination: {
            page: 1,
            rowsNumber: 50,
            rowsPerPage: 50,
            descending: true,
            sortBy: 'date'
        },
        total: 0,
        totalPages: 0,
        filterMonth: dayjs(),
        searching: false
    }),
    getters: {
        transactions: (state) => state._transactions,
        tablePagination: ({ pagination }) => pagination
    },
    actions: {
        _createMonthFilter(): QueryFilter[] {
            return [
                {
                    operator: FilterOperator.BETWEEN,
                    value: `${this.filterMonth.startOf('M').toISOString()}|${this.filterMonth.endOf('M').toISOString()}`,
                    property: 'date'
                }
            ]
        },
        async filterTransactions(filter?: Filter) {
            if (filter) {
                this.pagination.page = filter.pagination.page
                this.pagination.rowsPerPage = filter.pagination.rowsPerPage
                this.pagination.descending = filter.pagination.descending
                this.pagination.sortBy = filter.pagination.sortBy
            }

            this.searching = true
            try {
                const response = await filterTransactions({
                    ...filterToApiPagination(this.$state),
                    filters: this._createMonthFilter()
                })
                this._transactions = response.transactions
                this.total = response.total
                this.pagination.rowsNumber = response.total
                this.totalPages = response.pages
            } finally {
                this.searching = false
            }
        },
        async upsertTransaction(transaction: Transaction, installments: number = 1) {
            if (transaction.id) {
                await updateTransaction(transaction.id, transaction)
                await this.updateBudget()
                return
            }

            await createTransaction(transaction, installments)
            await this.updateBudget()
        },
        async deleteTransaction(transaction: Transaction) {
            await deleteTransaction(transaction.id as string)
            await this.filterTransactions()
            await this.updateBudget()
        },
        async updateBudget() {
            const budgetStore = useBudgetStore()
            await budgetStore.getBudget()
        },
        setPage(page: number) {
            this.pagination.page = page
        }
    },
})
