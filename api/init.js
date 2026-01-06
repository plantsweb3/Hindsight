import { initDb } from './lib/db.js'
import { cors, json, error } from './lib/auth.js'

export default async function handler(req, res) {
  cors(res)

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    await initDb()
    return json(res, { success: true, message: 'Database initialized' })
  } catch (err) {
    console.error('Init error:', err)
    return error(res, err.message || 'Failed to initialize database', 500)
  }
}
