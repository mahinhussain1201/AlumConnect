import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { WavesBackground } from '@/components/ui/waves-background'
import { BGPattern } from '@/components/ui/bg-pattern'
import { 
  ArrowLeft, 
  User, 
  GraduationCap, 
  Building, 
  MapPin, 
  Briefcase, 
  Award, 
  Mail, 
  Phone, 
  Calendar,
  Globe,
  Code,
  MessageCircle,
  Star,
  Loader2
} from 'lucide-react'

interface Profile {
  id: string
  name: string
  email: string
  role: 'student' | 'alumni'
  avatar?: string
  bio?: string
  hall?: string
  department?: string
  graduation_year?: number
  current_company?: string
  current_position?: string
  previous_experience?: string[]
  location?: string
  work_preference: 'onsite' | 'remote' | 'hybrid'
  expertise: string[]
  skills: string[]
  achievements?: string[]
  phone?: string
  website?: string
  linkedin?: string
  github?: string
  created_at: string
  updated_at: string
}

export const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [id])

  const fetchProfile = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock profile data
      const mockProfile: Profile = {
        id: id || '1',
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@techcorp.com',
        role: 'alumni',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
        bio: 'Passionate technology leader with 8+ years of experience in AI/ML and software development. Currently leading innovation at TechCorp Solutions and mentoring the next generation of tech talent.',
        hall: 'Nehru Hall',
        department: 'Computer Science and Engineering',
        graduation_year: 2015,
        current_company: 'TechCorp Solutions',
        current_position: 'Senior AI Research Lead',
        previous_experience: [
          'Software Engineer at Google (2015-2018)',
          'Machine Learning Engineer at Microsoft (2018-2021)',
          'AI Research Scientist at TechCorp (2021-Present)'
        ],
        location: 'San Francisco, CA',
        work_preference: 'hybrid',
        expertise: [
          'Machine Learning',
          'Deep Learning',
          'Computer Vision',
          'Natural Language Processing',
          'Python',
          'TensorFlow',
          'PyTorch',
          'Cloud Computing'
        ],
        skills: [
          'Python',
          'JavaScript',
          'React',
          'Node.js',
          'TensorFlow',
          'PyTorch',
          'AWS',
          'Docker',
          'Kubernetes',
          'Git'
        ],
        achievements: [
          'Published 15+ research papers in top-tier conferences',
          'Led development of award-winning AI product',
          'Mentored 50+ students and junior developers',
          'Speaker at major tech conferences (NeurIPS, ICML)'
        ],
        phone: '+1 (555) 123-4567',
        website: 'https://sarahjohnson.dev',
        linkedin: 'https://linkedin.com/in/sarahjohnson',
        github: 'https://github.com/sarahjohnson',
        created_at: '2024-01-01',
        updated_at: '2024-01-15'
      }
      
      setProfile(mockProfile)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen relative">
        <BGPattern 
          variant="grid" 
          size={28} 
          fill="#e5e7eb" 
          mask="fade-edges"
          className="opacity-10 blur-[90%]"
        />
        <WavesBackground 
          className="fixed inset-0 z-0 opacity-30" 
          color="#e5e7eb" 
          waveCount={2}
          speed={15}
        />
        <div className="relative z-10 py-12 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading profile...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen relative">
        <BGPattern 
          variant="grid" 
          size={28} 
          fill="#e5e7eb" 
          mask="fade-edges"
          className="opacity-10 blur-[90%]"
        />
        <WavesBackground 
          className="fixed inset-0 z-0 opacity-30" 
          color="#e5e7eb" 
          waveCount={2}
          speed={15}
        />
        <div className="relative z-10 py-12 flex items-center justify-center">
          <div className="text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Profile not found</h3>
            <p className="text-muted-foreground">
              The profile you're looking for doesn't exist or has been removed.
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
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Back Button */}
          <div className="mb-6">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          
          {/* Profile Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Profile Picture and Basic Info */}
              <div className="lg:w-1/3">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <Avatar className="h-32 w-32 mx-auto mb-6">
                      <AvatarImage src={profile.avatar} alt={profile.name} />
                      <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800">
                        {profile.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                      {profile.name}
                    </h1>
                    
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Badge variant={profile.role === 'alumni' ? 'default' : 'secondary'} className="px-3 py-1">
                        {profile.role === 'alumni' ? 'Alumni' : 'Student'}
                      </Badge>
                      {profile.graduation_year && (
                        <Badge variant="outline" className="px-3 py-1">
                          Class of {profile.graduation_year}
                        </Badge>
                      )}
                    </div>
                    
                    {profile.bio && (
                      <p className="text-gray-600 leading-relaxed mb-6">
                        {profile.bio}
                      </p>
                    )}
                    
                    {/* Contact Actions */}
                    <div className="space-y-3">
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                      <Button variant="outline" className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400">
                        <Star className="h-4 w-4 mr-2" />
                        Follow
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Detailed Information */}
              <div className="lg:w-2/3 space-y-6">
                {/* Education & Current Role */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-blue-600" />
                      Education & Career
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profile.hall && (
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                        <Building className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Hall</p>
                          <p className="text-sm text-gray-600">{profile.hall}</p>
                        </div>
                      </div>
                    )}
                    
                    {profile.department && (
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                        <GraduationCap className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Department</p>
                          <p className="text-sm text-gray-600">{profile.department}</p>
                        </div>
                      </div>
                    )}
                    
                    {profile.current_company && (
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                        <Building className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Current Company</p>
                          <p className="text-sm text-gray-600">{profile.current_company}</p>
                        </div>
                      </div>
                    )}
                    
                    {profile.current_position && (
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                        <Briefcase className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Current Position</p>
                          <p className="text-sm text-gray-600">{profile.current_position}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                      <MapPin className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Work Preference</p>
                        <p className="text-sm text-gray-600 capitalize">{profile.work_preference}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Skills & Expertise */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5 text-blue-600" />
                      Skills & Expertise
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Core Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.expertise.map((skill, index) => (
                          <Badge key={index} variant="default" className="px-3 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Technical Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="px-3 py-1 border-gray-300 text-gray-700 hover:bg-gray-50">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Experience & Achievements */}
                {(profile.previous_experience?.length || profile.achievements?.length) && (
                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-blue-600" />
                        Experience & Achievements
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {profile.previous_experience && profile.previous_experience.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Previous Experience</h4>
                          <ul className="space-y-2">
                            {profile.previous_experience.map((exp, index) => (
                              <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                <span>{exp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {profile.achievements && profile.achievements.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Achievements</h4>
                          <ul className="space-y-2">
                            {profile.achievements.map((achievement, index) => (
                              <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                                <Award className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0"></Award>
                                <span>{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
                
                {/* Contact Information */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-blue-600" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                      <Mail className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email</p>
                        <p className="text-sm text-gray-600">{profile.email}</p>
                      </div>
                    </div>
                    
                    {profile.phone && (
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                        <Phone className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Phone</p>
                          <p className="text-sm text-gray-600">{profile.phone}</p>
                        </div>
                      </div>
                    )}
                    
                    {profile.location && (
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                        <MapPin className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Location</p>
                          <p className="text-sm text-gray-600">{profile.location}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Social Links */}
                    <div className="flex flex-wrap gap-3 pt-2">
                      {profile.website && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={profile.website} target="_blank" rel="noopener noreferrer">
                            <Globe className="h-4 w-4 mr-2" />
                            Website
                          </a>
                        </Button>
                      )}
                      {profile.linkedin && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                            <Globe className="h-4 w-4 mr-2" />
                            LinkedIn
                          </a>
                        </Button>
                      )}
                      {profile.github && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={profile.github} target="_blank" rel="noopener noreferrer">
                            <Code className="h-4 w-4 mr-2" />
                            GitHub
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
