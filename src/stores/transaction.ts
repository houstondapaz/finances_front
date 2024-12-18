import { defineStore } from 'pinia'
import { Transaction } from '../interfaces';
import { ApiPagination, Filter, filterToApiPagination } from '../interfaces/pagination';
import { createTransaction, filterTransactions, updateTransaction } from '../services/transactions.service';

export interface TransactionStore {
    _transactions: Transaction[],
    pagination: {
        page: number,
        rowsNumber: number,
        rowsPerPage: number,
        descending: boolean,
        sortBy: string
    },
    total: number
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
            descending: false,
            sortBy: 'date'
        },
        total: 0,
        totalPages: 0,
        searching: false
    }),
    getters: {
        transactions: (state) => state._transactions,
        tablePagination: ({ pagination }) => pagination
    },
    actions: {
        async filterTransactions(filter?: Filter) {
            if (filter) {
                this.pagination.page = filter.pagination.page
                this.pagination.rowsPerPage = filter.pagination.rowsPerPage
                this.pagination.descending = filter.pagination.descending
                this.pagination.sortBy = filter.pagination.sortBy
            }
            this.searching = true
            try {
                const response = await filterTransactions(filterToApiPagination(filter))
                this._transactions = response.transactions
                this.total = response.total
                this.pagination.rowsNumber = response.total
                this.totalPages = response.pages
            } finally {
                this.searching = false
            }
        },
        async upsertTransaction(transaction: Transaction) {
            if (transaction.id) {
                return await updateTransaction(transaction.id, transaction)
            }

            await createTransaction(transaction)
        },
        setPage(page: number) {
            this.pagination.page = page
        }
    },
})
