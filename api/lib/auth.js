import jwt from 'jsonwebtoken'

// JWT_SECRET is required - fail fast if not configured
if (!process.env.JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is required')
}
const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = '7d'

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

export function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization
  if (!authHeader) return null

  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null

  return parts[1]
}

export function authenticateRequest(req) {
  const token = getTokenFromRequest(req)
  if (!token) return null

  const decoded = verifyToken(token)
  return decoded
}

// Helper to send JSON responses
export function json(res, data, status = 200) {
  res.status(status).json(data)
}

// Helper for error responses
export function error(res, message, status = 400) {
  res.status(status).json({ error: message })
}

// CORS headers for API routes
// ALLOWED_ORIGINS should be set in production, defaults to localhost for dev
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175']

export function cors(res, req) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type,X-Admin-Password')

  // Get the request origin
  const origin = req?.headers?.origin

  // Only allow configured origins (no wildcard)
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
}
