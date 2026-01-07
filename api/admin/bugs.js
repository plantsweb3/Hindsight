import { getBugReports } from '../lib/db.js'
import { cors, json, error, authenticateRequest } from '../lib/auth.js'

const ADMIN_PASSWORD = 'DeusVult777!'

export default async function handler(req, res) {
  cors(res)

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Check for admin password auth (for hidden route)
  const adminPassword = req.headers['x-admin-password']
  const isAdminAuth = adminPassword === ADMIN_PASSWORD

  // Require either JWT auth or admin password
  const user = authenticateRequest(req)
  if (!user && !isAdminAuth) {
    return error(res, 'Unauthorized', 401)
  }

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
