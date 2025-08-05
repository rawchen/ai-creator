import React from 'react'
import { Upload, Users, Sparkles, Download, Zap, FileText, Brain, Palette } from 'lucide-react'

interface HomePageProps {
  onGetStarted: () => void
}

const HomePage: React.FC<HomePageProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: Upload,
      title: '文件上传分析',
      description: '上传你的文章，AI自动分析写作风格和偏好',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Users,
      title: 'IP风格对标',
      description: '输入喜欢的创作者名字，学习他们的创作风格',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Brain,
      title: '智能标题推荐',
      description: '基于你的主题和风格，生成吸引人的标题建议',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: Zap,
      title: '双模型AI生成',
      description: '集成DeepSeek和Kimi，双模型保障内容质量',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Palette,
      title: '多轮优化',
      description: '支持内容修改和反馈，不断优化到满意',
      color: 'from-orange-500 to-amber-500'
    },
    {
      icon: Download,
      title: '快捷导出',
      description: '一键复制或导出PDF，轻松保存和分享作品',
      color: 'from-violet-500 to-purple-500'
    }
  ]

  const contentTypes = [
    {
      title: '小红书文案',
      description: '生活化、接地气的种草内容',
      emoji: '🌸',
      features: ['吸引人的开头', '实用性强', '丰富标签']
    },
    {
      title: '微信公众号',
      description: '专业深度的长文内容',
      emoji: '📱',
      features: ['结构完整', '有深度', '专业性']
    }
  ]

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold">
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AI创作新时代
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            无需注册，即刻体验。上传文件或输入IP名称，
            <br className="hidden md:block" />
            让AI学习你的风格，生成个性化的优质内容
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={onGetStarted}
            className="group bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
          >
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>立即开始创作</span>
          </button>
          <div className="text-sm text-gray-500 flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>免费使用，无需注册</span>
          </div>
        </div>
      </section>

      {/* 功能特色 */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            为何选择我们？
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            专为创作者打造的全能型AI内容生成平台
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-white/50"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* 内容类型 */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            支持的内容类型
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            专业针对不同平台的内容创作需求
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {contentTypes.map((type, index) => (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50"
            >
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">{type.emoji}</div>
                <h3 className="text-2xl font-bold text-gray-900">{type.title}</h3>
                <p className="text-gray-600">{type.description}</p>
                <div className="flex flex-wrap justify-center gap-2 pt-4">
                  {type.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-full text-sm font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl p-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          准备好开始你的创作之旅了吗？
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          从上传你的第一个文件或输入你喜欢的创作者开始吧
        </p>
        <button
          onClick={onGetStarted}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-10 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2"
        >
          <FileText className="w-5 h-5" />
          <span>开始体验</span>
        </button>
      </section>
    </div>
  )
}

export default HomePage