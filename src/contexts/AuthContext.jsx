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
        console.log('[AuthContext] fetchUser response:', userData)
        console.log('[AuthContext] fetchUser primaryArchetype:', userData.primaryArchetype)
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

  const saveArchetype = async (primaryArchetype, secondaryArchetype, quizAnswers, overrideToken = null) => {
    const currentToken = overrideToken || token || localStorage.getItem('hindsight_token')
    console.log('[AuthContext] saveArchetype called with:', {
      primaryArchetype,
      secondaryArchetype,
      quizAnswers,
      quizAnswersType: typeof quizAnswers,
      quizAnswersIsArray: Array.isArray(quizAnswers),
      hasToken: !!currentToken
    })
    if (!currentToken) {
      console.log('[AuthContext] saveArchetype: No token, returning early')
      return
    }

    const payload = { primaryArchetype, secondaryArchetype, quizAnswers }
    console.log('[AuthContext] Sending to API:', JSON.stringify(payload))

    const res = await fetch(`${API_URL}/archetype`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    console.log('[AuthContext] saveArchetype response:', { ok: res.ok, data })

    if (!res.ok) {
      throw new Error(data.error || 'Failed to save archetype')
    }

    // Update local user state
    console.log('[AuthContext] saveArchetype: Updating user state with archetype')
    setUser(prev => {
      console.log('[AuthContext] saveArchetype: prev user state:', prev)
      const newUser = {
        ...prev,
        primaryArchetype,
        secondaryArchetype,
      }
      console.log('[AuthContext] saveArchetype: new user state:', newUser)
      return newUser
    })

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
      // Handle limit reached error specially
      if (data.error === 'limit_reached') {
        const error = new Error(data.message || 'Wallet limit reached')
        error.code = 'LIMIT_REACHED'
        error.requiresPro = data.requiresPro
        error.limit = data.limit
        error.current = data.current
        throw error
      }
      throw new Error(data.error || 'Failed to save wallet')
    }

    // Update wallet count
    setUser(prev => ({
      ...prev,
      savedWallets: data.wallets,
      walletCount: data.wallets.length,
    }))
    return data.wallets
  }

  // Refresh user data (to get updated counts)
  const refreshUser = async () => {
    if (!token) return
    await fetchUser()
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

  // Update wallet label (Pro feature)
  const updateWalletLabel = async (walletAddress, label) => {
    if (!token) return

    const res = await fetch(`${API_URL}/wallets/${walletAddress}/label`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ label }),
    })

    const data = await res.json()

    if (!res.ok) {
      // Handle Pro required error specially
      if (data.error === 'pro_required') {
        const error = new Error(data.message || 'Wallet labels are a Pro feature')
        error.code = 'PRO_REQUIRED'
        error.requiresPro = data.requiresPro
        throw error
      }
      throw new Error(data.error || 'Failed to update wallet label')
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
    updateWalletLabel,
    refreshUser,
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
