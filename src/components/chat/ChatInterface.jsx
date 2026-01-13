import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import AuthModal from '../AuthModal'

const API_URL = '/api'

// ChatMessage component
function ChatMessage({ message, isStreaming }) {
  const isUser = message.role === 'user'

  return (
    <div className={`chat-message ${isUser ? 'user' : 'assistant'}`}>
      <div className="chat-message-avatar">
        {isUser ? (
          <span className="avatar-icon">You</span>
        ) : (
          <span className="avatar-icon coach">AI</span>
        )}
      </div>
      <div className="chat-message-content">
        <div className="chat-message-text">
          {message.content}
          {isStreaming && <span className="streaming-cursor">|</span>}
        </div>
        {message.createdAt && (
          <div className="chat-message-time">
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </div>
  )
}

// TypingIndicator component
function TypingIndicator() {
  return (
    <div className="chat-message assistant">
      <div className="chat-message-avatar">
        <span className="avatar-icon coach">AI</span>
      </div>
      <div className="chat-message-content">
        <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  )
}

// ChatInput component
function ChatInput({ onSend, disabled, placeholder }) {
  const [input, setInput] = useState('')
  const textareaRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim() || disabled) return
    onSend(input.trim())
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
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px'
    }
  }

  return (
    <form onSubmit={handleSubmit} className="chat-input-form">
      <div className="chat-input-wrapper">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Ask the Hindsight Coach..."}
          disabled={disabled}
          rows={1}
          className="chat-input"
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="chat-send-btn"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" />
          </svg>
        </button>
      </div>
    </form>
  )
}

// ChatSidebar component
function ChatSidebar({ conversations, activeId, onSelect, onNew, onDelete }) {
  return (
    <div className="chat-sidebar">
      <div className="chat-sidebar-header">
        <h3>Conversations</h3>
        <button onClick={onNew} className="chat-new-btn" title="New conversation">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
      <div className="chat-sidebar-list">
        {conversations.length === 0 ? (
          <div className="chat-sidebar-empty">
            No conversations yet
          </div>
        ) : (
          conversations.map(conv => (
            <div
              key={conv.id}
              className={`chat-sidebar-item ${activeId === conv.id ? 'active' : ''}`}
              onClick={() => onSelect(conv.id)}
            >
              <div className="chat-sidebar-item-content">
                <span className="chat-sidebar-item-title">
                  {conv.title || 'New conversation'}
                </span>
                <span className="chat-sidebar-item-count">
                  {conv.messageCount} messages
                </span>
              </div>
              <button
                className="chat-sidebar-item-delete"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(conv.id)
                }}
                title="Delete conversation"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ChatEmptyState component
function ChatEmptyState({ onStartChat }) {
  const suggestions = [
    "Why do I keep selling too early?",
    "How can I improve my entry timing?",
    "What's a good position sizing strategy?",
    "Help me understand my trading patterns",
  ]

  return (
    <div className="chat-empty-state">
      <div className="chat-empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
        </svg>
      </div>
      <h2>Hindsight Coach</h2>
      <p className="chat-empty-description">
        Your AI trading mentor. Ask questions about trading psychology, strategy, or get personalized advice based on your trading data.
      </p>
      <div className="chat-empty-suggestions">
        <p className="suggestions-label">Try asking:</p>
        <div className="suggestions-grid">
          {suggestions.map((suggestion, i) => (
            <button
              key={i}
              className="suggestion-btn"
              onClick={() => onStartChat(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ProUpgradeModal component
function ProUpgradeModal({ onClose, resetsAt }) {
  const resetTime = resetsAt ? new Date(resetsAt).toLocaleString() : 'midnight'

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content pro-upgrade-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
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
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const messagesEndRef = useRef(null)

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
        // Fetch status
        const statusRes = await fetch(`${API_URL}/chat/status`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (statusRes.ok) {
          const status = await statusRes.json()
          setChatStatus(status)
        }

        // Fetch conversations
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
    // Check rate limit for free users
    if (chatStatus && !chatStatus.isPro && !chatStatus.canSendMessage) {
      setShowUpgradeModal(true)
      return
    }

    // Add user message optimistically
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
        // Remove optimistic message
        setMessages(prev => prev.slice(0, -1))
        return
      }

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      // Handle SSE stream
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ''
      let newConversationId = activeConversationId

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
                newConversationId = data.id
                setActiveConversationId(data.id)
              } else if (data.type === 'chunk') {
                fullResponse += data.text
                setStreamingMessage(fullResponse)
              } else if (data.type === 'done') {
                // Streaming complete
                setMessages(prev => [
                  ...prev,
                  { role: 'assistant', content: fullResponse, createdAt: new Date().toISOString() }
                ])
                setStreamingMessage('')
                setIsStreaming(false)

                // Refresh conversations list
                const convRes = await fetch(`${API_URL}/conversations`, {
                  headers: { Authorization: `Bearer ${token}` },
                })
                if (convRes.ok) {
                  const convs = await convRes.json()
                  setConversations(convs)
                }

                // Update status
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
              // Ignore JSON parse errors for incomplete chunks
            }
          }
        }
      }
    } catch (err) {
      console.error('Failed to send message:', err)
      setIsStreaming(false)
      setStreamingMessage('')
      // Remove optimistic message on error
      setMessages(prev => prev.slice(0, -1))
    }
  }

  // Start new conversation
  const startNewConversation = () => {
    setActiveConversationId(null)
    setMessages([])
  }

  // Delete conversation
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

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion)
  }

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="chat-interface loading">
        <div className="chat-loading">
          <div className="chat-loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // Show auth required state if not logged in
  if (!token) {
    return (
      <>
        <div className="chat-interface loading">
          <div className="chat-auth-required">
            <div className="chat-empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
              </svg>
            </div>
            <h2>Hindsight Coach</h2>
            <p>Sign in to start chatting with your AI trading coach.</p>
            <div className="chat-auth-buttons">
              <button onClick={() => setShowAuthModal(true)} className="chat-auth-btn primary">
                Sign In
              </button>
              <button onClick={() => navigate('/')} className="chat-auth-btn secondary">
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
      <div className="chat-interface loading">
        <div className="chat-loading">
          <div className="chat-loading-spinner"></div>
          <p>Loading coach...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`chat-interface ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Mobile sidebar toggle */}
      <button
        className="chat-sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>

      {/* Sidebar */}
      <ChatSidebar
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={setActiveConversationId}
        onNew={startNewConversation}
        onDelete={deleteConversation}
      />

      {/* Main chat area */}
      <div className="chat-main">
        {/* Header */}
        <div className="chat-header">
          <h2>Hindsight Coach</h2>
          {chatStatus && !chatStatus.isPro && (
            <div className="chat-status">
              <span className="chat-limit">
                {chatStatus.messagesRemaining}/{chatStatus.dailyLimit} messages left
              </span>
            </div>
          )}
        </div>

        {/* Messages area */}
        <div className="chat-messages">
          {!activeConversationId && messages.length === 0 ? (
            <ChatEmptyState onStartChat={handleSuggestionClick} />
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Input area */}
        <div className="chat-input-container">
          <ChatInput
            onSend={sendMessage}
            disabled={isStreaming}
            placeholder={
              chatStatus && !chatStatus.isPro && !chatStatus.canSendMessage
                ? "Daily limit reached - upgrade to Pro for unlimited"
                : "Ask the Hindsight Coach..."
            }
          />
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
