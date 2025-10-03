import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Briefcase, Users, Loader2, Send, CheckCircle, ArrowLeft, MapPin, Clock, DollarSign, Code, Building } from 'lucide-react'

interface Project {
  id: number
  title: string
  description: string
  category: string
  status: string
  team_members: string[]
  tags: string[]
  skills_required: string[]
  stipend?: number
  duration?: string
  location?: string
  work_type?: string
  created_at: string
  created_by_name: string
  created_by_email: string
}

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [applicationMessage, setApplicationMessage] = useState('')
  const [isApplying, setIsApplying] = useState(false)
  const [applicationSubmitted, setApplicationSubmitted] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchProject()
      if (user && user.role === 'student') {
        checkApplicationStatus()
      }
    }
  }, [id, user])

  const fetchProject = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/projects/${id}`)
      if (response.ok) {
        const data = await response.json()
        setProject(data)
      } else {
        console.error('Failed to fetch project')
        setProject(null)
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      setProject(null)
    } finally {
      setIsLoading(false)
    }
  }

  const checkApplicationStatus = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/projects/${id}/application-status`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setHasApplied(data.has_applied)
        setApplicationStatus(data.status || null)
      }
    } catch (error) {
      console.error('Error checking application status:', error)
    }
  }

  const handleApply = async () => {
    if (!user || !project) return

    setIsApplying(true)
    try {
      const response = await fetch('http://localhost:5001/api/project-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          project_id: project.id,
          message: applicationMessage
        })
      })

      if (response.ok) {
        setApplicationSubmitted(true)
        setHasApplied(true)
        setApplicationStatus('pending')
        setApplicationMessage('')
      } else {
        const error = await response.json()
        console.error('Failed to submit application:', error.error)
        alert(error.error || 'Failed to submit application')
      }
    } catch (error) {
      console.error('Error submitting application:', error)
    } finally {
      setIsApplying(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
          <span className="text-lg text-gray-600">Loading project...</span>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Briefcase className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Project not found</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/projects')}
            className="bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 px-6 py-3 rounded-full font-semibold"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
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
            onClick={() => navigate('/projects')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Project Header */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8">
                  {/* Status and Category */}
                  <div className="flex items-center gap-3 mb-6">
                    <Badge 
                      variant={project.status === 'active' ? 'default' : 'secondary'}
                      className="px-4 py-2 text-sm font-medium"
                    >
                      {project.status}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className="px-4 py-2 text-sm font-medium border-blue-200 text-blue-700"
                    >
                      {project.category}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent leading-tight">
                    {project.title}
                  </h1>

                  {/* Description */}
                  <p className="text-lg text-gray-700 leading-relaxed mb-8">
                    {project.description}
                  </p>

                  {/* Project Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {project.stipend && (
                      <div className="flex items-center space-x-3 p-4 rounded-xl bg-green-50 border border-green-100">
                        <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Stipend</p>
                          <p className="text-lg font-bold text-green-600">₹{project.stipend.toLocaleString()}</p>
                        </div>
                      </div>
                    )}

                    {project.duration && (
                      <div className="flex items-center space-x-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Clock className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Duration</p>
                          <p className="text-lg font-semibold text-blue-600">{project.duration}</p>
                        </div>
                      </div>
                    )}

                    {project.location && (
                      <div className="flex items-center space-x-3 p-4 rounded-xl bg-purple-50 border border-purple-100">
                        <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Location</p>
                          <p className="text-lg font-semibold text-purple-600">{project.location}</p>
                        </div>
                      </div>
                    )}

                    {project.work_type && (
                      <div className="flex items-center space-x-3 p-4 rounded-xl bg-orange-50 border border-orange-100">
                        <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <Building className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Work Type</p>
                          <p className="text-lg font-semibold text-orange-600 capitalize">{project.work_type}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Skills Required */}
              {project.skills_required && project.skills_required.length > 0 && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Code className="h-5 w-5 text-blue-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Skills Required</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {project.skills_required.map((skill: string) => (
                        <Badge 
                          key={skill} 
                          variant="default" 
                          className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Team Members */}
              {project.team_members && project.team_members.length > 0 && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-green-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
                    </div>
                    <div className="space-y-3">
                      {project.team_members.map((member: string, index: number) => (
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
                  </div>
                </div>
              )}

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Tags</h2>
                    <div className="flex flex-wrap gap-3">
                      {project.tags.map((tag: string) => (
                        <Badge 
                          key={tag} 
                          variant="outline" 
                          className="px-3 py-1 text-sm border-gray-200 text-gray-700 hover:bg-gray-50"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Author Info */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Project Creator</h3>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gray-100 text-gray-600 text-lg font-semibold">
                        {project.created_by_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">{project.created_by_name}</p>
                      <p className="text-sm text-gray-500">Project Lead</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Section */}
              {user && user.role === 'student' && project.status === 'active' && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    {hasApplied || applicationSubmitted ? (
                      <div className="text-center">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Already Applied!</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          Your application has been sent to the project creator.
                        </p>
                        {applicationStatus && (
                          <Badge variant={
                            applicationStatus === 'accepted' ? 'default' : 
                            applicationStatus === 'declined' ? 'destructive' : 
                            'secondary'
                          }>
                            Status: {applicationStatus}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Apply for this Project</h3>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold">
                              Apply Now
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Apply for {project.title}</DialogTitle>
                              <DialogDescription>
                                Write a message to introduce yourself and explain why you're interested in this project.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <Textarea
                                placeholder="Tell us about yourself and why you want to work on this project..."
                                value={applicationMessage}
                                onChange={(e) => setApplicationMessage(e.target.value)}
                                rows={4}
                              />
                              <Button 
                                onClick={handleApply} 
                                disabled={isApplying || !applicationMessage.trim()}
                                className="w-full"
                              >
                                {isApplying ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                  </>
                                ) : (
                                  <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Submit Application
                                  </>
                                )}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Project Stats */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Project Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Created</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                        {project.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Category</span>
                      <span className="text-sm font-medium text-gray-900">{project.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}