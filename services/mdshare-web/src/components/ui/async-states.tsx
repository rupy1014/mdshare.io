'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Loader2,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react'

interface LoadingStateProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingState({ message = '로딩 중...', size = 'md' }: LoadingStateProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary mb-4`} />
      <p className="text-muted-foreground">{message}</p>
    </div>
  )
}

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  showRetry?: boolean
}

export function ErrorState({ 
  title = '오류가 발생했습니다', 
  message = '잠시 후 다시 시도해주세요.',
  onRetry,
  showRetry = true
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <XCircle className="h-12 w-12 text-destructive mb-4" />
      <h3 className="font-medium text-destructive mb-2">{title}</h3>
      <p className="text-muted-foreground text-center mb-4 max-w-md">{message}</p>
      {showRetry && onRetry && (
        <Button variant="outline" onClick={onRetry} className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4" />
          <span>다시 시도</span>
        </Button>
      )}
    </div>
  )
}

interface EmptyStateProps {
  icon?: React.ReactNode
  title?: string
  message?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ 
  icon,
  title = '데이터가 없습니다',
  message = '아직 표시할 내용이 없습니다.',
  action
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {icon && <div className="mb-4">{icon}</div>}
      <h3 className="font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground text-center mb-6 max-w-md">{message}</p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}

interface SuccessStateProps {
  title?: string
  message?: string
  onContinue?: () => void
  continueLabel?: string
}

export function SuccessState({ 
  title = '완료되었습니다',
  message = '작업이 성공적으로 완료되었습니다.',
  onContinue,
  continueLabel = '계속하기'
}: SuccessStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <CheckCircle className="h-12 w-12 text-green-600 mb-4" />
      <h3 className="font-medium text-green-600 mb-2">{title}</h3>
      <p className="text-muted-foreground text-center mb-6 max-w-md">{message}</p>
      {onContinue && (
        <Button onClick={onContinue}>
          {continueLabel}
        </Button>
      )}
    </div>
  )
}

interface InfoStateProps {
  title?: string
  message?: string
  variant?: 'info' | 'warning' | 'success'
}

export function InfoState({ 
  title = '정보',
  message = '추가 정보를 확인하세요.',
  variant = 'info'
}: InfoStateProps) {
  const variantStyles = {
    info: {
      icon: <Info className="h-5 w-5 text-blue-600" />,
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800'
    },
    warning: {
      icon: <AlertCircle className="h-5 w-5 text-yellow-600" />,
      bg: 'bg-yellow-50 border-yellow-200',
      text: 'text-yellow-800'
    },
    success: {
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-800'
    }
  }

  const styles = variantStyles[variant]

  return (
    <Card className={`${styles.bg} border`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            {styles.icon}
          </div>
          <div className="flex-1">
            <h4 className={`font-medium ${styles.text} mb-1`}>{title}</h4>
            <p className={`text-sm ${styles.text} opacity-80`}>{message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface AsyncStateProps {
  loading: boolean
  error: string | null
  empty: boolean
  children: React.ReactNode
  loadingMessage?: string
  errorMessage?: string
  emptyMessage?: string
  onRetry?: () => void
}

export function AsyncState({ 
  loading, 
  error, 
  empty, 
  children, 
  loadingMessage,
  errorMessage,
  emptyMessage,
  onRetry
}: AsyncStateProps) {
  if (loading) {
    return <LoadingState message={loadingMessage} />
  }

  if (error) {
    return <ErrorState message={errorMessage} onRetry={onRetry} />
  }

  if (empty) {
    return <EmptyState message={emptyMessage} />
  }

  return <>{children}</>
}
