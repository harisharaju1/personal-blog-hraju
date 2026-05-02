export function readingTime(body: string): string {
  const words = body.trim().split(/\s+/).length
  const mins = Math.max(1, Math.round(words / 200))
  return `${mins} min read`
}

export function excerpt(body: string, maxLength = 140): string {
  const plain = body
    .replace(/```[\s\S]*?```/g, '')       // remove fenced code blocks
    .replace(/`[^`]+`/g, '')              // remove inline code
    .replace(/!\[.*?\]\(.*?\)/g, '')       // remove images
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1') // links → text
    .replace(/#{1,6}\s+/g, '')            // remove heading markers
    .replace(/[*_~>|]/g, '')              // remove markdown symbols
    .replace(/\s+/g, ' ')
    .trim()
  if (plain.length <= maxLength) return plain
  return plain.slice(0, maxLength).trimEnd() + '…'
}
