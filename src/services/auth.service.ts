import { User } from "../interfaces"
import { httpClient } from "./http-client"

export const getUser = async () => {
    const response = await httpClient.get<User>('/auth/user')
    return response.data
}