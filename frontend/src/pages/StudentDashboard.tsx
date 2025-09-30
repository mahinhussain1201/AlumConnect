import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, Briefcase, ArrowRight, Users, BookOpen, Bell, UserPlus, Search } from 'lucide-react'
import { Link } from 'react-router-dom'

interface ProjectItem {
  id: number
  title: string
  description: string
  category: string
  status: string
  tags: string[]
  team_members: string[]
  created_by_name: string
  application_status: string
  applied_at: string
}

interface MentorshipRequest {
  id: number
  message: string
  status: string
  created_at: string
  other_user_name: string
  other_user_email: string
}

interface DashboardStats {
  applied_projects: number
  mentorship_requests: number
  accepted_projects: number
  pending_applications: number
}

export const StudentDashboard: React.FC = () => {
  const { token, user, isLoading } = useAuth()
  const [appliedProjects, setAppliedProjects] = useState<ProjectItem[]>([])
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    applied_projects: 0,
    mentorship_requests: 0,
    accepted_projects: 0,
    pending_applications: 0
  })
  const [loading, setLoading] = useState(true)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  useEffect(() => {
    const loadData = async () => {
      if (!token) return
      
      try {
        // Load applied projects
        const projectsRes = await fetch('http://localhost:5001/api/students/applied-projects', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (projectsRes.ok) {
          const projectsData = await projectsRes.json()
          setAppliedProjects(projectsData)
          
          // Calculate stats
          const acceptedProjects = projectsData.filter((p: ProjectItem) => p.application_status === 'accepted').length
          const pendingApplications = projectsData.filter((p: ProjectItem) => p.application_status === 'pending').length
          
          setStats(prev => ({
            ...prev,
            applied_projects: projectsData.length,
            accepted_projects: acceptedProjects,
            pending_applications: pendingApplications
          }))
        }

        // Load mentorship requests
        const mentorshipRes = await fetch('http://localhost:5001/api/mentorship/requests', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (mentorshipRes.ok) {
          const mentorshipData = await mentorshipRes.json()
          setMentorshipRequests(mentorshipData)
          setStats(prev => ({
            ...prev,
            mentorship_requests: mentorshipData.length
          }))
        }
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [token])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Please log in to access your dashboard.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Student Dashboard</h1>
          <p className="text-muted-foreground">Track your applications, find mentors, and explore opportunities.</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applied Projects</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.applied_projects}</div>
              <p className="text-xs text-muted-foreground">Total applications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted Projects</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.accepted_projects}</div>
              <p className="text-xs text-muted-foreground">Projects you're part of</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mentorship Requests</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.mentorship_requests}</div>
              <p className="text-xs text-muted-foreground">Requests sent</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending_applications}</div>
              <p className="text-xs text-muted-foreground">Awaiting response</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Explore opportunities and connect with alumni</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button asChild className="h-20 flex flex-col items-center justify-center">
                  <Link to="/projects">
                    <Search className="h-6 w-6 mb-2" />
                    <span className="text-sm">Browse Projects</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Link to="/alumni-connect">
                    <UserPlus className="h-6 w-6 mb-2" />
                    <span className="text-sm">Find Mentors</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Link to="/blog">
                    <BookOpen className="h-6 w-6 mb-2" />
                    <span className="text-sm">Read Blogs</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Link to="/profile">
                    <Users className="h-6 w-6 mb-2" />
                    <span className="text-sm">My Profile</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest applications and requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : appliedProjects.length === 0 && mentorshipRequests.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
                ) : (
                  <>
                    {appliedProjects.slice(0, 3).map((project) => (
                      <div key={project.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Applied to {project.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(project.applied_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline" className="capitalize">{project.application_status}</Badge>
                      </div>
                    ))}
                    {mentorshipRequests.slice(0, 2).map((request) => (
                      <div key={request.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Mentorship request to {request.other_user_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(request.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline" className="capitalize">{request.status}</Badge>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applied Projects Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Applied Projects</CardTitle>
              <CardDescription>Projects you have applied to</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : appliedProjects.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No applications yet</p>
                  <Button asChild>
                    <Link to="/projects">Browse Projects</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {appliedProjects.slice(0, 3).map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{project.title}</p>
                        <p className="text-sm text-muted-foreground">{project.category}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="capitalize">{project.application_status}</Badge>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/projects/${project.id}`}>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                  {appliedProjects.length > 3 && (
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/student/applications">View All Applications</Link>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mentorship Requests</CardTitle>
              <CardDescription>Your mentorship requests to alumni</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : mentorshipRequests.length === 0 ? (
                <div className="text-center py-8">
                  <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No mentorship requests yet</p>
                  <Button asChild>
                    <Link to="/alumni-connect">Find Alumni Mentors</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {mentorshipRequests.slice(0, 3).map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{request.other_user_name}</p>
                        <p className="text-sm text-muted-foreground">{request.message}</p>
                      </div>
                      <Badge variant="outline" className="capitalize">{request.status}</Badge>
                    </div>
                  ))}
                  {mentorshipRequests.length > 3 && (
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/student/mentorship">View All Requests</Link>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
