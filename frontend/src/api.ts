import axios from 'axios'
export const apiInstance = axios.create({
  baseURL: import.meta.env.DEV
    ? 'http://localhost:3000'
    : 'https://api.nord-app.ru',
})
