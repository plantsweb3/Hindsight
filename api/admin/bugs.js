import { getBugReports } from '../lib/db.js'
import { cors, json, error, authenticateRequest } from '../lib/auth.js'

export default async function handler(req, res) {
  cors(res)

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Require authentication
  const user = authenticateRequest(req)
  if (!user) {
    return error(res, 'Unauthorized', 401)
  }

  // For now, any logged-in user can view bugs
  // TODO: Add admin role check if needed

  if (req.method === 'GET') {
    try {
      const status = req.query?.status || null
      const reports = await getBugReports(status)

      return json(res, { reports })
    } catch (err) {
      console.error('[Admin] Error fetching bug reports:', err)
      return error(res, 'Failed to fetch bug reports', 500)
    }
  }

  return error(res, 'Method not allowed', 405)
}
