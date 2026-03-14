import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 60000,
})

api.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      console.error('API Error:', res.message)
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return res.data
  },
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// 数据库表类型定义
export interface ContentPreference {
  id: string
  session_id: string
  user_style?: string
  keywords?: string
  writing_tone?: string
  content_structure?: string
  preferred_length?: string
  target_audience?: string
  created_at: string
  updated_at: string
}

export interface ContentHistory {
  id: string
  session_id: string
  content_type: string
  title?: string
  generated_content: string
  ai_model: string
  prompt_used?: string
  feedback?: string
  rating?: number
  is_exported: boolean
  created_at: string
}

export interface UploadedFile {
  id: string
  session_id: string
  file_name: string
  file_url: string
  file_type?: string
  file_size?: number
  extracted_content?: string
  analysis_result?: string
  created_at: string
}

export interface IpAnalysis {
  id: string
  session_id: string
  ip_name: string
  analysis_result: string
  style_summary?: string
  created_at: string
}

export interface TitleSuggestion {
  id: string
  session_id: string
  content_type: string
  suggested_titles: string
  keywords_used: string
  created_at: string
}

// API接口定义
export const aiContentApi = {
  // 生成标题建议
  generateTitles: (data: any) => api.post('/generate-titles', data),

  // 生成内容
  generateContent: (data: any) => api.post('/generate-content', data),

  // 上传文件
  uploadFile: (formData: FormData) => api.post('/upload-file', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  // 分析文件
  analyzeFile: (data: any) => api.post('/analyze-file', data),

  // 分析IP
  analyzeIP: (data: any) => api.post('/analyze-ip', data),

  // 获取历史记录列表
  getContentHistory: (sessionId: string) => api.get('/content-history', { params: { sessionId } }),

  // 获取最近的历史记录
  getRecentContentHistory: (sessionId: string, limit?: number) => 
    api.get('/content-history/recent', { params: { sessionId, limit: limit || 5 } }),

  // 更新历史记录评分
  updateRating: (id: string, rating: number) => api.put(`/content-history/${id}/rating`, { rating }),

  // 删除历史记录
  deleteContentHistory: (id: string) => api.delete(`/content-history/${id}`),

  // 标记为已导出
  markAsExported: (id: string) => api.put(`/content-history/${id}/export`),

  // 获取偏好设置
  getContentPreferences: (sessionId: string) => api.get('/content-preferences', { params: { sessionId } }),

  // 保存偏好设置
  saveContentPreferences: (data: any) => api.post('/content-preferences', data),
}

export default api
