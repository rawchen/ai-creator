import React, { useState, useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Layout from './components/Layout'
import HomePage from './components/HomePage'
import PreferencesPage from './components/PreferencesPage'
import GeneratorPage from './components/GeneratorPage'
import HistoryPage from './components/HistoryPage'
import { useSession } from './hooks/useSession'
import { aiContentApi } from "@/lib/api.ts";

function App() {
  const { sessionId, isLoading: sessionLoading } = useSession()
  const [currentPage, setCurrentPage] = useState('home')
  const [userPreferences, setUserPreferences] = useState<any>(null)
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(false)

  // 加载用户偏好设置
  useEffect(() => {
    if (sessionId) {
      loadUserPreferences()
    }
  }, [sessionId])

  const loadUserPreferences = async () => {
    setIsLoadingPreferences(true)
    try {
      const data: any = await aiContentApi.getContentPreferences(sessionId)
      if (data && data.user_style) {
        setUserPreferences(JSON.parse(data.user_style))
      }
    } catch (error) {
      console.error('加载用户偏好失败:', error)
    } finally {
      setIsLoadingPreferences(false)
    }
  }

  const handlePageChange = (page: string) => {
    setCurrentPage(page)
  }

  const handleGetStarted = () => {
    if (userPreferences) {
      setCurrentPage('generator')
    } else {
      setCurrentPage('preferences')
    }
  }

  const handlePreferencesComplete = (preferences: any) => {
    setUserPreferences(preferences)
    setCurrentPage('generator')
  }

  if (sessionLoading || isLoadingPreferences) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      <Layout currentPage={currentPage} onPageChange={handlePageChange}>
        {currentPage === 'home' && (
          <HomePage onGetStarted={handleGetStarted} />
        )}
        
        {currentPage === 'preferences' && (
          <PreferencesPage 
            sessionId={sessionId} 
            onComplete={handlePreferencesComplete}
          />
        )}
        
        {currentPage === 'generator' && (
          <GeneratorPage 
            sessionId={sessionId} 
            userPreferences={userPreferences}
          />
        )}
        
        {currentPage === 'history' && (
          <HistoryPage sessionId={sessionId} />
        )}
      </Layout>
      
      {/* Toast 通知容器 */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="z-50"
      />
    </div>
  )
}

export default App