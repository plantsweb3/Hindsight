import { createBugReport } from './lib/db.js'
import { cors, json, error } from './lib/auth.js'

export default async function handler(req, res) {
  cors(res)

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return error(res, 'Method not allowed', 405)
  }

  try {
    const { email, description, steps } = req.body

    if (!description || !description.trim()) {
      return error(res, 'Bug description is required', 400)
    }

    // Get user agent from request headers (helpful for debugging)
    const userAgent = req.headers['user-agent'] || null

    const reportId = await createBugReport(
      email?.trim() || null,
      description.trim(),
      steps?.trim() || null,
      userAgent
    )

    console.log(`[BugReport] Created report #${reportId}`)

    return json(res, { success: true, reportId })
  } catch (err) {
    console.error('[BugReport] Error:', err)
    return error(res, 'Failed to submit bug report', 500)
  }
}
