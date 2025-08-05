import React from 'react'
import { PenTool, Sparkles, FileText, History } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
  currentPage: string
  onPageChange: (page: string) => void
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const navigation = [
    { id: 'home', name: '首页', icon: PenTool },
    { id: 'preferences', name: '偏好设置', icon: Sparkles },
    { id: 'generator', name: '内容创作', icon: FileText },
    { id: 'history', name: '历史记录', icon: History },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* 头部导航 */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <PenTool className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  AI创作助手
                </h1>
                <p className="text-xs text-gray-500">智能内容生成平台</p>
              </div>
            </div>

            {/* 导航菜单 */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => onPageChange(item.id)}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200
                      ${
                        currentPage === item.id
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-200'
                          : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </button>
                )
              })}
            </nav>

            {/* 移动端菜单按钮 */}
            <div className="md:hidden">
              <button className="p-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-purple-50">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 移动端底部导航 */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-purple-100 z-50">
        <div className="flex justify-around py-2">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`
                  flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200
                  ${
                    currentPage === item.id
                      ? 'text-purple-600'
                      : 'text-gray-500'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 主内容区域 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {children}
      </main>
    </div>
  )
}

export default Layout