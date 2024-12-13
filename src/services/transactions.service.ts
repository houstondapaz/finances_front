import { httpClient } from './http-client'
import { ApiPagination, getPaginationHeadersProperties } from '../interfaces/pagination'
import { AxiosHeaders } from 'axios'
import { Transaction } from '../interfaces'

export async function filterTransactions(pagination: ApiPagination) {
    const response = await httpClient.get<Transaction[]>('/transactions', {
        params: pagination
    })
    return {
        transactions: response.data,
        ...getPaginationHeadersProperties(response.headers as AxiosHeaders)
    }
}

export async function createTransaction(transaction: Transaction) {
    const response = await httpClient.post('/transactions', transaction)
    return response.data
}

export async function updateTransaction(id: string, transaction: Transaction) {
    const response = await httpClient.put(`/transactions/${id}`, transaction)
    return response.data
}