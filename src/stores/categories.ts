import { defineStore } from 'pinia'
import { Category } from '../interfaces';
import { Filter, filterToApiPagination } from '../interfaces/pagination';
import { createCategory, filterCategories, updateCategory } from '../services/categories.service';

export interface CategoryStore {
    _categories: Category[],
    pagination: {
        page: number,
        rowsNumber: number,
        rowsPerPage: number
    },
    total: number
    totalPages: number
    searching: boolean
}

export const useCategoryStore = defineStore('category', {
    state: (): CategoryStore => ({
        _categories: [],
        pagination: {
            page: 1,
            rowsNumber: 50,
            rowsPerPage: 50
        },
        total: 0,
        totalPages: 0,
        searching: false
    }),
    getters: {
        categories: (state) => state._categories,
    },
    actions: {
        async filterTransactions(filter: Filter) {
            this.searching = true
            try {
                const response = await filterCategories(filterToApiPagination(filter))
                this._categories = response.categories
                this.total = response.total
                this.totalPages = response.pages
            } finally {
                this.searching = false
            }
        },
        async upsertCategory(category: Category) {
            if (category.id) {
                return await updateCategory(category.id, category)
            }

            await createCategory(category)
        },
        setPage(page: number) {
            this.pagination.page = page
        }
    },
})
