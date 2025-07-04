// import axios from 'axios'



// export const API = axios.create({
//     baseURL: 'http://localhost:8000/api/v1',
//     headers:{
//         "Content-Type":"application/json",
//         Accept:"application/json"
//     }
// })


import axios from 'axios'

// Assuming these values are stored in localStorage
const getAccessToken = () => localStorage.getItem('access_token')
const getRefreshToken = () => localStorage.getItem('refresh_token')
const setAccessToken = (token: string) => localStorage.setItem('access_token', token)

export const API = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

// 🔐 Add token to request headers
API.interceptors.request.use(
  config => {
    const token = getAccessToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// 🔄 Refresh token if unauthorized
API.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    // If 401 and hasn't been retried yet
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        const refreshToken = getRefreshToken()

        const response = await axios.post(
          'auth/refresh/',
          { 
            refresh: refreshToken 
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        const newAccessToken = response.data.access
        setAccessToken(newAccessToken)

        // Update header and retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return API(originalRequest)
      } catch (refreshError) {
        console.error('Token refresh failed', refreshError)
        // Optionally, log out the user or redirect to login
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

