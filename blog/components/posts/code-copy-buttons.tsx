'use client'
import { useEffect } from 'react'

export function CodeCopyButtons() {
  useEffect(() => {
    const container = document.getElementById('post-body')
    if (!container) return

    container.querySelectorAll('pre').forEach((pre) => {
      if (pre.querySelector('[data-copy-btn]')) return

      const btn = document.createElement('button')
      btn.setAttribute('data-copy-btn', '')
      btn.textContent = 'Copy'
      btn.style.cssText = `
        position: absolute; top: 8px; right: 8px;
        padding: 2px 10px; font-size: 0.7rem; border-radius: 4px;
        background: rgba(100,116,139,0.5); color: #e2e8f0;
        cursor: pointer; opacity: 0; transition: opacity 0.15s;
        border: none; font-family: inherit; line-height: 1.5;
      `

      pre.style.position = 'relative'
      pre.addEventListener('mouseenter', () => { btn.style.opacity = '1' })
      pre.addEventListener('mouseleave', () => { btn.style.opacity = '0' })

      btn.addEventListener('click', () => {
        const code = pre.querySelector('code')?.innerText ?? ''
        navigator.clipboard.writeText(code).then(() => {
          btn.textContent = 'Copied!'
          setTimeout(() => { btn.textContent = 'Copy' }, 2000)
        })
      })

      pre.appendChild(btn)
    })
  }, [])

  return null
}
