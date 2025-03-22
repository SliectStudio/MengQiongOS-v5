import { ref } from 'vue'

export interface StorageData {
  token?: string;
  userId?: string;
  expires?: number;
}

const storage = {
  get: (key: string) => {
    try {
      const value = localStorage.getItem(key)
      return value ? JSON.parse(value) : null
    } catch (e) {
      console.error('Error reading from storage:', e)
      return null
    }
  },
  
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (e) {
      console.error('Error writing to storage:', e)
      return false
    }
  },
  
  remove: (key: string) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (e) {
      console.error('Error removing from storage:', e)
      return false
    }
  }
}

export const useStorage = () => {
  const getAuth = () => storage.get('auth') as StorageData | null
  const setAuth = (data: StorageData) => storage.set('auth', data)
  const removeAuth = () => storage.remove('auth')
  
  return {
    getAuth,
    setAuth,
    removeAuth
  }
}
