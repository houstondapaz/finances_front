import { httpClient } from './http-client'
import { ApiPagination, getPaginationHeadersProperties } from '../interfaces/pagination'
import { AxiosHeaders } from 'axios'
import { Transaction } from '../interfaces'
import { Budget } from '@/interfaces/budget'

export async function filterTransactions(pagination: ApiPagination) {
    const response = await httpClient.get<Transaction[]>('/transactions', {
        params: pagination
    })
    return {
        transactions: response.data,
        ...getPaginationHeadersProperties(response.headers as AxiosHeaders)
    }
}

export async function createTransaction(transaction: Transaction, installments: number = 1) {
    const response = await httpClient.post('/transactions', {
        ...transaction,
        date: (transaction.date as Date).toISOString(),
        categoryId: transaction.category.id,
        installments: Number.parseInt(installments.toString())
    })
    return response.data
}

export async function updateTransaction(id: string, transaction: Transaction) {
    const response = await httpClient.patch(`/transactions/${id}`, {
        ...transaction,
        date: (transaction.date as Date).toISOString(),
        categoryId: transaction.category.id
    })
    return response.data
}

export async function deleteTransaction(id: string) {
    const response = await httpClient.delete(`/transactions/${id}`)
    return response.data
}

export async function getBudget() {
    const response = await httpClient.get<Budget>('/transactions/budget')
    return response.data
}