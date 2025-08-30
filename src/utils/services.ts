import axios, { AxiosRequestConfig } from 'axios'

const config: AxiosRequestConfig = {
    headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        Accept: 'application/json, text/plain',
    },
    //withCredentials: true,
    timeout: 5 * 60000,
}

const service = axios.create(config)

const putService = (path: string, data: any, config = { signal: undefined }) => {
    return service.put(path, data, config)
}

const postService = (path: string, data: any, config = { signal: undefined }) => {
    return service.post(path, data, config)
}

const getService = (path: string, config = { signal: undefined }) => {
    return service.get(path, config)
}

const deleteService = (path: string, config = { signal: undefined }) => {
    return service.delete(path, config)
}

export { putService, postService, getService, deleteService, service }