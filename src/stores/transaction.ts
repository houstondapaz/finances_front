import { defineStore } from 'pinia'
import { Transaction } from '../interfaces';

export interface TransactionStore {
    transactions: Transaction[],
    pagination: {
        page: number,
        rowsNumber: number,
        rowsPerPage: number
    },
    total: number
    searching: boolean
}

export interface Filter {
    pagination: {
        /**
         * Column name (from column definition)
         */
        sortBy: string;
        /**
         * Is sorting in descending order?
         */
        descending: boolean;
        /**
         * Page number (1-based)
         */
        page: number;
        /**
         * How many rows per page? 0 means Infinite
         */
        rowsPerPage: number;
    };
    /**
     * String/Object to filter table with (the 'filter' prop)
     */
    filter?: string | any
}

export const useTransactionStore = defineStore('transaction', {
    state: (): TransactionStore => ({
        transactions: [],
        pagination: {
            page: 1,
            rowsNumber: 50,
            rowsPerPage: 50
        },
        total: 0,
        searching: false
    }),
    getters: {
        transactions: (state) => state.transactions,
    },
    actions: {
        filterTransactions(filter: Filter) {
            this.searching = true
        },
        setPage(page: number) {
            this.pagination.page = page
        }
    },
})
