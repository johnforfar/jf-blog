import type { NextApiRequest, NextApiResponse } from 'next'

const BACKEND_URL = process.env.BACKEND_URL

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { path } = req.query
  const fullPath = Array.isArray(path) ? path.join('/') : path

  try {
    const response = await fetch(`${BACKEND_URL}/api/${fullPath}`)
    
    // Forward the content type
    res.setHeader('Content-Type', response.headers.get('Content-Type') || 'application/json')
    
    // Forward the response
    const data = await response.text()
    res.status(response.status).send(data)
  } catch (error) {
    console.error('Proxy error:', error)
    res.status(500).json({ error: 'Failed to fetch from backend' })
  }
} 