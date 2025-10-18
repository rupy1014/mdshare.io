'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { User, AuthSession, LoginCredentials, RegisterData, AuthContextType } from '@/types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  const saveSession = (session: AuthSession) => {
    localStorage.setItem('mdshare-access-token', session.accessToken)
    localStorage.setItem('mdshare-refresh-token', session.refreshToken)
    localStorage.setItem('mdshare-user', JSON.stringify(session.user))
    setUser(session.user)
    setIsAuthenticated(true)
  }

  const clearSession = () => {
    localStorage.removeItem('mdshare-access-token')
    localStorage.removeItem('mdshare-refresh-token')
    localStorage.removeItem('mdshare-user')
    setUser(null)
    setIsAuthenticated(false)
  }

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('mdshare-access-token')
    if (token) {
      setIsLoading(true)
      const result = await api.me()
      if (result.success && result.data) {
        setUser(result.data)
        setIsAuthenticated(true)
      } else {
        clearSession()
      }
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    const result = await api.login({ email, password })
    if (result.success && result.data) {
      saveSession(result.data)
      setIsLoading(false)
      return true
    }
    setIsLoading(false)
    return false
  }

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true)
    const result = await api.register(data)
    if (result.success && result.data) {
      saveSession(result.data)
      setIsLoading(false)
      return true
    }
    setIsLoading(false)
    return false
  }

  const logout = () => {
    clearSession()
    router.push('/')
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser
  }

  return React.createElement(
    AuthContext.Provider,
    { value },
    children
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}