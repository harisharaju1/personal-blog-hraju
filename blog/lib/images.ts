/**
 * Extracts Supabase storage paths from markdown image syntax `![alt](url)`.
 * Only URLs that begin with `publicUrlBase` are returned; external URLs are ignored.
 */
export function extractStoragePaths(body: string, publicUrlBase: string): string[] {
  if (!body) return []
  const base = publicUrlBase.endsWith('/') ? publicUrlBase : `${publicUrlBase}/`
  const re = /!\[[^\]]*\]\((https?:\/\/[^)]+)\)/g
  const paths: string[] = []
  let match
  while ((match = re.exec(body)) !== null) {
    const url = match[1]
    if (url.startsWith(base)) paths.push(url.slice(base.length))
  }
  return paths
}
