import { initDb } from './lib/db.js'
import { cors, json, error } from './lib/auth.js'
import crypto from 'crypto'

export default async function handler(req, res) {
  cors(res, req)

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Require admin password for database initialization
  const adminPassword = req.headers['x-admin-password']
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

  if (!ADMIN_PASSWORD) {
    return error(res, 'Admin endpoint not configured', 503)
  }

  // Use timing-safe comparison to prevent timing attacks
  const isAdminPassword = adminPassword &&
    adminPassword.length === ADMIN_PASSWORD.length &&
    crypto.timingSafeEqual(Buffer.from(adminPassword), Buffer.from(ADMIN_PASSWORD))

  if (!isAdminPassword) {
    return error(res, 'Admin access required', 403)
  }

  try {
    await initDb()
    return json(res, { success: true, message: 'Database initialized' })
  } catch (err) {
    console.error('Init error:', err)
    // Don't expose internal error details
    return error(res, 'Failed to initialize database', 500)
  }
}
