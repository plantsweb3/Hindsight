import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import AuthModal from '../AuthModal'

const API_URL = '/api'

// ChatMessage component
function ChatMessage({ message, isStreaming }) {
  const isUser = message.role === 'user'

  return (
    <div className={`coach-message ${isUser ? 'user' : 'assistant'}`}>
      <div className="coach-message-content">
        <div className="coach-message-text">
          {message.content}
          {isStreaming && <span className="streaming-cursor">|</span>}
        </div>
      </div>
    </div>
  )
}

// TypingIndicator component
function TypingIndicator() {
  return (
    <div className="coach-message assistant">
      <div className="coach-message-content">
        <div className="coach-typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  )
}

// Slide-out Drawer for conversations
function ConversationDrawer({ isOpen, onClose, conversations, activeId, onSelect, onNew, onDelete }) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`coach-drawer-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`coach-drawer ${isOpen ? 'open' : ''}`}>
        <div className="coach-drawer-header">
          <h3>Conversations</h3>
          <button onClick={onNew} className="coach-drawer-new-btn" title="New conversation">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
        <div className="coach-drawer-list">
          {conversations.length === 0 ? (
            <div className="coach-drawer-empty">
              No conversations yet
            </div>
          ) : (
            conversations.map(conv => (
              <div
                key={conv.id}
                className={`coach-drawer-item ${activeId === conv.id ? 'active' : ''}`}
                onClick={() => { onSelect(conv.id); onClose(); }}
              >
                <div className="coach-drawer-item-content">
                  <span className="coach-drawer-item-title">
                    {conv.title || 'New conversation'}
                  </span>
                  <span className="coach-drawer-item-meta">
                    {conv.messageCount} messages
                  </span>
                </div>
                <button
                  className="coach-drawer-item-delete"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(conv.id)
                  }}
                  title="Delete"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}

// ProUpgradeModal component
function ProUpgradeModal({ onClose, resetsAt }) {
  const resetTime = resetsAt ? new Date(resetsAt).toLocaleString() : 'midnight'

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content pro-upgrade-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">&times;</button>
        <div className="pro-upgrade-icon">
          <span>5/5</span>
        </div>
        <h2>Daily Limit Reached</h2>
        <p>
          You've used all 5 free messages today. Upgrade to Pro for unlimited coaching sessions.
        </p>
        <div className="pro-upgrade-benefits">
          <div className="benefit-item">
            <span className="benefit-icon">+</span>
            <span>Unlimited AI coaching</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">+</span>
            <span>Priority response times</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">+</span>
            <span>Advanced analytics</span>
          </div>
        </div>
        <a href="/settings" className="pro-upgrade-cta">
          Upgrade to Pro
        </a>
        <p className="pro-upgrade-reset">
          Or wait until {resetTime} for your free messages to reset.
        </p>
      </div>
    </div>
  )
}

// Main ChatInterface component
export default function ChatInterface() {
  const { user, token, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [conversations, setConversations] = useState([])
  const [activeConversationId, setActiveConversationId] = useState(null)
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState('')
  const [chatStatus, setChatStatus] = useState(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [limitResetTime, setLimitResetTime] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [input, setInput] = useState('')

  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  // Scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingMessage, scrollToBottom])

  // Fetch chat status and conversations on mount
  useEffect(() => {
    if (!token) return

    async function fetchInitialData() {
      try {
        const statusRes = await fetch(`${API_URL}/chat/status`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (statusRes.ok) {
          const status = await statusRes.json()
          setChatStatus(status)
        }

        const convRes = await fetch(`${API_URL}/conversations`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (convRes.ok) {
          const convs = await convRes.json()
          setConversations(convs)
        }
      } catch (err) {
        console.error('Failed to fetch chat data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInitialData()
  }, [token])

  // Load conversation messages when active changes
  useEffect(() => {
    if (!activeConversationId || !token) {
      setMessages([])
      return
    }

    async function loadMessages() {
      try {
        const res = await fetch(`${API_URL}/conversations/${activeConversationId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setMessages(data.messages || [])
        }
      } catch (err) {
        console.error('Failed to load messages:', err)
      }
    }

    loadMessages()
  }, [activeConversationId, token])

  // Send message
  const sendMessage = async (content) => {
    if (chatStatus && !chatStatus.isPro && !chatStatus.canSendMessage) {
      setShowUpgradeModal(true)
      return
    }

    const userMessage = { role: 'user', content, createdAt: new Date().toISOString() }
    setMessages(prev => [...prev, userMessage])
    setIsStreaming(true)
    setStreamingMessage('')

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: content,
          conversationId: activeConversationId,
        }),
      })

      if (response.status === 429) {
        const data = await response.json()
        setLimitResetTime(data.resetsAt)
        setShowUpgradeModal(true)
        setIsStreaming(false)
        setMessages(prev => prev.slice(0, -1))
        return
      }

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))

              if (data.type === 'conversation') {
                setActiveConversationId(data.id)
              } else if (data.type === 'chunk') {
                fullResponse += data.text
                setStreamingMessage(fullResponse)
              } else if (data.type === 'done') {
                setMessages(prev => [
                  ...prev,
                  { role: 'assistant', content: fullResponse, createdAt: new Date().toISOString() }
                ])
                setStreamingMessage('')
                setIsStreaming(false)

                const convRes = await fetch(`${API_URL}/conversations`, {
                  headers: { Authorization: `Bearer ${token}` },
                })
                if (convRes.ok) {
                  const convs = await convRes.json()
                  setConversations(convs)
                }

                if (!chatStatus?.isPro) {
                  setChatStatus(prev => ({
                    ...prev,
                    messagesUsed: (prev?.messagesUsed || 0) + 1,
                    messagesRemaining: Math.max(0, (prev?.messagesRemaining || 5) - 1),
                    canSendMessage: (prev?.messagesRemaining || 5) - 1 > 0,
                  }))
                }
              } else if (data.type === 'error') {
                throw new Error(data.message)
              }
            } catch (e) {
              // Ignore JSON parse errors
            }
          }
        }
      }
    } catch (err) {
      console.error('Failed to send message:', err)
      setIsStreaming(false)
      setStreamingMessage('')
      // Show error as assistant message instead of removing user message
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `Sorry, I couldn't respond. Error: ${err.message}. Please try again.`, createdAt: new Date().toISOString() }
      ])
    }
  }

  const startNewConversation = () => {
    setActiveConversationId(null)
    setMessages([])
    setDrawerOpen(false)
  }

  const deleteConversation = async (id) => {
    if (!confirm('Delete this conversation?')) return

    try {
      const res = await fetch(`${API_URL}/conversations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        setConversations(prev => prev.filter(c => c.id !== id))
        if (activeConversationId === id) {
          setActiveConversationId(null)
          setMessages([])
        }
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim() || isStreaming) return
    sendMessage(input.trim())
    setInput('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleInput = (e) => {
    setInput(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="coach-container">
        <div className="coach-loading">
          <div className="coach-loading-spinner"></div>
        </div>
      </div>
    )
  }

  // Show auth required state
  if (!token) {
    return (
      <>
        <div className="coach-container">
          <div className="coach-center-content">
            <img src="/hindsightlogo.png" alt="Hindsight" className="coach-logo" />
            <h1 className="coach-greeting">Sign in to chat</h1>
            <p className="coach-subtext">Get personalized trading insights powered by AI</p>
            <div className="coach-auth-actions">
              <button onClick={() => setShowAuthModal(true)} className="coach-auth-btn">
                Sign In
              </button>
              <button onClick={() => navigate('/')} className="coach-back-btn">
                Go Back
              </button>
            </div>
          </div>
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
          initialMode="login"
        />
      </>
    )
  }

  if (isLoading) {
    return (
      <div className="coach-container">
        <div className="coach-loading">
          <div className="coach-loading-spinner"></div>
        </div>
      </div>
    )
  }

  const isEmptyState = !activeConversationId && messages.length === 0

  return (
    <div className="coach-container">
      {/* Hamburger menu */}
      <button
        className="coach-menu-btn"
        onClick={() => setDrawerOpen(true)}
        title="Conversations"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>

      {/* Message limit indicator */}
      {chatStatus && !chatStatus.isPro && (
        <div className="coach-limit-indicator">
          {chatStatus.messagesRemaining ?? 5}/{chatStatus.dailyLimit ?? 5}
        </div>
      )}

      {/* Conversation drawer */}
      <ConversationDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={setActiveConversationId}
        onNew={startNewConversation}
        onDelete={deleteConversation}
      />

      {/* Main content area */}
      <div className="coach-main">
        {isEmptyState ? (
          /* Empty state - centered logo and greeting */
          <div className="coach-center-content">
            <img src="/hindsightlogo.png" alt="Hindsight" className="coach-logo" />
            <h1 className="coach-greeting">What's on your mind?</h1>
          </div>
        ) : (
          /* Messages */
          <div className="coach-messages">
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} isStreaming={false} />
            ))}
            {isStreaming && streamingMessage && (
              <ChatMessage
                message={{ role: 'assistant', content: streamingMessage }}
                isStreaming={true}
              />
            )}
            {isStreaming && !streamingMessage && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input area - always at bottom */}
        <div className="coach-input-area">
          <form onSubmit={handleSubmit} className="coach-input-form">
            <div className="coach-input-wrapper">
              <div className="coach-input-glow"></div>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder={
                  chatStatus && !chatStatus.isPro && !chatStatus.canSendMessage
                    ? "Daily limit reached..."
                    : "Ask the Hindsight Coach..."
                }
                disabled={isStreaming || (chatStatus && !chatStatus.isPro && !chatStatus.canSendMessage)}
                rows={1}
                className="coach-input"
              />
              <button
                type="submit"
                disabled={isStreaming || !input.trim()}
                className="coach-send-btn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Pro upgrade modal */}
      {showUpgradeModal && (
        <ProUpgradeModal
          onClose={() => setShowUpgradeModal(false)}
          resetsAt={limitResetTime}
        />
      )}
    </div>
  )
}
