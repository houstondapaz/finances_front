import { Category } from "./category"
import { User } from "./user"

export interface Transaction {
    id?: string
    value: number
    date: Date | string
    category: Category
    description?: string
    createdAt?: Date
    createdBy?: User
}