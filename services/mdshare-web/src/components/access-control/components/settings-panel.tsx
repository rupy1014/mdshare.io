'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Shield, 
  Eye, 
  EyeOff,
  Settings,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface AccessControlSettings {
  visibility: 'public' | 'private' | 'restricted'
  inviteCode?: string
  allowedDomains: string[]
  passwordProtected: boolean
  roleBasedAccess: boolean
  allowDownload: boolean
  allowComments: boolean
}

interface SettingsPanelProps {
  settings: AccessControlSettings
  onUpdateSettings: (updates: Partial<AccessControlSettings>) => void
}

export function SettingsPanel({ settings, onUpdateSettings }: SettingsPanelProps) {
  const [newDomain, setNewDomain] = useState('')

  const addDomain = () => {
    if (newDomain.trim() && !settings.allowedDomains.includes(newDomain.trim())) {
      onUpdateSettings({
        allowedDomains: [...settings.allowedDomains, newDomain.trim()]
      })
      setNewDomain('')
    }
  }

  const removeDomain = (domain: string) => {
    onUpdateSettings({
      allowedDomains: settings.allowedDomains.filter(d => d !== domain)
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-primary" />
          <span>접근 제어 설정</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* 가시성 설정 */}
          <div>
            <h4 className="font-medium mb-3">가시성</h4>
            <div className="space-y-2">
              {[
                { value: 'public', label: '공개', description: '누구나 접근 가능' },
                { value: 'private', label: '비공개', description: '초대된 사용자만 접근 가능' },
                { value: 'restricted', label: '제한', description: '특정 도메인 사용자만 접근 가능' }
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value={option.value}
                    checked={settings.visibility === option.value}
                    onChange={(e) => onUpdateSettings({ visibility: e.target.value as any })}
                    className="text-primary"
                  />
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-muted-foreground">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 도메인 제한 */}
          {settings.visibility === 'restricted' && (
            <div>
              <h4 className="font-medium mb-3">허용 도메인</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="example.com"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addDomain()}
                  />
                  <Button onClick={addDomain} size="sm">
                    추가
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {settings.allowedDomains.map((domain) => (
                    <Badge key={domain} variant="outline" className="flex items-center space-x-1">
                      <span>{domain}</span>
                      <button
                        onClick={() => removeDomain(domain)}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 추가 설정 */}
          <div>
            <h4 className="font-medium mb-3">추가 설정</h4>
            <div className="space-y-3">
              {[
                { key: 'passwordProtected', label: '비밀번호 보호', description: '접근 시 비밀번호 입력 필요' },
                { key: 'roleBasedAccess', label: '역할 기반 접근', description: '사용자 역할에 따른 권한 제어' },
                { key: 'allowDownload', label: '다운로드 허용', description: '문서 다운로드 기능 활성화' },
                { key: 'allowComments', label: '댓글 허용', description: '문서에 댓글 작성 기능 활성화' }
              ].map((setting) => (
                <label key={setting.key} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings[setting.key as keyof AccessControlSettings] as boolean}
                    onChange={(e) => onUpdateSettings({ [setting.key]: e.target.checked })}
                    className="text-primary"
                  />
                  <div>
                    <div className="font-medium">{setting.label}</div>
                    <div className="text-sm text-muted-foreground">{setting.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
