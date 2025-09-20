import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { WavesBackground } from '@/components/ui/waves-background'
import { BGPattern } from '@/components/ui/bg-pattern'
import { formatDate, truncateText } from '@/lib/dataUtils'
import { BookOpen, Calendar, User, ArrowRight, Loader2 } from 'lucide-react'

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
  cover_image?: string
}

export const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [visiblePosts, setVisiblePosts] = useState(6) // Show 6 posts initially

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  const fetchBlogPosts = async () => {
    try {
      // For now, using mock data. In real implementation, this would fetch from API
      const mockPosts: BlogPost[] = [
        {
          id: 1,
          title: "The Future of AI in Education: Transforming Learning Experiences",
          content: "Artificial Intelligence is revolutionizing the education sector, offering personalized learning experiences and intelligent tutoring systems. This comprehensive guide explores how AI technologies are reshaping traditional educational paradigms...",
          category: "Technology",
          created_at: "2024-01-15T10:00:00Z",
          updated_at: "2024-01-15T10:00:00Z",
          author_name: "Dr. Sarah Johnson",
          author_avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
          author_id: 1,
          cover_image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop"
        },
        {
          id: 2,
          title: "Building Scalable Web Applications with Modern JavaScript",
          content: "Learn how to build robust, scalable web applications using modern JavaScript frameworks and best practices. This tutorial covers everything from setup to deployment...",
          category: "Development",
          created_at: "2024-01-12T14:30:00Z",
          updated_at: "2024-01-12T14:30:00Z",
          author_name: "Rajesh Kumar",
          author_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
          author_id: 2,
          cover_image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop"
        },
        {
          id: 3,
          title: "Sustainable Technology: Green Computing for a Better Future",
          content: "Explore the intersection of technology and sustainability. Learn about green computing practices, energy-efficient algorithms, and how tech companies are reducing their carbon footprint...",
          category: "Sustainability",
          created_at: "2024-01-10T09:15:00Z",
          updated_at: "2024-01-10T09:15:00Z",
          author_name: "Dr. Priya Sharma",
          author_avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
          author_id: 3,
          cover_image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop"
        },
        {
          id: 4,
          title: "Cybersecurity Best Practices for Startups",
          content: "Protect your startup from cyber threats with these essential security practices. From secure coding to incident response, learn how to build a robust security foundation...",
          category: "Security",
          created_at: "2024-01-08T16:45:00Z",
          updated_at: "2024-01-08T16:45:00Z",
          author_name: "Amit Patel",
          author_avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
          author_id: 4
        },
        {
          id: 5,
          title: "The Rise of Quantum Computing: What It Means for Developers",
          content: "Quantum computing is no longer science fiction. Discover how quantum algorithms are solving complex problems and what this means for the future of software development...",
          category: "Technology",
          created_at: "2024-01-05T11:20:00Z",
          updated_at: "2024-01-05T11:20:00Z",
          author_name: "Dr. Neha Gupta",
          author_avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
          author_id: 5
        },
        {
          id: 6,
          title: "Machine Learning in Healthcare: Improving Patient Outcomes",
          content: "Discover how machine learning algorithms are transforming healthcare, from diagnostic imaging to drug discovery. Learn about the latest breakthroughs and their impact on patient care...",
          category: "Healthcare",
          created_at: "2024-01-03T13:10:00Z",
          updated_at: "2024-01-03T13:10:00Z",
          author_name: "Vikram Singh",
          author_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
          author_id: 6
        },
        {
          id: 7,
          title: "Building Inclusive Tech Teams: Diversity and Inclusion in Tech",
          content: "Learn how to create more inclusive and diverse tech teams. This guide covers recruitment strategies, inclusive workplace practices, and the business benefits of diversity...",
          category: "Career",
          created_at: "2024-01-01T08:30:00Z",
          updated_at: "2024-01-01T08:30:00Z",
          author_name: "Dr. Sarah Johnson",
          author_avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
          author_id: 1
        },
        {
          id: 8,
          title: "Cloud-Native Architecture: Designing for Scale",
          content: "Master cloud-native architecture patterns and learn how to design applications that scale seamlessly. This comprehensive guide covers microservices, containers, and orchestration...",
          category: "Architecture",
          created_at: "2023-12-28T15:45:00Z",
          updated_at: "2023-12-28T15:45:00Z",
          author_name: "Rajesh Kumar",
          author_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
          author_id: 2
        }
      ]
      
      setPosts(mockPosts)
    } catch (error) {
      console.error('Error fetching blog posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMorePosts = () => {
    setVisiblePosts(prev => prev + 6)
  }

  const displayedPosts = posts.slice(0, visiblePosts)
  const hasMorePosts = visiblePosts < posts.length


  if (isLoading) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading blog posts...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 relative">
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
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Blog & Insights</h1>
          <p className="text-xl text-muted-foreground">
            Learn from alumni experiences and industry insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                <img 
                  src={post.cover_image || `https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop&crop=center&auto=format&q=80&ixlib=rb-4.0.3&ixid=${post.id}`}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.style.display = 'flex';
                    }
                  }}
                />
                <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 items-center justify-center hidden">
                  <BookOpen className="h-12 w-12 text-blue-400" />
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline">{post.category}</Badge>
                </div>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {truncateText(post.content)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                   <Link to={`/profile/${post.author_id || post.id}`} className="hover:opacity-80 transition-opacity">
                     <Avatar className="h-8 w-8 cursor-pointer">
                       <AvatarImage 
                         src={post.author_avatar || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face&auto=format&q=80&ixlib=rb-4.0.3&ixid=${post.author_id || post.id}`} 
                         alt={post.author_name} 
                       />
                       <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 text-xs">
                         {post.author_name.split(' ').map(n => n[0]).join('')}
                       </AvatarFallback>
                     </Avatar>
                   </Link>
                  <div>
                    <Link to={`/profile/${post.author_id || post.id}`} className="hover:text-blue-600 transition-colors">
                      <p className="text-sm font-medium">{post.author_name}</p>
                    </Link>
                    <p className="text-xs text-muted-foreground">{formatDate(post.created_at)}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link to={`/blog/${post.id}`}>
                    Read More
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View More Button */}
        {hasMorePosts && (
          <div className="text-center mt-12">
            <Button 
              onClick={loadMorePosts}
              variant="outline" 
              size="lg"
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-8 py-3"
            >
              View More Posts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {posts.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No blog posts found</h3>
            <p className="text-muted-foreground">
              Check back later for new insights from our alumni community.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
