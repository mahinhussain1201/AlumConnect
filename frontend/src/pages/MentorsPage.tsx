import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Avatar, AvatarFallback } from '../components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Textarea } from '../components/ui/textarea'
import { WavesBackground } from '../components/ui/waves-background'
import { BGPattern } from '../components/ui/bg-pattern'
import { Search, MapPin, Briefcase, GraduationCap, Building2, Loader2, Send, CheckCircle, Linkedin, Github, Home } from 'lucide-react'
import { ProfileModal } from '../components/ProfileModal'
import { getApiUrl } from '../config'

interface Mentor {
  id: number
  name: string
  email: string
  graduation_year: number
  department: string
  hall: string
  branch: string
  bio: string
  current_company: string
  current_position: string
  location: string
  work_preference: string
  linkedin: string
  github: string
  years_of_experience: number
  domain: string
  tech_skills: string[]
}

export const MentorsPage: React.FC = () => {
  const { user, token } = useAuth()
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedHall, setSelectedHall] = useState('all')
  const [selectedDomain, setSelectedDomain] = useState('all')
  const [selectedExperience, setSelectedExperience] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)
  const [mentorshipMessage, setMentorshipMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [requestSubmitted, setRequestSubmitted] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [profileModalUserId, setProfileModalUserId] = useState<number | null>(null)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  useEffect(() => {
    fetchMentors()
  }, [])

  useEffect(() => {
    filterMentors()
  }, [mentors, searchTerm, selectedHall, selectedDomain, selectedExperience, selectedLocation])

  const fetchMentors = async () => {
    try {
      const response = await fetch(getApiUrl('/api/alumni'))
      if (response.ok) {
        const data = await response.json()
        setMentors(data)
      }
    } catch (error) {
      console.error('Error fetching mentors:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterMentors = () => {
    let filtered = mentors

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(mentor => {
        const searchLower = searchTerm.toLowerCase().trim()
        
        const nameMatch = mentor.name?.toLowerCase().includes(searchLower) || false
        const companyMatch = mentor.current_company?.toLowerCase().includes(searchLower) || false
        const positionMatch = mentor.current_position?.toLowerCase().includes(searchLower) || false
        const domainMatch = mentor.domain?.toLowerCase().includes(searchLower) || false
        const locationMatch = mentor.location?.toLowerCase().includes(searchLower) || false
        const skillMatch = Array.isArray(mentor.tech_skills) && mentor.tech_skills.length > 0
          ? mentor.tech_skills.some(skill => skill && String(skill).toLowerCase().includes(searchLower))
          : false
        
        return nameMatch || companyMatch || positionMatch || domainMatch || locationMatch || skillMatch
      })
    }

    // Filter by hall
    if (selectedHall !== 'all') {
      filtered = filtered.filter(mentor => mentor.hall === selectedHall)
    }

    // Filter by domain
    if (selectedDomain !== 'all') {
      filtered = filtered.filter(mentor => mentor.domain === selectedDomain)
    }

    // Filter by experience
    if (selectedExperience !== 'all') {
      filtered = filtered.filter(mentor => {
        const exp = mentor.years_of_experience || 0
        switch (selectedExperience) {
          case '0-2': return exp >= 0 && exp <= 2
          case '3-5': return exp >= 3 && exp <= 5
          case '6-10': return exp >= 6 && exp <= 10
          case '10+': return exp > 10
          default: return true
        }
      })
    }

    // Filter by location
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(mentor => 
        mentor.location?.toLowerCase().includes(selectedLocation.toLowerCase())
      )
    }

    setFilteredMentors(filtered)
  }

  const getUniqueDomains = () => {
    const domains = mentors.map(mentor => mentor.domain).filter(Boolean)
    return Array.from(new Set(domains))
  }

  const getUniqueLocations = () => {
    const locations = mentors.map(mentor => mentor.location).filter(Boolean)
    return Array.from(new Set(locations))
  }

  const getUniqueHalls = () => {
    const halls = mentors.map(mentor => mentor.hall).filter(Boolean)
    return Array.from(new Set(halls))
  }

  const handleRequestMentorship = async () => {
    if (!user || !selectedMentor) return
    
    setIsSubmitting(true)
    try {
      const response = await fetch(getApiUrl('/api/mentorship/request'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          alumni_id: selectedMentor.id,
          message: mentorshipMessage
        })
      })

      if (response.ok) {
        setRequestSubmitted(true)
        setMentorshipMessage('')
        setTimeout(() => {
          setIsDialogOpen(false)
          setRequestSubmitted(false)
        }, 2000)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to send mentorship request')
      }
    } catch (error) {
      console.error('Error sending mentorship request:', error)
      alert('Failed to send mentorship request')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading mentors...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 relative">
      {/* Background Pattern */}
      <BGPattern 
        variant="grid" 
        size={30} 
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
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Find Your Mentor
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect with experienced alumni mentors from IIT Kharagpur
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, company, position, domain, location, or skills..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Hall Filter */}
            <Select value={selectedHall} onValueChange={setSelectedHall}>
              <SelectTrigger>
                <Home className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by Hall" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Halls</SelectItem>
                {getUniqueHalls().map((hall) => (
                  <SelectItem key={hall} value={hall}>
                    {hall}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Domain Filter */}
            <Select value={selectedDomain} onValueChange={setSelectedDomain}>
              <SelectTrigger>
                <Briefcase className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by Domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Domains</SelectItem>
                {getUniqueDomains().map((domain) => (
                  <SelectItem key={domain} value={domain}>
                    {domain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Experience Filter */}
            <Select value={selectedExperience} onValueChange={setSelectedExperience}>
              <SelectTrigger>
                <GraduationCap className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by Experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Experience Levels</SelectItem>
                <SelectItem value="0-2">0-2 years</SelectItem>
                <SelectItem value="3-5">3-5 years</SelectItem>
                <SelectItem value="6-10">6-10 years</SelectItem>
                <SelectItem value="10+">10+ years</SelectItem>
              </SelectContent>
            </Select>

            {/* Location Filter */}
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <MapPin className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {getUniqueLocations().map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredMentors.length} of {mentors.length} mentors
          </p>
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <Card key={mentor.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="flex items-center space-x-3 cursor-pointer"
                    onClick={() => {
                      setProfileModalUserId(mentor.id)
                      setIsProfileModalOpen(true)
                    }}
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-lg font-bold">
                        {mentor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{mentor.name}</CardTitle>
                      {mentor.current_position && (
                        <p className="text-sm text-muted-foreground">{mentor.current_position}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Company & Location */}
                <div className="space-y-2">
                  {mentor.current_company && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Building2 className="h-4 w-4 mr-2 text-blue-600" />
                      <span>{mentor.current_company}</span>
                    </div>
                  )}
                  {mentor.location && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-purple-600" />
                      <span>{mentor.location}</span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Info Badges */}
                  <div className="flex flex-wrap gap-2">
                    {mentor.graduation_year && (
                      <Badge variant="outline" className="text-xs">
                        Class of {mentor.graduation_year}
                      </Badge>
                    )}
                    {mentor.hall && (
                      <Badge variant="outline" className="text-xs">
                        {mentor.hall}
                      </Badge>
                    )}
                    {mentor.years_of_experience !== null && mentor.years_of_experience !== undefined && (
                      <Badge variant="secondary" className="text-xs">
                        {mentor.years_of_experience} yrs exp
                      </Badge>
                    )}
                  </div>

                  {/* Domain */}
                  {mentor.domain && (
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1">Domain</p>
                      <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                        {mentor.domain}
                      </Badge>
                    </div>
                  )}

                  {/* Tech Skills */}
                  {mentor.tech_skills && mentor.tech_skills.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1">Tech Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {mentor.tech_skills.slice(0, 4).map((skill: string) => (
                          <Badge key={skill} variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
                            {skill}
                          </Badge>
                        ))}
                        {mentor.tech_skills.length > 4 && (
                          <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
                            +{mentor.tech_skills.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Bio */}
                  {mentor.bio && (
                    <CardDescription className="line-clamp-2 text-xs">
                      {mentor.bio}
                    </CardDescription>
                  )}

                  {/* Social Links */}
                  <div className="flex items-center space-x-2">
                    {mentor.linkedin && (
                      <a 
                        href={mentor.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {mentor.github && (
                      <a 
                        href={mentor.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-gray-900"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                  </div>

                  {/* Action Button */}
                  {user && user.role === 'student' && (
                    <Dialog open={isDialogOpen && selectedMentor?.id === mentor.id} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm"
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                          onClick={() => setSelectedMentor(mentor)}
                        >
                          Request Mentorship
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Request Mentorship from {mentor.name}</DialogTitle>
                          <DialogDescription>
                            Introduce yourself and explain what you're looking for in a mentor.
                          </DialogDescription>
                        </DialogHeader>
                        {requestSubmitted ? (
                          <div className="text-center py-6">
                            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Sent!</h3>
                            <p className="text-sm text-gray-600">
                              Your mentorship request has been sent successfully.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <Textarea
                              placeholder="Tell them about yourself and what you hope to learn..."
                              value={mentorshipMessage}
                              onChange={(e) => setMentorshipMessage(e.target.value)}
                              rows={4}
                            />
                            <div className="flex gap-3">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setIsDialogOpen(false)
                                  setMentorshipMessage('')
                                }}
                                className="flex-1"
                                disabled={isSubmitting}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={handleRequestMentorship} 
                                disabled={isSubmitting || !mentorshipMessage.trim()}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                              >
                                {isSubmitting ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                  </>
                                ) : (
                                  <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Send Request
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMentors.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No mentors found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {profileModalUserId && (
        <ProfileModal
          userId={profileModalUserId}
          isOpen={isProfileModalOpen}
          onClose={() => {
            setIsProfileModalOpen(false)
            setProfileModalUserId(null)
          }}
        />
      )}
    </div>
  )
}
