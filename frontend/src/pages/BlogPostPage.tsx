import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Avatar, AvatarFallback } from '../components/ui/avatar'
import { formatDate } from '../lib/dataUtils'
import { BookOpen, Share2, Heart, Loader2, ArrowLeft, Clock, Check } from 'lucide-react'

interface BlogPost {
  id: number
  title: string
  content: string
  category: string
  created_at: string
  updated_at: string
  author_name: string
  author_avatar?: string
  author_id: number
  likes_count?: number
  is_liked?: boolean
}

export const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [liking, setLiking] = useState(false)
  const [showCopied, setShowCopied] = useState(false)

  useEffect(() => {
    if (id) {
      fetchBlogPost()
    } else {
      setIsLoading(false)
    }
  }, [id])

  const fetchBlogPost = async () => {
    try {
      const response = await fetch(`https://alumconnect-s4c7.onrender.com/api/blog/${id}`)
      if (response.ok) {
        const data = await response.json()
        setPost(data)
      } else {
        console.error('Failed to fetch blog post')
        setPost(null)
      }
    } catch (error) {
      console.error('Error fetching blog post:', error)
      setPost(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLike = async () => {
    if (!post || !token) return
    
    setLiking(true)
    try {
      const response = await fetch(`https://alumconnect-s4c7.onrender.com/api/blog/${post.id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setPost({
          ...post,
          is_liked: data.is_liked,
          likes_count: data.likes_count
        })
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    } finally {
      setLiking(false)
    }
  }

  const handleShare = async () => {
    if (!post) return
    
    const url = window.location.href
    
    try {
      await navigator.clipboard.writeText(url)
      setShowCopied(true)
      setTimeout(() => setShowCopied(false), 2000)
    } catch (error) {
      const textarea = document.createElement('textarea')
      textarea.value = url
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setShowCopied(true)
      setTimeout(() => setShowCopied(false), 2000)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
          <span className="text-lg text-gray-600">Loading article...</span>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Article not found</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/blog')}
            className="bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 px-6 py-3 rounded-full font-semibold"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-16">
        {/* Back Button */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full px-4 py-2" 
            onClick={() => navigate('/blog')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </Button>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="mb-12">
            {/* Category Badge */}
            <div className="mb-6">
              <Badge 
                variant="secondary" 
                className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 text-sm font-medium"
              >
                {post.category}
              </Badge>
            </div>
            
            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Author Avatar */}
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gray-100 text-gray-600 text-lg font-semibold">
                    {post.author_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                {/* Author Info */}
                <div>
                  <p className="text-lg font-semibold text-gray-900">{post.author_name}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleLike}
                  disabled={liking || !token}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-200 ${
                    post.is_liked 
                      ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  } ${!token ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {liking ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Heart className={`h-5 w-5 ${post.is_liked ? 'fill-current' : ''}`} />
                  )}
                  <span className="font-semibold">{post.likes_count || 0}</span>
                </button>
                <button 
                  onClick={handleShare}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-200 ${
                    showCopied 
                      ? 'bg-green-50 text-green-600' 
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {showCopied ? (
                    <>
                      <Check className="h-5 w-5" />
                      <span className="font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-5 w-5" />
                      <span className="font-semibold">Share</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-12">
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-lg">
                  {post.content}
                </div>
              </div>
            </div>
          </div>

          {/* Author Section */}
          <div className="mt-16">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center space-x-6">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-gray-100 text-gray-600 text-xl font-semibold">
                    {post.author_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">About {post.author_name}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Alumni contributor sharing insights and experiences with the community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}