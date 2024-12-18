import { defineStore } from 'pinia'
import { Category } from '../interfaces';
import { Filter, FilterOperator, filterToApiPagination } from '../interfaces/pagination';
import { createCategory, filterCategories, updateCategory } from '../services/categories.service';

export interface CategoryStore {
    _categories: Category[],
    pagination: {
        page: number,
        rowsNumber: number,
        rowsPerPage: number
    },
    textFilter: string,
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
            rowsPerPage: 50,
        },
        textFilter: '',
        total: 0,
        totalPages: 0,
        searching: false
    }),
    getters: {
        categories: (state) => state._categories,
        isLastPage: ({ pagination, totalPages }) => pagination.page === totalPages
    },
    actions: {
        async filterTransactions() {
            this.searching = true
            try {
                const filters = []
                if (this.textFilter.length) {
                    filters.push({
                        property: 'name',
                        operator: FilterOperator.LIKE,
                        value: this.textFilter
                    })
                }

                const response = await filterCategories({
                    limit: this.pagination.rowsPerPage,
                    page: this.pagination.page,
                    filters
                })

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
