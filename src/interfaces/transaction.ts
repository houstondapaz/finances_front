import { Category } from "./category"
import { User } from "./user"

export interface Transaction {
    id?: string
    value: number
    category: Category
    description?: string
    createdAt?: Date
    createdBy?: User
}