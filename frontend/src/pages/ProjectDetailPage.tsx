import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { WavesBackground } from '@/components/ui/waves-background'
import { BGPattern } from '@/components/ui/bg-pattern'
import { parseJsonField } from '@/lib/dataUtils'
import { Briefcase, Calendar, Users, ExternalLink, Loader2, Send, CheckCircle, ArrowLeft, Star, MessageCircle } from 'lucide-react'

interface Project {
  id: number
  title: string
  description: string
  category: string
  status: string
  team_members: string[]
  tags: string[]
  created_at: string
  created_by_name: string
  created_by_email: string
}

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [applicationMessage, setApplicationMessage] = useState('')
  const [isApplying, setIsApplying] = useState(false)
  const [applicationSubmitted, setApplicationSubmitted] = useState(false)

  useEffect(() => {
    if (id) {
      fetchProject()
    }
  }, [id])

  const fetchProject = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/projects/${id}`)
      if (response.ok) {
        const data = await response.json()
        setProject(data)
      }
    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApply = async () => {
    if (!user || user.role !== 'student') return

    setIsApplying(true)
    try {
      const response = await fetch(`http://localhost:5001/api/projects/${id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ message: applicationMessage })
      })

      if (response.ok) {
        setApplicationSubmitted(true)
        setApplicationMessage('')
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to submit application')
      }
    } catch (error) {
      console.error('Error applying to project:', error)
      alert('Failed to submit application')
    } finally {
      setIsApplying(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen relative">
        {/* Grid Background Pattern */}
        <BGPattern 
          variant="grid" 
          size={28} 
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
            <span>Loading project...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen relative">
        {/* Grid Background Pattern */}
        <BGPattern 
          variant="grid" 
          size={28} 
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
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Project not found</h3>
            <p className="text-muted-foreground">
              The project you're looking for doesn't exist or has been removed.
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
        size={28} 
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
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
          </div>
          
          {/* Project Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Badge variant={project.status === 'active' ? 'default' : 'secondary'} className="px-3 py-1">
                {project.status}
              </Badge>
              <Badge variant="outline" className="px-3 py-1">{project.category}</Badge>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              {project.title}
            </h1>
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex items-center space-x-2">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {project.created_by_name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">Created by {project.created_by_name}</p>
                  <p className="text-sm text-gray-500">Project Lead</p>
                </div>
              </div>
            </div>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">Project Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {project.description}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">Technologies & Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {parseJsonField(project.tags).map((tag: string) => (
                    <Badge key={tag} variant="outline" className="px-4 py-2 text-sm font-medium border-gray-300 text-gray-700 hover:bg-gray-50">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Team Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {parseJsonField(project.team_members).map((member: string, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-br from-pink-100 to-blue-100 text-gray-700">
                          {member.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{member}</p>
                        <p className="text-sm text-gray-500">Team Member</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Project Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Created</p>
                      <p className="text-sm text-gray-600">{new Date(project.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                    <Users className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Team Size</p>
                      <p className="text-sm text-gray-600">{parseJsonField(project.team_members).length} members</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                    <Star className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Status</p>
                      <p className="text-sm text-gray-600 capitalize">{project.status}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {user && user.role === 'student' && (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Join This Project
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {applicationSubmitted ? (
                    <div className="text-center py-6">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                      <p className="text-lg font-medium text-green-600">Application submitted!</p>
                      <p className="text-sm text-gray-600 mt-1">The team will review your application soon.</p>
                    </div>
                  ) : (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white shadow-lg shadow-pink-200/30 border-0 py-3">
                          Apply to Project
                          <Send className="ml-2 h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold">Apply to {project.title}</DialogTitle>
                          <DialogDescription className="text-gray-600">
                            Tell us why you're interested and what you can contribute to this project.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Textarea
                            placeholder="Share your relevant experience and why you want to join this project..."
                            value={applicationMessage}
                            onChange={(e) => setApplicationMessage(e.target.value)}
                            rows={4}
                            className="border-gray-300 focus:border-pink-500"
                          />
                          <Button 
                            onClick={handleApply} 
                            disabled={isApplying || !applicationMessage.trim()}
                            className="w-full bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white border-0"
                          >
                            {isApplying ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              'Submit Application'
                            )}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardContent>
              </Card>
            )}

            <Button variant="outline" className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 py-3">
              Contact Team
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
