import { markdownToHtml } from '@/lib/markdown'
import { CodeCopyButtons } from './code-copy-buttons'

export async function PostBody({ body }: { body: string }) {
  const html = await markdownToHtml(body)
  return (
    <div>
      <div
        id="post-body"
        className="prose prose-neutral dark:prose-invert max-w-none
          prose-pre:rounded-lg prose-pre:text-sm
          prose-code:before:content-none prose-code:after:content-none
          prose-a:text-blue-600 dark:prose-a:text-blue-400"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <CodeCopyButtons />
    </div>
  )
}
