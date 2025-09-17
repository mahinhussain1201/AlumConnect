import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { WavesBackground } from '@/components/ui/waves-background'
import { BGPattern } from '@/components/ui/bg-pattern'
import { Users, Briefcase, MessageCircle, Star, Clock, MapPin, DollarSign, Calendar, ArrowRight, Loader2, Send, CheckCircle } from 'lucide-react'

interface AlumniProject {
  id: number
  title: string
  description: string
  company: string
  alumni_name: string
  alumni_email: string
  avatar?: string
  duration: string
  stipend: string
  location_type: 'remote' | 'onsite' | 'hybrid'
  location?: string
  skills_required: string[]
  created_at: string
  status: 'active' | 'closed'
}

export const AlumniConnectPage: React.FC = () => {
  const [projects, setProjects] = useState<AlumniProject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<AlumniProject | null>(null)
  const [applicationMessage, setApplicationMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [applicationSubmitted, setApplicationSubmitted] = useState(false)

  useEffect(() => {
    fetchAlumniProjects()
  }, [])

  const fetchAlumniProjects = async () => {
    try {
      // For now, using mock data. In real implementation, this would fetch from API
      const mockProjects: AlumniProject[] = [
        {
          id: 1,
          title: "AI-Powered Analytics Platform",
          description: "Join our team to build the next generation of business intelligence tools using machine learning and data visualization. You'll work on cutting-edge algorithms and help create intuitive dashboards for enterprise clients.",
          company: "TechCorp Solutions",
          alumni_name: "Dr. Sarah Johnson",
          alumni_email: "sarah.johnson@techcorp.com",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
          duration: "6 months",
          stipend: "₹50,000/month",
          location_type: "hybrid",
          location: "Bangalore, India",
          skills_required: ["Python", "Machine Learning", "React", "SQL"],
          created_at: "2024-01-15",
          status: "active"
        },
        {
          id: 2,
          title: "Blockchain Supply Chain Solution",
          description: "Revolutionize supply chain transparency with blockchain technology. Work on smart contracts, decentralized applications, and integration with existing enterprise systems.",
          company: "ChainLogix",
          alumni_name: "Rajesh Kumar",
          alumni_email: "rajesh.kumar@chainlogix.com",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
          duration: "4 months",
          stipend: "₹45,000/month",
          location_type: "remote",
          skills_required: ["Solidity", "Web3", "Node.js", "Blockchain"],
          created_at: "2024-01-20",
          status: "active"
        },
        {
          id: 3,
          title: "Mobile Health Application",
          description: "Develop a comprehensive health monitoring app that integrates with wearable devices and provides personalized health insights using AI.",
          company: "HealthTech Innovations",
          alumni_name: "Dr. Priya Sharma",
          alumni_email: "priya.sharma@healthtech.com",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
          duration: "8 months",
          stipend: "₹60,000/month",
          location_type: "onsite",
          location: "Mumbai, India",
          skills_required: ["React Native", "Flutter", "AI/ML", "Healthcare APIs"],
          created_at: "2024-01-25",
          status: "active"
        },
        {
          id: 4,
          title: "Fintech Payment Gateway",
          description: "Build a secure, scalable payment processing system that handles millions of transactions with real-time fraud detection and compliance features.",
          company: "PaySecure",
          alumni_name: "Amit Patel",
          alumni_email: "amit.patel@paysecure.com",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
          duration: "5 months",
          stipend: "₹55,000/month",
          location_type: "hybrid",
          location: "Delhi, India",
          skills_required: ["Java", "Spring Boot", "Microservices", "Security"],
          created_at: "2024-02-01",
          status: "active"
        },
        {
          id: 5,
          title: "IoT Smart City Platform",
          description: "Create an integrated platform for smart city management, including traffic monitoring, energy optimization, and citizen services.",
          company: "SmartCity Solutions",
          alumni_name: "Dr. Neha Gupta",
          alumni_email: "neha.gupta@smartcity.com",
          avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
          duration: "7 months",
          stipend: "₹52,000/month",
          location_type: "onsite",
          location: "Pune, India",
          skills_required: ["IoT", "Python", "Cloud Computing", "Data Analytics"],
          created_at: "2024-02-05",
          status: "active"
        },
        {
          id: 6,
          title: "E-commerce Recommendation Engine",
          description: "Develop an advanced recommendation system using deep learning to personalize shopping experiences and increase conversion rates.",
          company: "ShopSmart",
          alumni_name: "Vikram Singh",
          alumni_email: "vikram.singh@shopsmart.com",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
          duration: "6 months",
          stipend: "₹48,000/month",
          location_type: "remote",
          skills_required: ["Deep Learning", "Python", "TensorFlow", "Recommendation Systems"],
          created_at: "2024-02-10",
          status: "active"
        }
      ]
      
      setProjects(mockProjects)
    } catch (error) {
      console.error('Error fetching alumni projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplicationSubmit = async () => {
    if (!selectedProject || !applicationMessage.trim()) return
    
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Here you would typically send the application to your backend
      console.log('Application submitted:', {
        projectId: selectedProject.id,
        message: applicationMessage,
        timestamp: new Date().toISOString()
      })
      
      setApplicationSubmitted(true)
      setApplicationMessage('')
    } catch (error) {
      console.error('Error submitting application:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen relative">
        {/* Grid Background Pattern */}
        <BGPattern 
          variant="grid" 
          size={30} 
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
            <span>Loading alumni projects...</span>
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
        size={30} 
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
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Alumni Projects
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover exciting internship and project opportunities from successful IIT KGP alumni. Apply to work on cutting-edge projects and gain real-world experience.
            </p>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project) => (
            <Card key={project.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Link to={`/profile/${project.id}`} className="hover:opacity-80 transition-opacity">
                      <Avatar className="h-12 w-12 cursor-pointer">
                        <AvatarImage src={project.avatar} alt={project.alumni_name} />
                        <AvatarFallback className="bg-gradient-to-br from-pink-100 to-blue-100 text-gray-700">
                          {project.alumni_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">{project.title}</CardTitle>
                      <CardDescription className="text-gray-600">{project.company}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={project.status === 'active' ? 'default' : 'secondary'} className="px-3 py-1">
                    {project.status}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-sm font-medium text-gray-900">by {project.alumni_name}</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">IIT KGP Alumni</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <p className="text-gray-600 leading-relaxed">
                  {project.description}
                </p>
                
                {/* Project Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 p-3 rounded-lg bg-gray-50">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="text-xs font-medium text-gray-900">Duration</p>
                      <p className="text-sm text-gray-600">{project.duration}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 rounded-lg bg-gray-50">
                    <DollarSign className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="text-xs font-medium text-gray-900">Stipend</p>
                      <p className="text-sm text-gray-600">{project.stipend}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 rounded-lg bg-gray-50">
                    <MapPin className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="text-xs font-medium text-gray-900">Location</p>
                      <p className="text-sm text-gray-600 capitalize">
                        {project.location_type}
                        {project.location && ` • ${project.location}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 rounded-lg bg-gray-50">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="text-xs font-medium text-gray-900">Posted</p>
                      <p className="text-sm text-gray-600">{new Date(project.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                {/* Skills Required */}
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">Skills Required:</p>
                  <div className="flex flex-wrap gap-2">
                    {project.skills_required.map((skill, index) => (
                      <Badge key={index} variant="outline" className="px-3 py-1 text-xs border-gray-300 text-gray-700">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="flex-1 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white shadow-lg shadow-pink-200/30 border-0"
                        onClick={() => setSelectedProject(project)}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Apply Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Apply to {project.title}</DialogTitle>
                        <DialogDescription>
                          Send a message to {project.alumni_name} explaining why you're interested in this project and how you can contribute.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="application-message">Your Message</Label>
                          <Textarea
                            id="application-message"
                            placeholder="Tell us about your relevant experience, skills, and why you want to work on this project..."
                            value={applicationMessage}
                            onChange={(e) => setApplicationMessage(e.target.value)}
                            className="min-h-[120px]"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setApplicationMessage('')
                              setApplicationSubmitted(false)
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleApplicationSubmit}
                            disabled={!applicationMessage.trim() || isSubmitting}
                            className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4 mr-2" />
                                Submit Application
                              </>
                            )}
                          </Button>
                        </div>
                        {applicationSubmitted && (
                          <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
                            <CheckCircle className="h-5 w-5" />
                            <span className="text-sm font-medium">Application submitted successfully!</span>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        </div>
      </div>
    </div>
  )
}
