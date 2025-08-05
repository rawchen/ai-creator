import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

// 无需注册的会话管理Hook
export function useSession() {
  const [sessionId, setSessionId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 从localStorage获取或创建新的会话ID
    let existingSessionId = localStorage.getItem('ai_content_creator_session_id')
    
    if (!existingSessionId) {
      existingSessionId = uuidv4()
      localStorage.setItem('ai_content_creator_session_id', existingSessionId)
    }
    
    setSessionId(existingSessionId)
    setIsLoading(false)
  }, [])

  const regenerateSession = () => {
    const newSessionId = uuidv4()
    localStorage.setItem('ai_content_creator_session_id', newSessionId)
    setSessionId(newSessionId)
  }

  return {
    sessionId,
    isLoading,
    regenerateSession
  }
}