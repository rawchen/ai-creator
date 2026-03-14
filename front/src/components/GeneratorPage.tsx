import React, { useState, useEffect } from 'react'
import { Wand2, RefreshCw, Download, Copy, FileText, Loader2, Sparkles, Brain, Zap, Settings, ThumbsUp, ThumbsDown } from 'lucide-react'
import { aiContentApi } from '../lib/api'
import { useToast } from '../hooks/useToast'
import ReactMarkdown from 'react-markdown'
import jsPDF from 'jspdf'

interface GeneratorPageProps {
  sessionId: string
  userPreferences: any
}

const GeneratorPage: React.FC<GeneratorPageProps> = ({ sessionId, userPreferences }) => {
  const [topic, setTopic] = useState('')
  const [requirements, setRequirements] = useState('')
  const [contentType, setContentType] = useState<'小红书文案' | '微信公众号文章'>('小红书文案')
  const [aiModel, setAiModel] = useState<'deepseek' | 'kimi'>('deepseek')
  const [targetLength, setTargetLength] = useState('中等长度')
  const [isGeneratingTitles, setIsGeneratingTitles] = useState(false)
  const [isGeneratingContent, setIsGeneratingContent] = useState(false)
  const [titleSuggestions, setTitleSuggestions] = useState<any[]>([])
  const [selectedTitle, setSelectedTitle] = useState('')
  const [generatedContent, setGeneratedContent] = useState('')
  const [contentHistory, setContentHistory] = useState<any[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const { showSuccess, showError, showInfo } = useToast()

  // 加载历史记录
  useEffect(() => {
    loadContentHistory()
  }, [sessionId])

  const loadContentHistory = async () => {
    try {
      const data: any = await aiContentApi.getRecentContentHistory(sessionId)
      setContentHistory(data || [])
    } catch (error: any) {
      console.error('加载历史记录失败:', error)
    }
  }

  // 生成标题建议
  const generateTitles = async () => {
    if (!topic.trim()) {
      showError('请输入主题内容')
      return
    }

    setIsGeneratingTitles(true)
    try {
      const result: any = await aiContentApi.generateTitles({
        topic: topic.trim(),
        contentType,
        sessionId,
        userPreferences,
        keywords: userPreferences?.keywords || userPreferences?.common_keywords || []
      })

      setTitleSuggestions(result.data.titles || [])
      showSuccess('标题建议生成成功！')
    } catch (error: any) {
      showError('标题生成失败：' + error.message)
    } finally {
      setIsGeneratingTitles(false)
    }
  }

  // 生成内容
  const generateContent = async () => {
    const finalTitle = selectedTitle || topic
    if (!finalTitle.trim()) {
      showError('请输入或选择标题')
      return
    }

    setIsGeneratingContent(true)
    try {
      const result: any = await aiContentApi.generateContent({
        title: finalTitle.trim(),
        requirements: requirements.trim(),
        contentType,
        aiModel,
        sessionId,
        userPreferences,
        targetLength
      })

      setGeneratedContent(result.data.content)
      setShowPreview(true)
      showSuccess('内容生成成功！')
      loadContentHistory() // 刷新历史记录
    } catch (error: any) {
      showError('内容生成失败：' + error.message)
    } finally {
      setIsGeneratingContent(false)
    }
  }

  // 复制内容
  const copyContent = () => {
    navigator.clipboard.writeText(generatedContent)
    showSuccess('内容已复制到剪贴板！')
  }

  // 导出PDF
  const exportToPDF = () => {
    try {
      const pdf = new jsPDF()
      const title = selectedTitle || topic
      
      // 设置中文字体（简单处理）
      pdf.setFontSize(16)
      pdf.text(title, 20, 30)
      
      pdf.setFontSize(12)
      const lines = pdf.splitTextToSize(generatedContent, 170)
      pdf.text(lines, 20, 50)
      
      pdf.save(`${title}.pdf`)
      showSuccess('PDF导出成功！')
    } catch (error) {
      showError('PDF导出失败，请使用复制功能')
    }
  }

  // 给内容评分
  const rateContent = async (contentId: string, rating: number) => {
    try {
      await aiContentApi.updateRating(contentId, rating)
      showSuccess('评分成功！')
      loadContentHistory()
    } catch (error: any) {
      showError('评分失败：' + error.message)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* 页面标题 */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          AI内容创作工具
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          基于你的风格偏好，创作个性化的优质内容
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧：创作设置 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 基础设置 */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <Settings className="w-5 h-5 text-purple-500" />
              <span>创作设置</span>
            </h2>

            <div className="space-y-4">
              {/* 主题输入 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  主题内容 *
                </label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="请输入你想要创作的主题内容，例如：夜宵护肤技巧、减肥饮食指南等"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>

              {/* 具体要求 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  具体要求（可选）
                </label>
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="请描述具体的创作要求，例如：需要包含产品推荐、注重实用性等"
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>

              {/* 设置选项 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    内容类型
                  </label>
                  <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="小红书文案">小红书文案</option>
                    <option value="微信公众号文章">微信公众号文章</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    AI模型
                  </label>
                  <select
                    value={aiModel}
                    onChange={(e) => setAiModel(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="deepseek">DeepSeek</option>
                    <option value="kimi">Kimi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    内容长度
                  </label>
                  <select
                    value={targetLength}
                    onChange={(e) => setTargetLength(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="短篇">短篇</option>
                    <option value="中等长度">中等长度</option>
                    <option value="长篇">长篇</option>
                  </select>
                </div>
              </div>

              {/* 按钮组 */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={generateTitles}
                  disabled={isGeneratingTitles || !topic.trim()}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isGeneratingTitles ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>生成中...</span>
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4" />
                      <span>智能标题推荐</span>
                    </>
                  )}
                </button>

                <button
                  onClick={generateContent}
                  disabled={isGeneratingContent || (!selectedTitle && !topic.trim())}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isGeneratingContent ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>生成中...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>生成内容</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 标题建议 */}
          {titleSuggestions.length > 0 && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <span>标题建议</span>
              </h3>
              
              <div className="grid gap-3">
                {titleSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedTitle(suggestion.title)}
                    className={`
                      p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                      ${
                        selectedTitle === suggestion.title
                          ? 'border-purple-400 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
                      }
                    `}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{suggestion.title}</h4>
                        <p className="text-sm text-gray-600">{suggestion.reason}</p>
                      </div>
                      <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full ml-3">
                        {suggestion.style}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 内容预览 */}
          {generatedContent && showPreview && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-green-500" />
                  <span>生成结果</span>
                </h3>
                
                <div className="flex space-x-2">
                  <button
                    onClick={copyContent}
                    className="flex items-center space-x-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <span>复制</span>
                  </button>
                  <button
                    onClick={exportToPDF}
                    className="flex items-center space-x-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>导出PDF</span>
                  </button>
                </div>
              </div>
              
              <div className="prose max-w-none bg-gray-50 rounded-xl p-6">
                <ReactMarkdown>{generatedContent}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        {/* 右侧：历史记录 */}
        <div className="space-y-6">
          {/* 用户偏好显示 */}
          {userPreferences && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <h3 className="text-lg font-bold text-gray-900 mb-4">你的风格偏好</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-600">语调：</span>
                  <span className="text-gray-900">{userPreferences.writing_tone}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">受众：</span>
                  <span className="text-gray-900">{userPreferences.target_audience}</span>
                </div>
                {(userPreferences.keywords || userPreferences.common_keywords) && (
                  <div>
                    <span className="font-medium text-gray-600">关键词：</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(userPreferences.keywords || userPreferences.common_keywords)?.slice(0, 3).map((keyword: string, idx: number) => (
                        <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 历史记录 */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">最近生成</h3>
              <button
                onClick={loadContentHistory}
                className="p-2 text-gray-500 hover:text-purple-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              {contentHistory.length > 0 ? (
                contentHistory.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-3 hover:border-purple-300 transition-colors">
                    <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                      {item.title}
                    </h4>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{item.content_type}</span>
                      <div className="flex items-center space-x-2">
                        <span>{item.ai_model}</span>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => rateContent(item.id, 1)}
                            className={`p-1 rounded ${
                              item.rating === 1 ? 'text-green-600' : 'text-gray-400 hover:text-green-600'
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => rateContent(item.id, -1)}
                            className={`p-1 rounded ${
                              item.rating === -1 ? 'text-red-600' : 'text-gray-400 hover:text-red-600'
                            }`}
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-8">
                  还没有生成的内容
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GeneratorPage