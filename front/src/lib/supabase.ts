import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nnszmmuxqopodiceammi.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uc3ptbXV4cW9wb2RpY2VhbW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1MDYxNjEsImV4cCI6MjA2OTA4MjE2MX0.cCieCGNfXeGo2Y2TepS0SGiN_2DOLngZROLUXg87v8c'

export const supabase = createClient(supabaseUrl, supabaseKey)

// 数据库表类型定义
export interface ContentPreference {
  id: string
  session_id: string
  user_style?: any
  keywords?: string[]
  writing_tone?: string
  content_structure?: any
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
  analysis_result?: any
  created_at: string
}

export interface IpAnalysis {
  id: string
  session_id: string
  ip_name: string
  analysis_result: any
  style_summary?: string
  created_at: string
}

export interface TitleSuggestion {
  id: string
  session_id: string
  content_type: string
  suggested_titles: any
  keywords_used: string[]
  created_at: string
}