import { httpClient } from './http-client'
import { ApiPagination, getPaginationHeadersProperties } from '../interfaces/pagination'
import { AxiosHeaders } from 'axios'
import { Category } from '../interfaces'

export async function filterCategories(pagination: ApiPagination) {
    const response = await httpClient.get<Category[]>('/categories', {
        params: pagination
    })
    return {
        categories: response.data,
        ...getPaginationHeadersProperties(response.headers as AxiosHeaders)
    }
}

export async function createCategory(category: Category) {
    const response = await httpClient.post('/categories', category)
    return response.data
}

export async function updateCategory(id: string, category: Category) {
    const response = await httpClient.put(`/categories/${id}`, category)
    return response.data
}