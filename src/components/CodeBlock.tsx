'use client'

import { useState } from 'react'

export function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const highlighted = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .split('\n')
    .map(line => {
      // Pull out comment first
      const commentIdx = line.indexOf('//')
      const codePart = commentIdx >= 0 ? line.slice(0, commentIdx) : line
      const commentPart = commentIdx >= 0 ? line.slice(commentIdx) : ''

      // Split on string literals, process each segment separately
      const parts = codePart.split(/('[^']*'|"[^"]*"|`[^`]*`)/g)
      const tokenised = parts.map((part, i) => {
        if (i % 2 === 1) return `<span class="t-string">${part}</span>`
        return part
          .replace(/\b(import|from|export|const|let|function|return|async|await|default|type|interface|if|throw|new)\b/g,
            '<span class="t-keyword">$1</span>')
          .replace(/\b(use\w+|WankmiProvider|PhantomAdapter|BackpackAdapter|SolflareAdapter)\b/g,
            '<span class="t-fn">$1</span>')
          .replace(/\b(true|false|null|undefined)\b/g,
            '<span class="t-bool">$1</span>')
      }).join('')

      const commentHtml = commentPart
        ? `<span class="t-comment">${commentPart}</span>`
        : ''

      return tokenised + commentHtml
    })
    .join('\n')

  return (
    <div style={{ position: 'relative' }}>
      <div className="code" dangerouslySetInnerHTML={{ __html: highlighted }} />
      <button
        className={`copy-btn ${copied ? 'copied' : ''}`}
        onClick={copy}
      >
        {copied ? 'copied ✓' : 'copy'}
      </button>
    </div>
  )
}