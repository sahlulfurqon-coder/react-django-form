import axios from 'axios'

const baseUrl = 'http://127.0.0.1:8000/'

const AxiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json"
  }
})

AxiosInstance.interceptors.request.use(req => {
  console.log("AXIOS BASE URL:", req.baseURL)
  console.log("AXIOS URL:", req.url)
  console.log("AXIOS FULL:", req.baseURL + req.url)
  return req
})

export default AxiosInstance