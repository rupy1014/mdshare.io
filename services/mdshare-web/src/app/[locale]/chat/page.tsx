'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  Send,
  Bot,
  User,
  Loader2,
  MessageSquare
} from 'lucide-react'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '안녕하세요! MDShare AI 어시스턴트입니다. 무엇을 도와드릴까요?',
      role: 'assistant',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // 실제로는 AI API 호출
      await new Promise(resolve => setTimeout(resolve, 1000)) // Mock delay
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `죄송합니다. 현재 AI 기능은 개발 중입니다. "${userMessage.content}"에 대한 답변을 준비하고 있습니다.`,
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('AI 응답 오류:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* 헤더 */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/ko" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>홈으로</span>
          </Link>
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <span className="font-semibold">AI 채팅</span>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <div className="container py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">AI 채팅</h1>
            <p className="text-muted-foreground">
              MDShare AI 어시스턴트와 대화하여 문서에 대한 질문을 하거나 도움을 받으세요
            </p>
          </div>

          {/* 채팅 영역 */}
          <Card className="h-[600px] flex flex-col">
            <CardContent className="flex-1 flex flex-col p-0">
              {/* 메시지 목록 */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.role === 'assistant' && (
                          <Bot className="h-4 w-4 mt-0.5 text-primary" />
                        )}
                        {message.role === 'user' && (
                          <User className="h-4 w-4 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4 text-primary" />
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">답변을 생성하는 중...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* 입력 영역 */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="메시지를 입력하세요..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    size="sm"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    Enter로 전송
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Shift+Enter로 줄바꿈
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 안내 메시지 */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              💡 AI 기능은 현재 개발 중입니다. 실제 서비스에서는 더 정확한 답변을 제공할 예정입니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
