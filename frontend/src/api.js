const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export async function request(path, options = {}) {
  const response = await fetch(`${apiBase}${path}`, { headers: { 'Content-Type': 'application/json', ...options.headers }, ...options })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.error || `Request failed with status ${response.status}`)
  return body
}
