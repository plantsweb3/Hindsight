/**
 * Safely parse JSON with fallback value
 * Prevents crashes from corrupted localStorage data
 */
export function safeJsonParse(jsonString, defaultValue = null) {
  if (!jsonString) return defaultValue
  try {
    return JSON.parse(jsonString)
  } catch (err) {
    console.warn('JSON parse failed, using default:', err.message)
    return defaultValue
  }
}

/**
 * Fetch with timeout - prevents infinite hanging requests
 * @param {string} url - The URL to fetch
 * @param {object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds (default 60s)
 * @returns {Promise<Response>}
 */
export function fetchWithTimeout(url, options = {}, timeout = 60000) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  return fetch(url, {
    ...options,
    signal: controller.signal,
  }).finally(() => clearTimeout(timeoutId))
}

/**
 * Fetch with retry logic for transient failures
 * @param {string} url - The URL to fetch
 * @param {object} options - Fetch options
 * @param {number} maxRetries - Max retry attempts (default 3)
 * @param {number} baseDelay - Base delay in ms for exponential backoff (default 1000)
 * @returns {Promise<Response>}
 */
export async function fetchWithRetry(url, options = {}, maxRetries = 3, baseDelay = 1000) {
  let lastError

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, options)

      // Don't retry on client errors (4xx), only server errors (5xx)
      if (response.ok || (response.status >= 400 && response.status < 500)) {
        return response
      }

      // Server error - will retry
      lastError = new Error(`Server error: ${response.status}`)
    } catch (err) {
      lastError = err

      // Don't retry on abort (user cancelled)
      if (err.name === 'AbortError') {
        throw err
      }
    }

    // Exponential backoff with jitter
    if (attempt < maxRetries - 1) {
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 500
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

/**
 * Format error messages to be user-friendly
 */
export function getUserFriendlyError(error) {
  const message = error?.message || error || 'Unknown error'

  // Map technical errors to friendly messages
  const errorMap = {
    'Failed to fetch': 'Unable to connect. Please check your internet connection.',
    'NetworkError': 'Network error. Please check your connection and try again.',
    'AbortError': 'Request was cancelled.',
    'Server error: 500': 'Our servers are having issues. Please try again in a moment.',
    'Server error: 502': 'Service temporarily unavailable. Please try again.',
    'Server error: 503': 'Service is busy. Please try again in a moment.',
    'Server error: 429': 'Too many requests. Please wait a moment and try again.',
    'Invalid or expired token': 'Your session has expired. Please log in again.',
  }

  // Check for matching error patterns
  for (const [pattern, friendly] of Object.entries(errorMap)) {
    if (message.includes(pattern)) {
      return friendly
    }
  }

  // Return original if no match, but clean up technical details
  if (message.includes('JSON')) {
    return 'Received invalid data from server. Please try again.'
  }

  return message
}
