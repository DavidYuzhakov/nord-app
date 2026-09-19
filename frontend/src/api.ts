import axios from 'axios'
export const apiInstance = axios.create({
  baseURL: import.meta.env.DEV ? '/api' : 'https://api.nord-app.ru',
})
