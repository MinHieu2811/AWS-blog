'use client'
import React, { JSX, useLayoutEffect } from 'react'
import { BundledLanguage } from 'shiki/bundle/web'

import CopyButton from '@/components/ui/CopyButton'

import { highlight } from '@/lib/shiki'

export type CodeBlockProps = {
  content: any
  className?: string
  language: BundledLanguage
}

const CodeBlock: React.FC<CodeBlockProps> = ({ content, className = '', language = 'ts' }) => {
  const [highlightedCode, setHighlightedCode] = React.useState<JSX.Element | null>(null)

  useLayoutEffect(() => {
    highlight(content?.props?.children, language)
      .then(setHighlightedCode)
      .catch((err) => console.error(err))
  }, [content, language])

  return (
    <div className={`${className} relative block-code`}>
      <CopyButton
        buttonConfig={{
          variant: 'secondary',
          size: 'icon'
        }}
        className="absolute top-4 right-4 z-10"
      />
      {highlightedCode ?? <pre className="p-3 rounded-md text-sm">{content?.props?.children}</pre>}
    </div>
  )
}

export default CodeBlock
