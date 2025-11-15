import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Loader2, Plus, Users, Eye, Calendar, MapPin, DollarSign, Clock, Code } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getApiUrl } from '../config'

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
  application_count: number
}

export const AlumniProjectsPage: React.FC = () => {
  const { user, isLoading, token } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetch(getApiUrl('/api/alumni/projects'), {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        if (res.ok) {
          const data = await res.json()
          setProjects(data)
        } else {
          console.error('Failed to fetch projects:', await res.text())
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }
  
    if (token) loadProjects()
  }, [token])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
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
        <p className="text-muted-foreground">Only alumni can manage projects.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              All Projects
            </h1>
            <p className="text-gray-600">Browse and explore all projects from the IIT KGP community.</p>
          </div>
          <Button 
            asChild
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Link to="/alumni/create-project">
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {/* <Briefcase className="h-8 w-8 text-gray-400" /> */}
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">No projects yet</CardTitle>
              <CardDescription className="text-gray-600 mb-6">Create your first project to start connecting with students.</CardDescription>
              <Button 
                asChild
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Link to="/alumni/create-project">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Project
                </Link>
              </Button>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-6">
            {projects.map((project) => (
              <Card key={project.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge variant={project.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                            {project.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">{project.category}</Badge>
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-900">{project.title}</CardTitle>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-1">Applications</div>
                      <Badge variant="outline" className="text-sm font-semibold">{project.application_count}</Badge>
                    </div>
                  </div>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {project.stipend && (
                      <div className="flex items-center space-x-2 p-3 rounded-lg bg-green-50">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="text-xs font-medium text-gray-500">Stipend</p>
                          <p className="text-sm font-semibold text-gray-900">₹{project.stipend.toLocaleString()}</p>
                        </div>
                      </div>
                    )}
                    {project.duration && (
                      <div className="flex items-center space-x-2 p-3 rounded-lg bg-blue-50">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="text-xs font-medium text-gray-500">Duration</p>
                          <p className="text-sm font-semibold text-gray-900">{project.duration}</p>
                        </div>
                      </div>
                    )}
                    {project.location && (
                      <div className="flex items-center space-x-2 p-3 rounded-lg bg-purple-50">
                        <MapPin className="h-4 w-4 text-purple-600" />
                        <div>
                          <p className="text-xs font-medium text-gray-500">Location</p>
                          <p className="text-sm font-semibold text-gray-900">{project.location}</p>
                        </div>
                      </div>
                    )}
                    {project.work_type && (
                      <div className="flex items-center space-x-2 p-3 rounded-lg bg-orange-50">
                        <Code className="h-4 w-4 text-orange-600" />
                        <div>
                          <p className="text-xs font-medium text-gray-500">Work Type</p>
                          <p className="text-sm font-semibold text-gray-900 capitalize">{project.work_type}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {project.skills_required && project.skills_required.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Skills Required:</p>
                      <div className="flex flex-wrap gap-2">
                        {project.skills_required.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{project.team_members.length} members</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(project.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/projects/${project.id}`}>
                          <Eye className="mr-1 h-3 w-3" />
                          View
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        asChild
                        className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                      >
                        <Link to={`/alumni/projects/${project.id}/applications`}>
                          <Users className="mr-1 h-3 w-3" />
                          Applications
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
