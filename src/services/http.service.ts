import axios from "axios"

const BASE_URL = 'http://localhost:3000/api/'

export async function Get<T>(endpoint: string): Promise<T> {
    try {
        return (await axios.get(BASE_URL + endpoint)).data
    } catch (err: any) {
        throw new Error('Could not get data from end point: ' + endpoint, err)
    }
}

export async function Put<T, P = T>(endpoint: string, data: P): Promise<T> {
    try {
        return (await axios.put(BASE_URL + endpoint, data)).data
    } catch (err: any) {
        throw new Error('Could not put data to end point: ' + endpoint, err)
    }
}

export async function Post<T, P = T>(endpoint: string, data: P): Promise<T> {
    try {
        return (await axios.post(BASE_URL + endpoint, data)).data
    } catch (err: any) {
        throw new Error('Could not post data to end point: ' + endpoint, err)
    }
}

export async function Delete<T>(endpoint: string): Promise<T> {
    try {
        return (await axios.delete(BASE_URL + endpoint)).data
    } catch (err: any) {
        throw new Error('Could not post delete from end point: ' + endpoint, err)
    }
}
