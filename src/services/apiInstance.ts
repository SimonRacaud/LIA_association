import axios from 'axios'

const API_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:8080'

export const apiInstance = axios.create({
  baseURL: API_URL,
})
