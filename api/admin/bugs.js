import { getBugReports, updateBugReportStatus } from '../lib/db.js'
import { cors, json, error, authenticateRequest } from '../lib/auth.js'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-admin-password-in-env'
const VALID_STATUSES = ['new', 'reviewing', 'resolved']

export default async function handler(req, res) {
  cors(res, req)

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

  if (req.method === 'PATCH') {
    try {
      const { id, status } = req.body

      if (!id) {
        return error(res, 'Report ID is required', 400)
      }

      if (!status || !VALID_STATUSES.includes(status)) {
        return error(res, 'Invalid status. Must be: new, reviewing, or resolved', 400)
      }

      await updateBugReportStatus(id, status)
      console.log(`[Admin] Updated bug report #${id} status to: ${status}`)

      return json(res, { success: true })
    } catch (err) {
      console.error('[Admin] Error updating bug report:', err)
      return error(res, 'Failed to update bug report', 500)
    }
  }

  return error(res, 'Method not allowed', 405)
}
