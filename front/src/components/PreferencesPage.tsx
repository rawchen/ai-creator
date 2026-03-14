import React, { useState } from 'react'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, User, FileText, Loader2, CheckCircle, AlertCircle, Sparkles } from 'lucide-react'
import { aiContentApi } from '../lib/api'
import { useToast } from '../hooks/useToast'

interface PreferencesPageProps {
  sessionId: string
  onComplete: (preferences: any) => void
}

const PreferencesPage: React.FC<PreferencesPageProps> = ({ sessionId, onComplete }) => {
  const [activeTab, setActiveTab] = useState<'file' | 'ip'>('file')
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<any>(null)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [ipName, setIpName] = useState('')
  const [ipAnalysis, setIpAnalysis] = useState<any>(null)
  const { showSuccess, showError } = useToast()

  // 文件上传处理
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('sessionId', sessionId)

      const result: any = await aiContentApi.uploadFile(formData)

      setUploadedFile(result)
      showSuccess('文件上传成功！')
      // console.log('result text:', result.data.extractedContent)

      // 如果有文本内容，自动分析
      if (result.data.extractedContent) {
        await analyzeFile(result.data.extractedContent, result.data.fileId)
      }
    } catch (error: any) {
      showError('文件上传失败：' + error.message)
    } finally {
      setIsUploading(false)
    }
  }, [sessionId, showSuccess, showError])
  
  // 文件内容分析
  const analyzeFile = async (content: string, fileId?: string) => {
    setIsAnalyzing(true)
    try {
      const result: any = await aiContentApi.analyzeFile({
        fileContent: content,
        sessionId,
        fileId
      })

      setAnalysisResult(result.data.analysis)
      showSuccess('文件分析完成！')
    } catch (error: any) {
      showError('文件分析失败：' + error.message)
    } finally {
      setIsAnalyzing(false)
    }
  }
  
  // IP分析
  const analyzeIP = async () => {
    if (!ipName.trim()) {
      showError('请输入IP名称')
      return
    }

    setIsAnalyzing(true)
    try {
      const result: any = await aiContentApi.analyzeIP({
        ipName: ipName.trim(),
        sessionId
      })
      setIpAnalysis(result.data.analysis)
      showSuccess('IP分析完成！')
    } catch (error: any) {
      showError('IP分析失败：' + error.message)
    } finally {
      setIsAnalyzing(false)
    }
  }
  
  // 保存偏好设置
  const savePreferences = async () => {
    const preferences = activeTab === 'file' ? analysisResult : ipAnalysis

    if (!preferences) {
      showError('请先完成分析')
      return
    }

    try {
      await aiContentApi.saveContentPreferences({
        session_id: sessionId,
        user_style: preferences,
        keywords: preferences.keywords || preferences.common_keywords || [],
        writing_tone: preferences.writing_tone,
        content_structure: preferences.content_structure || preferences.paragraph_structure,
        target_audience: preferences.target_audience
      })

      onComplete(preferences)
      showSuccess('偏好设置保存成功！')
    } catch (error: any) {
      showError('保存失败：' + error.message)
    }
  }
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  })

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 页面标题 */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          创建你的写作风格
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          选择一种方式来定义你的写作风格，让AI学习并应用你的创作偏好
        </p>
      </div>

      {/* 切换标签 */}
      <div className="flex justify-center">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-1 shadow-lg border border-white/50">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('file')}
              className={`
                flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 font-medium
                ${
                  activeTab === 'file'
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-purple-600'
                }
              `}
            >
              <FileText className="w-4 h-4" />
              <span>文件上传</span>
            </button>
            <button
              onClick={() => setActiveTab('ip')}
              className={`
                flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 font-medium
                ${
                  activeTab === 'ip'
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-purple-600'
                }
              `}
            >
              <User className="w-4 h-4" />
              <span>IP对标</span>
            </button>
          </div>
        </div>
      </div>

      {/* 文件上传模式 */}
      {activeTab === 'file' && (
        <div className="space-y-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              上传你的作品文件
            </h2>
            
            {/* 文件上传区域 */}
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
                ${
                  isDragActive
                    ? 'border-purple-400 bg-purple-50'
                    : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
                }
              `}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                {isUploading ? (
                  <Loader2 className="w-12 h-12 text-purple-500 mx-auto animate-spin" />
                ) : uploadedFile ? (
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                ) : (
                  <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                )}
                
                <div>
                  {isUploading ? (
                    <p className="text-lg font-medium text-purple-600">正在上传...</p>
                  ) : uploadedFile ? (
                    <div>
                      <p className="text-lg font-medium text-green-600 mb-2">上传成功！</p>
                      <p className="text-sm text-gray-600">{uploadedFile.fileName}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        拖放文件到这里，或点击选择文件
                      </p>
                      <p className="text-sm text-gray-500">
                        支持 TXT、MD、PDF、DOC、DOCX 格式
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* 分析结果 */}
          {analysisResult && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <span>风格分析结果</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">写作语调</label>
                    <p className="text-gray-900 bg-gray-50 rounded-lg p-3">{analysisResult.writing_tone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">目标受众</label>
                    <p className="text-gray-900 bg-gray-50 rounded-lg p-3">{analysisResult.target_audience}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">关键词</label>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.keywords?.map((keyword: string, idx: number) => (
                        <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">内容结构</label>
                    <p className="text-gray-900 bg-gray-50 rounded-lg p-3">{analysisResult.paragraph_structure}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="text-sm font-medium text-gray-600">风格总结</label>
                <p className="text-gray-900 bg-gray-50 rounded-lg p-4 mt-2">{analysisResult.style_summary}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* IP对标模式 */}
      {activeTab === 'ip' && (
        <div className="space-y-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              输入喜欢的创作者
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  创作者名称或IP名称
                </label>
                <input
                  type="text"
                  value={ipName}
                  onChange={(e) => setIpName(e.target.value)}
                  placeholder="例如：李佳琦、papi酱、办公室小野等"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              
              <button
                onClick={analyzeIP}
                disabled={isAnalyzing || !ipName.trim()}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>正在分析...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>开始分析</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* IP分析结果 */}
          {ipAnalysis && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <User className="w-5 h-5 text-purple-500" />
                <span>{ipAnalysis.creator_name} 的创作风格</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">写作语调</label>
                    <p className="text-gray-900 bg-gray-50 rounded-lg p-3">{ipAnalysis.writing_tone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">目标受众</label>
                    <p className="text-gray-900 bg-gray-50 rounded-lg p-3">{ipAnalysis.target_audience}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">主要平台</label>
                    <div className="flex flex-wrap gap-2">
                      {ipAnalysis.main_platforms?.map((platform: string, idx: number) => (
                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">常用关键词</label>
                    <div className="flex flex-wrap gap-2">
                      {ipAnalysis.common_keywords?.map((keyword: string, idx: number) => (
                        <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">写作技巧</label>
                    <div className="space-y-1">
                      {ipAnalysis.writing_techniques?.map((technique: string, idx: number) => (
                        <p key={idx} className="text-sm text-gray-700 bg-gray-50 rounded p-2">
                          • {technique}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="text-sm font-medium text-gray-600">风格总结</label>
                <p className="text-gray-900 bg-gray-50 rounded-lg p-4 mt-2">{ipAnalysis.style_summary}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 保存按钮 */}
      {(analysisResult || ipAnalysis) && (
        <div className="text-center">
          <button
            onClick={savePreferences}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span>保存并继续</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default PreferencesPage