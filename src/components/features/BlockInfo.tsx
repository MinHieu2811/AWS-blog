import { CircleAlert, CircleCheck, CircleX, Info } from 'lucide-react'
import React from 'react'
import { cn } from '@/lib/utils'

export type BlockInfoProps = {
  variant: 'info' | 'success' | 'warning' | 'error'
  className?: string
  children: React.ReactNode
}

const variantMap = {
  info: {
    className: 'callout-info',
    icon: <Info size={20} />,
  },
  success: {
    className: 'callout-success',
    icon: <CircleCheck size={20} />,
  },
  warning: {
    className: 'callout-warning',
    icon: <CircleAlert size={20} />,
  },
  error: {
    className: 'callout-error',
    icon: <CircleX size={20} />,
  },
}

const BlockInfo = ({ variant, className = '', children }: BlockInfoProps) => {
  const { className: variantClassName, icon } = variantMap[variant]

  return (
    <div className={cn('callout', variantClassName, className)}>
      <div className="callout-title">
        {icon}
        <span>{variant.charAt(0).toUpperCase() + variant.slice(1)}</span>
      </div>
      <div className="callout-content">{children}</div>
    </div>
  )
}

export default BlockInfo
