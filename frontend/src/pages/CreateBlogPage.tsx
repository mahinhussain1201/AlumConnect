import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const CreateBlogPage: React.FC = () => {
  const { token, user, isLoading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    category: 'General',
    content: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setForm(prev => ({ ...prev, [id]: value }))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!token) return
    setLoading(true)
    try {
      const requestData = {
        title: form.title,
        category: form.category,
        content: form.content
      }
      console.log('Sending blog data:', requestData)
      const res = await fetch('http://localhost:5001/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      })
      if (res.ok) {
        navigate('/alumni-dashboard')
      } else {
        const data = await res.json()
        console.error('Blog creation failed:', data)
        setError(data.error || data.msg || 'Failed to create blog post')
      }
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Please log in to access this page.</p>
      </div>
    )
  }

  if (user.role !== 'alumni') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Only alumni can write blog posts.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Create Blog Post
          </h1>
          <p className="text-gray-600">Share your insights and experiences with the community</p>
        </div>
        
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900">Write Your Story</CardTitle>
            <CardDescription className="text-gray-600">Craft a compelling blog post that resonates with your audience</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-semibold">Blog Title</Label>
                <Input 
                  id="title" 
                  value={form.title} 
                  onChange={handleChange} 
                  required 
                  placeholder="Enter an engaging title for your blog post"
                  className="h-12 text-lg"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-base font-semibold">Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm(p => ({ ...p, category: v }))}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['General', 'Technology', 'Career', 'Startup', 'Research', 'Personal', 'Industry Insights'].map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content" className="text-base font-semibold">Content</Label>
                <Textarea 
                  id="content" 
                  value={form.content} 
                  onChange={handleChange} 
                  rows={16} 
                  required 
                  placeholder="Write your blog post content here. Share your thoughts, experiences, and insights..."
                  className="text-base leading-relaxed resize-none"
                />
                <p className="text-sm text-gray-500">Tip: Use clear paragraphs and engaging language to keep your readers interested</p>
              </div>
              
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
                    Publishing...
                  </>
                ) : (
                  'Publish Blog Post'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


