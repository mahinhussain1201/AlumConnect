import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Loader2, User, Check, X, Mail, ArrowLeft, Eye, CheckCircle, Users, User as UserIcon, Filter } from 'lucide-react'
import { ProfileModal } from '../components/ProfileModal'
import { FeedbackModal } from '../components/FeedbackModal'
import { getApiUrl } from '../config'

interface ProjectApplication {
  id: number
  message: string
  status: string
  created_at: string
  student_name: string
  student_email: string
  student_id?: number
  is_completed?: boolean
  completed_at?: string
  feedback?: string
  has_team?: boolean
}

interface Project {
  id: number
  title: string
  description: string
}

export const ProjectApplicationsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { token, user, isLoading } = useAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [applications, setApplications] = useState<ProjectApplication[]>([])
  const [filteredApplications, setFilteredApplications] = useState<ProjectApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<number | null>(null)
  const [founderType, setFounderType] = useState<'all' | 'team' | 'individual'>('all')
  const [pendingApplications, setPendingApplications] = useState<ProjectApplication[]>([])
  const [processedApplications, setProcessedApplications] = useState<ProjectApplication[]>([])
  const [profileUserId, setProfileUserId] = useState<number | null>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [feedbackModal, setFeedbackModal] = useState<{
    isOpen: boolean
    applicationId: number | null
    studentName: string
    projectTitle: string
  }>({
    isOpen: false,
    applicationId: null,
    studentName: '',
    projectTitle: ''
  })

  const openProfileForApplicant = async (app: ProjectApplication) => {
    if (app.student_id) {
      setProfileUserId(app.student_id)
      setIsProfileOpen(true)
      return
    }

    // Fallback: fetch available users and match by email to get the user id
    try {
      const res = await fetch(getApiUrl('/api/messages/available-users'), {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const users = await res.json()
        const match = users.find((u: any) => u.email && u.email.toLowerCase() === app.student_email.toLowerCase())
        if (match?.id) {
          setProfileUserId(match.id)
          setIsProfileOpen(true)
        } else {
          alert('Unable to find user profile for this applicant.')
        }
      }
    } catch (e) {
      console.error('Failed to resolve user by email', e)
      alert('Unable to open profile right now.')
    }
  }

  useEffect(() => {
    const loadData = async () => {
      if (!token || !id) return
      
      try {
        // Load project details
        const projectRes = await fetch(getApiUrl(`/api/projects/${id}`))
        if (projectRes.ok) {
          const projectData = await projectRes.json()
          setProject(projectData)
        }

        // Load applications for this specific project
        const appsRes = await fetch(getApiUrl(`/api/projects/${id}/applications`), {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (appsRes.ok) {
          const appsData = await appsRes.json()
          setApplications(appsData)
          setFilteredApplications(appsData) // Initialize filtered applications with all applications
        }
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [token, id])

  const handleApplication = async (applicationId: number, action: 'accept' | 'decline') => {
    if (!token) return
    
    setProcessing(applicationId)
    try {
      const res = await fetch(getApiUrl(`/api/project-applications/${applicationId}/${action}`), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      
      if (res.ok) {
        // Update the application status in the local state
        setApplications(prev => prev.map(app => 
          app.id === applicationId ? { ...app, status: action === 'accept' ? 'accepted' : 'declined' } : app
        ))
      }
    } finally {
      setProcessing(null)
    }
  }

  // Filter applications based on founder type and status
  useEffect(() => {
    if (!applications.length) return;
    
    let result = [...applications]
    
    if (founderType === 'team') {
      result = result.filter(app => app.has_team === true)
    } else if (founderType === 'individual') {
      result = result.filter(app => !app.has_team)
    }
    
    setFilteredApplications(result)
    setPendingApplications(result.filter(app => app.status === 'pending'))
    setProcessedApplications(result.filter(app => app.status !== 'pending'))
  }, [founderType, applications])

  if (isLoading || loading) {
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
        <p className="text-muted-foreground">
          {applications.length === 0 
            ? "Applications for this project will appear here."
            : "No applications match the current filter."}
        </p>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Project not found.</p>
      </div>
    )
  }


  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/alumni/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Applications for {project.title}</h1>
              <p className="text-muted-foreground">{project.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select 
                value={founderType}
                onValueChange={(value: 'all' | 'team' | 'individual') => setFounderType(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by founder type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      <span>All Applicants</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="team">
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4 text-blue-600" />
                      <span>Team</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="individual">
                    <div className="flex items-center">
                      <UserIcon className="mr-2 h-4 w-4 text-purple-600" />
                      <span>Individual</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Pending Applications */}
          {pendingApplications.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Pending Applications ({pendingApplications.length})</h2>
              <div className="space-y-4">
                {pendingApplications.map((application) => (
                  <Card key={application.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Application from {application.student_name}</CardTitle>
                          <CardDescription>{application.student_email}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="secondary" className={application.has_team ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-gray-100 text-gray-700 border-gray-200"}>
                            {application.has_team ? "Has Team" : "Individual"}
                          </Badge>
                          <Badge variant="outline" className="capitalize">{application.status}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{application.student_name}</span>
                          <Mail className="h-4 w-4 text-muted-foreground ml-2" />
                          <span className="text-sm text-muted-foreground">{application.student_email}</span>
                        </div>
                        
                        {application.message && (
                          <div className="p-3 bg-muted rounded-lg">
                            <p className="text-sm font-medium mb-1">Message:</p>
                            <p className="text-sm">{application.message}</p>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Applied on {new Date(application.created_at).toLocaleDateString()}
                          </span>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openProfileForApplicant(application)}
                            >
                              <Eye className="mr-1 h-3 w-3" />
                              View Profile
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleApplication(application.id, 'decline')}
                              disabled={processing === application.id}
                            >
                              {processing === application.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <>
                                  <X className="mr-1 h-3 w-3" />
                                  Decline
                                </>
                              )}
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleApplication(application.id, 'accept')}
                              disabled={processing === application.id}
                            >
                              {processing === application.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <>
                                  <Check className="mr-1 h-3 w-3" />
                                  Accept
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Processed Applications */}
          {processedApplications.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Processed Applications ({processedApplications.length})</h2>
              <div className="space-y-4">
                {processedApplications.map((application) => (
                  <Card key={application.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Application from {application.student_name}</CardTitle>
                          <CardDescription>{application.student_email}</CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className={application.has_team ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-gray-100 text-gray-700 border-gray-200"}>
                            {application.has_team ? "Has Team" : "Individual"}
                          </Badge>
                          <Badge
                            variant={application.status === 'accepted' ? 'default' : 'secondary'}
                            className="capitalize"
                          >
                            {application.status}
                          </Badge>
                          {application.is_completed && (
                            <Badge className="bg-green-500">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{application.student_name}</span>
                          <Mail className="h-4 w-4 text-muted-foreground ml-2" />
                          <span className="text-sm text-muted-foreground">{application.student_email}</span>
                        </div>
                        
                        {application.message && (
                          <div className="p-3 bg-muted rounded-lg">
                            <p className="text-sm font-medium mb-1">Message:</p>
                            <p className="text-sm">{application.message}</p>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Applied on {new Date(application.created_at).toLocaleDateString()}
                            {application.is_completed && application.completed_at && (
                              <span className="ml-2 text-green-600">
                                • Completed on {new Date(application.completed_at).toLocaleDateString()}
                              </span>
                            )}
                          </span>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openProfileForApplicant(application)}
                            >
                              <Eye className="mr-1 h-3 w-3" />
                              View Profile
                            </Button>
                            {application.status === 'accepted' && !application.is_completed && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                onClick={() => setFeedbackModal({
                                  isOpen: true,
                                  applicationId: application.id,
                                  studentName: application.student_name,
                                  projectTitle: project?.title || ''
                                })}
                              >
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Mark as Completed
                              </Button>
                            )}
                          </div>
                        </div>
                        {application.is_completed && application.feedback && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-xs font-medium text-green-800 mb-1">Your Feedback:</p>
                            <p className="text-sm text-gray-700">{application.feedback}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {filteredApplications.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>No applications yet</CardTitle>
                <CardDescription>Applications for this project will appear here.</CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </div>
      {profileUserId && (
        <ProfileModal
          userId={profileUserId}
          isOpen={isProfileOpen}
          onClose={() => { setIsProfileOpen(false); setProfileUserId(null) }}
        />
      )}

      {/* Feedback Modal */}
      {feedbackModal.applicationId && (
        <FeedbackModal
          isOpen={feedbackModal.isOpen}
          onClose={() => setFeedbackModal({
            isOpen: false,
            applicationId: null,
            studentName: '',
            projectTitle: ''
          })}
          applicationId={feedbackModal.applicationId}
          studentName={feedbackModal.studentName}
          projectTitle={feedbackModal.projectTitle}
          onSuccess={async () => {
            // Reload applications to show updated status
            if (!token || !id) return
            try {
              const res = await fetch(getApiUrl(`/api/projects/${id}/applications`), {
                headers: { Authorization: `Bearer ${token}` },
              })
              if (res.ok) {
                const data = await res.json()
                setApplications(data)
              }
            } catch (error) {
              console.error('Error reloading applications:', error)
            }
          }}
        />
      )}
    </div>
  )
}

// Profile Modal Mount
// Render modal at root of component
