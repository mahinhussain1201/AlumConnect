import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { WavesBackground } from '@/components/ui/waves-background'
import { BGPattern } from '@/components/ui/bg-pattern'
import { formatDate } from '@/lib/dataUtils'
import { BookOpen, Calendar, User, Share2, Heart, Loader2, ArrowLeft, MessageCircle, Clock } from 'lucide-react'

interface BlogPost {
  id: number
  title: string
  content: string
  category: string
  created_at: string
  updated_at: string
  author_name: string
  author_avatar?: string
  author_id?: number
}

export const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchBlogPost()
    } else {
      setIsLoading(false)
    }
  }, [id])

  const fetchBlogPost = async () => {
    try {
      // For now, using mock data. In real implementation, this would fetch from API
      const mockPost: BlogPost = {
        id: parseInt(id || '1'),
        title: "The Future of AI in Education: Transforming Learning Experiences",
        content: `Artificial Intelligence is revolutionizing the education sector, offering personalized learning experiences and intelligent tutoring systems. This comprehensive guide explores how AI technologies are reshaping traditional educational paradigms.

## The Current State of AI in Education

The integration of AI in education has moved beyond theoretical discussions to practical implementations. Schools and universities worldwide are adopting AI-powered tools to enhance learning outcomes and streamline administrative processes.

### Key Benefits of AI in Education

1. **Personalized Learning**: AI algorithms analyze individual student performance and adapt content delivery to match learning styles and pace.

2. **Intelligent Tutoring**: Virtual tutors provide 24/7 support, answering questions and providing explanations tailored to each student's needs.

3. **Automated Assessment**: AI can grade assignments, provide feedback, and identify areas where students need additional support.

4. **Predictive Analytics**: Early warning systems help identify students at risk of falling behind, enabling timely intervention.

## Real-World Applications

### Adaptive Learning Platforms

Platforms like Khan Academy and Coursera use AI to create personalized learning paths. These systems continuously adjust content difficulty and presentation style based on student performance.

### Virtual Teaching Assistants

AI-powered chatbots and virtual assistants help students with homework, provide explanations, and offer study tips. They're available around the clock, making learning support more accessible.

### Smart Content Creation

AI tools can generate educational content, create practice questions, and even develop interactive simulations that enhance understanding of complex concepts.

## Challenges and Considerations

While AI offers tremendous potential, there are important considerations:

- **Privacy Concerns**: Student data must be protected and used ethically
- **Digital Divide**: Ensuring equitable access to AI-powered educational tools
- **Teacher Training**: Educators need support to effectively integrate AI tools
- **Quality Control**: Maintaining educational standards while embracing automation

## The Future Outlook

The future of AI in education looks promising, with emerging technologies like:

- **Natural Language Processing** for better human-AI interaction
- **Computer Vision** for analyzing student engagement and behavior
- **Machine Learning** for more sophisticated personalization algorithms

As we move forward, the key will be finding the right balance between technological innovation and human touch in education.`,
        category: "Technology",
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z",
        author_name: "Dr. Sarah Johnson",
        author_avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
        author_id: 1
      }
      
      setPost(mockPost)
    } catch (error) {
      console.error('Error fetching blog post:', error)
    } finally {
      setIsLoading(false)
    }
  }


  if (isLoading) {
    return (
      <div className="min-h-screen relative">
        {/* Grid Background Pattern */}
        <BGPattern 
          variant="grid" 
          size={26} 
          fill="#e5e7eb" 
          mask="fade-edges"
          className="opacity-10 blur-[90%]"
        />
        
        {/* Waves Background */}
        <WavesBackground 
          className="fixed inset-0 z-0 opacity-30" 
          color="#e5e7eb" 
          waveCount={2}
          speed={15}
        />
        
        <div className="relative z-10 py-12 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading blog post...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen relative">
        {/* Grid Background Pattern */}
        <BGPattern 
          variant="grid" 
          size={26} 
          fill="#e5e7eb" 
          mask="fade-edges"
          className="opacity-10 blur-[90%]"
        />
        
        {/* Waves Background */}
        <WavesBackground 
          className="fixed inset-0 z-0 opacity-30" 
          color="#e5e7eb" 
          waveCount={2}
          speed={15}
        />
        
        <div className="relative z-10 py-12 flex items-center justify-center">
          <div className="text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Blog post not found</h3>
            <p className="text-muted-foreground">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      {/* Grid Background Pattern */}
      <BGPattern 
        variant="grid" 
        size={26} 
        fill="#e5e7eb" 
        mask="fade-edges"
        className="opacity-10 blur-[90%]"
      />
      
      {/* Waves Background */}
      <WavesBackground 
        className="fixed inset-0 z-0 opacity-30" 
        color="#e5e7eb" 
        waveCount={2}
        speed={15}
      />
      
      <div className="relative z-10 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Back Button */}
          <div className="mb-6">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900" onClick={() => navigate('/blog')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </div>
          
          {/* Blog Header */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Badge variant="outline" className="px-3 py-1">{post.category}</Badge>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center space-x-6 text-gray-600">
              <div className="flex items-center space-x-3">
                 <Link to={`/profile/${post.author_id || post.id}`} className="hover:opacity-80 transition-opacity">
                   <Avatar className="h-12 w-12 cursor-pointer">
                     <AvatarImage 
                       src={post.author_avatar || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face&auto=format&q=80&ixlib=rb-4.0.3&ixid=${post.author_id || post.id}`} 
                       alt={post.author_name} 
                     />
                     <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700">
                       {post.author_name.split(' ').map(n => n[0]).join('')}
                     </AvatarFallback>
                   </Avatar>
                 </Link>
                <div>
                  <Link to={`/profile/${post.author_id || post.id}`} className="hover:text-blue-600 transition-colors">
                    <p className="font-medium text-gray-900">{post.author_name}</p>
                  </Link>
                  <p className="text-sm text-gray-500">IIT KGP Alumni</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span className="text-sm">{formatDate(post.created_at)}</span>
              </div>
            </div>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-8 pb-8">
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-600 leading-relaxed text-lg">
                    {post.content}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  About the Author
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                   <Link to={`/profile/${post.author_id || post.id}`} className="hover:opacity-80 transition-opacity">
                     <Avatar className="h-14 w-14 cursor-pointer">
                       <AvatarImage 
                         src={post.author_avatar || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face&auto=format&q=80&ixlib=rb-4.0.3&ixid=${post.author_id || post.id}`} 
                         alt={post.author_name} 
                       />
                       <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 text-lg">
                         {post.author_name.split(' ').map(n => n[0]).join('')}
                       </AvatarFallback>
                     </Avatar>
                   </Link>
                  <div>
                    <Link to={`/profile/${post.author_id || post.id}`} className="hover:text-blue-600 transition-colors">
                      <p className="font-medium text-gray-900">{post.author_name}</p>
                    </Link>
                    <p className="text-sm text-gray-500">IIT KGP Alumni</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Experienced professional sharing insights and experiences from their career journey in the tech industry.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Engage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400">
                  <Heart className="h-4 w-4 mr-2" />
                  Like this post
                </Button>
                <Button variant="outline" className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share with network
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Post Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Published</p>
                      <p className="text-sm text-gray-600">{formatDate(post.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                    <BookOpen className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Category</p>
                      <p className="text-sm text-gray-600 capitalize">{post.category}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
