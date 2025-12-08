import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { useNavigate } from 'react-router-dom'

let BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_BACKEND_URL) {
  BACKEND_URL = process.env.REACT_APP_BACKEND_URL
}

export const useSignup = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useAuthContext()
  const navigate = useNavigate()

  const signup = async (username, password) => {
    setIsLoading(true)
    setError(null)

    try {
      // const response = await fetch(`${BACKEND_URL}/users`, {
      const response = await fetch(`/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const json = await response.json()

      if (!response.ok) {
        setError(json.error || 'Signup failed')
        setIsLoading(false)
        return
      }

      // save user and update auth context
      localStorage.setItem('user', JSON.stringify(json))
      dispatch({ type: 'LOGIN', payload: json })

      setIsLoading(false)
      navigate('/')
    }
    catch (err) {
      setError('Network error')
      setIsLoading(false)
    }
  }

  return { signup, isLoading, error };
}
