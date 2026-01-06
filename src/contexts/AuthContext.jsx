import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const API_URL = '/api/auth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('hindsight_token'))
  const [isLoading, setIsLoading] = useState(true)

  // Fetch user on mount if token exists
  useEffect(() => {
    if (token) {
      fetchUser()
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_URL}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (res.ok) {
        const userData = await res.json()
        setUser(userData)
      } else {
        // Token invalid, clear it
        logout()
      }
    } catch (err) {
      console.error('Failed to fetch user:', err)
      logout()
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (username, password) => {
    const res = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Signup failed')
    }

    localStorage.setItem('hindsight_token', data.token)
    setToken(data.token)
    setUser(data.user)

    return data.user
  }

  const login = async (username, password) => {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Login failed')
    }

    localStorage.setItem('hindsight_token', data.token)
    setToken(data.token)
    setUser(data.user)

    return data.user
  }

  const logout = () => {
    localStorage.removeItem('hindsight_token')
    setToken(null)
    setUser(null)
  }

  const saveArchetype = async (primaryArchetype, secondaryArchetype, quizAnswers) => {
    if (!token) return

    const res = await fetch(`${API_URL}/archetype`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ primaryArchetype, secondaryArchetype, quizAnswers }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Failed to save archetype')
    }

    // Update local user state
    setUser(prev => ({
      ...prev,
      primaryArchetype,
      secondaryArchetype,
    }))

    return data
  }

  const saveAnalysis = async (walletAddress, analysis, stats) => {
    if (!token) return null

    const res = await fetch(`${API_URL}/analyses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ walletAddress, analysis, stats }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Failed to save analysis')
    }

    // Update saved wallets in local state
    if (!user.savedWallets?.includes(walletAddress)) {
      setUser(prev => ({
        ...prev,
        savedWallets: [...(prev.savedWallets || []), walletAddress],
      }))
    }

    return data
  }

  const getAnalyses = async () => {
    if (!token) return []

    const res = await fetch(`${API_URL}/analyses`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch analyses')
    }

    return data
  }

  const addWallet = async (walletAddress) => {
    if (!token) return

    const res = await fetch(`${API_URL}/wallets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ walletAddress }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Failed to save wallet')
    }

    setUser(prev => ({ ...prev, savedWallets: data.wallets }))
    return data.wallets
  }

  const removeWallet = async (walletAddress) => {
    if (!token) return

    const res = await fetch(`${API_URL}/wallets/${walletAddress}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Failed to remove wallet')
    }

    setUser(prev => ({ ...prev, savedWallets: data.wallets }))
    return data.wallets
  }

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    signup,
    login,
    logout,
    saveArchetype,
    saveAnalysis,
    getAnalyses,
    addWallet,
    removeWallet,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
