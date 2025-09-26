
'use client'

import { createContext, useContext, useEffect, useReducer } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from './api/getCurrentUser'
import { Users } from '../users/types'
 

type State = { user: Users | null; isLoadingUser: boolean }
type Action =
  | { type: 'LOADED_USER'; payload: Users | null }
  | { type: 'LOGGED_IN'; payload: Users }
  | { type: 'LOGGED_OUT' }

const AuthCtx = createContext<{
  user: Users | null
  isLoadingUser: boolean
  login: (user: Users) => void
  logout: () => Promise<void>
}>({
  user: null,
  isLoadingUser: true,
  login: () => {},
  logout: async () => {},
})

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOADED_USER':
      return { ...state, isLoadingUser: false, user: action.payload };

    case 'LOGGED_IN':
  
      return { ...state, isLoadingUser: false, user: action.payload };

    case 'LOGGED_OUT':
    
      return { ...state, isLoadingUser: false, user: null };

    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { user: null, isLoadingUser: true })
  const router = useRouter()

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        dispatch({ type: 'LOADED_USER', payload: user })
      })
      .catch(() => {
        dispatch({ type: 'LOADED_USER', payload: null })
      })
  }, [])

  const login = (user: Users) => {
    dispatch({ type: 'LOGGED_IN', payload: user });
  };

  const logout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
    dispatch({ type: 'LOGGED_OUT' })
    router.replace('/login')
  }

  return (
    <AuthCtx.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => useContext(AuthCtx)
