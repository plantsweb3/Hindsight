import {
  initDb,
  getUserConversations,
  getConversation,
  getConversationHistory,
  updateConversationTitle,
  archiveConversation,
  deleteConversation,
} from '../lib/db.js'
import { authenticateRequest, json, error, cors } from '../lib/auth.js'

// Ensure DB is initialized
let dbInitialized = false
async function ensureDb() {
  if (!dbInitialized) {
    await initDb()
    dbInitialized = true
  }
}

export default async function handler(req, res) {
  // Handle CORS
  cors(res, req)
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  await ensureDb()

  // Authenticate
  const decoded = authenticateRequest(req)
  if (!decoded) {
    return error(res, 'Authentication required', 401)
  }

  const { path } = req.query
  const route = Array.isArray(path) ? path.join('/') : (path || '')

  try {
    // GET /api/conversations - List all conversations
    if (route === '' && req.method === 'GET') {
      const includeArchived = req.query.includeArchived === 'true'
      const conversations = await getUserConversations(decoded.id, includeArchived)
      return json(res, conversations)
    }

    // Parse conversation ID from route
    const conversationIdMatch = route.match(/^([^/]+)(\/(.+))?$/)
    if (!conversationIdMatch) {
      return error(res, 'Not found', 404)
    }

    const conversationId = conversationIdMatch[1]
    const subRoute = conversationIdMatch[3] || ''

    // Verify conversation exists and belongs to user
    const conversation = await getConversation(conversationId, decoded.id)
    if (!conversation) {
      return error(res, 'Conversation not found', 404)
    }

    // GET /api/conversations/:id - Get conversation with messages
    if (subRoute === '' && req.method === 'GET') {
      const messages = await getConversationHistory(conversationId)
      return json(res, {
        ...conversation,
        messages,
      })
    }

    // PATCH /api/conversations/:id - Update title
    if (subRoute === '' && req.method === 'PATCH') {
      const { title } = req.body

      if (!title || typeof title !== 'string') {
        return error(res, 'Title is required', 400)
      }

      if (title.length > 100) {
        return error(res, 'Title too long (max 100 characters)', 400)
      }

      await updateConversationTitle(conversationId, decoded.id, title.trim())
      return json(res, { success: true })
    }

    // DELETE /api/conversations/:id - Delete conversation
    if (subRoute === '' && req.method === 'DELETE') {
      await deleteConversation(conversationId, decoded.id)
      return json(res, { success: true })
    }

    // POST /api/conversations/:id/archive - Archive conversation
    if (subRoute === 'archive' && req.method === 'POST') {
      await archiveConversation(conversationId, decoded.id)
      return json(res, { success: true })
    }

    // 404 for unmatched routes
    return error(res, 'Not found', 404)

  } catch (err) {
    console.error('[Conversations API] Error:', err)
    return error(res, 'Internal server error', 500)
  }
}
