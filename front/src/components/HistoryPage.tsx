import React, { useState, useEffect } from 'react'
import { Calendar, Search, Filter, Download, Copy, Eye, ThumbsUp, ThumbsDown, FileText, Trash2, RefreshCw } from 'lucide-react'
import { aiContentApi } from '../lib/api'
import { useToast } from '../hooks/useToast'
import ReactMarkdown from 'react-markdown'
import jsPDF from 'jspdf'

interface HistoryPageProps {
  sessionId: string
}

const HistoryPage: React.FC<HistoryPageProps> = ({ sessionId }) => {
  const [contentHistory, setContentHistory] = useState<any[]>([])
  const [filteredHistory, setFilteredHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedModel, setSelectedModel] = useState('all')
  const [selectedContent, setSelectedContent] = useState<any>(null)
  const [showPreview, setShowPreview] = useState(false)
  const { showSuccess, showError } = useToast()

  useEffect(() => {
    loadContentHistory()
  }, [sessionId])

  useEffect(() => {
    filterContent()
  }, [contentHistory, searchTerm, selectedType, selectedModel])

  // 加载历史记录
  const loadContentHistory = async () => {
    setIsLoading(true)
    try {
      const response = await aiContentApi.getContentHistory(sessionId)
      const data = Array.isArray(response) ? response : []
      console.log('data', data)
      setContentHistory(data)
    } catch (error: any) {
      showError('加载历史记录失败：' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // 过滤内容
  const filterContent = () => {
    let filtered = contentHistory

    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.generated_content?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // 类型过滤
    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.content_type === selectedType)
    }

    // 模型过滤
    if (selectedModel !== 'all') {
      filtered = filtered.filter(item => item.ai_model === selectedModel)
    }

    setFilteredHistory(filtered)
  }

  // 给内容评分
  const rateContent = async (contentId: string, rating: number) => {
    try {
      await aiContentApi.updateRating(contentId, rating)

      // 更新本地数据
      setContentHistory(prev =>
        prev.map(item =>
          item.id === contentId ? { ...item, rating } : item
        )
      )

      showSuccess('评分成功！')
    } catch (error: any) {
      showError('评分失败：' + error.message)
    }
  }

  // 复制内容
  const copyContent = (content: string) => {
    navigator.clipboard.writeText(content)
    showSuccess('内容已复制到剪贴板！')
  }

  // 导出PDF
  const exportToPDF = (item: any) => {
    try {
      const pdf = new jsPDF()
      
      // 设置中文字体（简单处理）
      pdf.setFontSize(16)
      pdf.text(item.title || '无标题', 20, 30)
      
      pdf.setFontSize(12)
      const lines = pdf.splitTextToSize(item.generated_content, 170)
      pdf.text(lines, 20, 50)
      
      pdf.save(`${item.title || '内容'}.pdf`)
      showSuccess('PDF导出成功！')
    } catch (error) {
      showError('PDF导出失败，请使用复制功能')
    }
  }

  // 删除内容
  const deleteContent = async (contentId: string) => {
    if (!confirm('确定要删除这条记录吗？')) return

    try {
      await aiContentApi.deleteContentHistory(contentId)
      setContentHistory(prev => prev.filter(item => item.id !== contentId))
      showSuccess('删除成功！')
    } catch (error: any) {
      showError('删除失败：' + error.message)
    }
  }

  // 预览内容
  const previewContent = (item: any) => {
    setSelectedContent(item)
    setShowPreview(true)
  }

  // 标记为已导出
  const markAsExported = async (contentId: string) => {
    try {
      await aiContentApi.markAsExported(contentId)
      setContentHistory(prev =>
        prev.map(item =>
          item.id === contentId ? { ...item, is_exported: true } : item
        )
      )
    } catch (error: any) {
      console.error('标记导出状态失败:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* 页面标题 */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          内容历史记录
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          查看和管理你的所有创作内容，支持搜索、过滤和导出
        </p>
      </div>

      {/* 搜索和过滤 */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
        <div className="flex flex-col md:flex-row gap-4">
          {/* 搜索框 */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索标题或内容..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* 过滤选项 */}
          <div className="flex gap-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            >
              <option value="all">所有类型</option>
              <option value="小红书文案">小红书文案</option>
              <option value="微信公众号文章">微信公众号文章</option>
            </select>

            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            >
              <option value="all">所有模型</option>
              <option value="deepseek">DeepSeek</option>
              <option value="kimi">Kimi</option>
            </select>

            <button
              onClick={loadContentHistory}
              className="px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden md:inline">刷新</span>
            </button>
          </div>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{contentHistory.length}</div>
          <div className="text-sm text-gray-600">总共创作</div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {contentHistory.filter(item => item.content_type === '小红书文案').length}
          </div>
          <div className="text-sm text-gray-600">小红书文案</div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {contentHistory.filter(item => item.content_type === '微信公众号文章').length}
          </div>
          <div className="text-sm text-gray-600">公众号文章</div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {contentHistory.filter(item => item.is_exported).length}
          </div>
          <div className="text-sm text-gray-600">已导出</div>
        </div>
      </div>

      {/* 内容列表 */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">加载中...</p>
        </div>
      ) : filteredHistory.length > 0 ? (
        <div className="space-y-4">
          {filteredHistory.map((item) => (
            <div key={item.id} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {item.title || '无标题'}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(item.created_at)}</span>
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {item.content_type}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                      {item.ai_model}
                    </span>
                    {item.is_exported && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        已导出
                      </span>
                    )}
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => previewContent(item)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="预览"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => copyContent(item.generated_content)}
                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="复制"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      exportToPDF(item)
                      markAsExported(item.id)
                    }}
                    className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="导出PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteContent(item.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* 评分按钮 */}
                  <div className="flex space-x-1 border-l pl-2 ml-2">
                    <button
                      onClick={() => rateContent(item.id, 1)}
                      className={`p-2 rounded-lg transition-colors ${
                        item.rating === 1 
                          ? 'text-green-600 bg-green-50' 
                          : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                      }`}
                      title="赞"
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => rateContent(item.id, -1)}
                      className={`p-2 rounded-lg transition-colors ${
                        item.rating === -1 
                          ? 'text-red-600 bg-red-50' 
                          : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                      }`}
                      title="踩"
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 内容预览 */}
              <div className="text-gray-600 text-sm line-clamp-3">
                {item.generated_content.substring(0, 200)}...
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {searchTerm || selectedType !== 'all' || selectedModel !== 'all' 
              ? '没有找到匹配的内容' 
              : '还没有创作任何内容'
            }
          </h3>
          <p className="text-gray-500">
            {searchTerm || selectedType !== 'all' || selectedModel !== 'all' 
              ? '请尝试修改搜索条件' 
              : '开始你的第一个创作吧！'
            }
          </p>
        </div>
      )}

      {/* 内容预览模态框 */}
      {showPreview && selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedContent.title || '无标题'}
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
              >
                ×
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose max-w-none">
                <ReactMarkdown>{selectedContent.generated_content}</ReactMarkdown>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
              <button
                onClick={() => copyContent(selectedContent.generated_content)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>复制</span>
              </button>
              <button
                onClick={() => {
                  exportToPDF(selectedContent)
                  markAsExported(selectedContent.id)
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>导出PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HistoryPage