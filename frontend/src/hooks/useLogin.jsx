import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_BACKEND_URL) {
    BACKEND_URL = process.env.REACT_APP_BACKEND_URL
}

export const useLogin = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const {dispatch} = useAuthContext()
    const navigate = useNavigate();

    const login = async (username, password) =>
    {
        setIsLoading(true)
        setError(null)

        try 
        {
            const response = await fetch(`${BACKEND_URL}/login`, 
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, password}),
            })

            const json = await response.json()

            if (!response.ok) 
            {
                setError(json.error || 'Login failed')
                setIsLoading(false)
                return
            }

            // save the user to local storage
            localStorage.setItem('user', JSON.stringify(json))

            // update the auth context
            dispatch({type: 'LOGIN', payload: json})

            setIsLoading(false)

            // redirect to home page after login
            navigate('/')

        } 

        catch (err) 
        {
            setError('Network error')
            setIsLoading(false)
        }
    }

    return { login, isLoading, error };
}
