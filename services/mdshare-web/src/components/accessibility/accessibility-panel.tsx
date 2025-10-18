'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  SkipForward,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Contrast,
  Type,
  MousePointer,
  Keyboard
} from 'lucide-react'

interface AccessibilitySettings {
  highContrast: boolean
  largeText: boolean
  reducedMotion: boolean
  screenReader: boolean
  keyboardNavigation: boolean
}

export function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: false
  })

  useEffect(() => {
    // 접근성 설정을 localStorage에서 로드
    const savedSettings = localStorage.getItem('mdshare-accessibility')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  useEffect(() => {
    // 설정 변경 시 localStorage에 저장 및 CSS 적용
    localStorage.setItem('mdshare-accessibility', JSON.stringify(settings))
    
    // CSS 변수로 접근성 설정 적용
    const root = document.documentElement
    
    if (settings.highContrast) {
      root.style.setProperty('--accessibility-high-contrast', '1')
    } else {
      root.style.removeProperty('--accessibility-high-contrast')
    }
    
    if (settings.largeText) {
      root.style.setProperty('--accessibility-large-text', '1.2')
    } else {
      root.style.removeProperty('--accessibility-large-text')
    }
    
    if (settings.reducedMotion) {
      root.style.setProperty('--accessibility-reduced-motion', '1')
    } else {
      root.style.removeProperty('--accessibility-reduced-motion')
    }
  }, [settings])

  const toggleSetting = (key: keyof AccessibilitySettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const resetSettings = () => {
    setSettings({
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      screenReader: false,
      keyboardNavigation: false
    })
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-12 w-12 shadow-lg"
          title="접근성 설정 열기"
        >
          <Eye className="h-5 w-5" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>접근성 설정</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <EyeOff className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 고대비 모드 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Contrast className="h-4 w-4" />
              <div>
                <div className="text-sm font-medium">고대비 모드</div>
                <div className="text-xs text-muted-foreground">텍스트와 배경의 대비를 높입니다</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={() => toggleSetting('highContrast')}
              className="h-4 w-4"
            />
          </div>

          {/* 큰 글씨 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Type className="h-4 w-4" />
              <div>
                <div className="text-sm font-medium">큰 글씨</div>
                <div className="text-xs text-muted-foreground">텍스트 크기를 20% 증가시킵니다</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.largeText}
              onChange={() => toggleSetting('largeText')}
              className="h-4 w-4"
            />
          </div>

          {/* 애니메이션 감소 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MousePointer className="h-4 w-4" />
              <div>
                <div className="text-sm font-medium">애니메이션 감소</div>
                <div className="text-xs text-muted-foreground">움직임에 민감한 사용자를 위한 설정</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={() => toggleSetting('reducedMotion')}
              className="h-4 w-4"
            />
          </div>

          {/* 키보드 네비게이션 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Keyboard className="h-4 w-4" />
              <div>
                <div className="text-sm font-medium">키보드 네비게이션</div>
                <div className="text-xs text-muted-foreground">Tab 키로 모든 요소에 접근 가능</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.keyboardNavigation}
              onChange={() => toggleSetting('keyboardNavigation')}
              className="h-4 w-4"
            />
          </div>

          {/* 설정 초기화 */}
          <div className="pt-2 border-t">
            <Button variant="outline" size="sm" onClick={resetSettings} className="w-full">
              설정 초기화
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function SkipToContent() {
  const skipRef = useRef<HTMLAnchorElement>(null)

  const handleSkip = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      const mainContent = document.querySelector('main')
      if (mainContent) {
        mainContent.focus()
        mainContent.scrollIntoView()
      }
    }
  }

  return (
    <a
      ref={skipRef}
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
      onKeyDown={handleSkip}
    >
      <SkipForward className="h-4 w-4 mr-2 inline" />
      메인 콘텐츠로 건너뛰기
    </a>
  )
}

export function FocusIndicator() {
  useEffect(() => {
    // 포커스 표시를 위한 CSS 추가
    const style = document.createElement('style')
    style.textContent = `
      *:focus-visible {
        outline: 2px solid var(--primary);
        outline-offset: 2px;
      }
      
      [data-accessibility-high-contrast="true"] {
        --background: #ffffff;
        --foreground: #000000;
        --primary: #000000;
        --primary-foreground: #ffffff;
        --muted: #f5f5f5;
        --muted-foreground: #666666;
        --border: #cccccc;
      }
      
      [data-accessibility-large-text="true"] {
        font-size: calc(1rem * 1.2);
      }
      
      [data-accessibility-reduced-motion="true"] * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return null
}
