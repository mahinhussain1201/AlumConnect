import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Linkedin, 
  Github, 
  Users, 
  Sparkles,
  Code,
  Palette,
  Database,
  Zap,
  Figma,
  Dribbble
} from 'lucide-react';

const Team = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Amit Kumar",
      designation: "Lead Developer",
      email: "amit.kumar@example.com",
      linkedin: "https://linkedin.com/in/amitkumar",
      github: "https://github.com/amitkumar",
      department: "Computer Science",
      role: "Backend"
    },
    {
      id: 2,
      name: "Priya Sharma",
      designation: "UI/UX Designer",
      email: "priya.sharma@example.com",
      figma: "https://figma.com/@priyasharma",
      behance: "https://behance.net/priyasharma",
      department: "Design",
      role: "Designer"
    },
    {
      id: 3,
      name: "Rahul Verma",
      designation: "Full Stack Developer",
      email: "rahul.verma@example.com",
      linkedin: "https://linkedin.com/in/rahulverma",
      github: "https://github.com/rahulverma",
      department: "Computer Science",
      role: "Full Stack"
    },
    {
      id: 4,
      name: "Sneha Patel",
      designation: "Data Scientist",
      email: "sneha.patel@example.com",
      linkedin: "https://linkedin.com/in/snehapatel",
      github: "https://github.com/snehapatel",
      department: "Data Science",
      role: "ML/AI"
    },
    {
      id: 5,
      name: "Vikram Singh",
      designation: "DevOps Engineer",
      email: "vikram.singh@example.com",
      linkedin: "https://linkedin.com/in/vikramsingh",
      github: "https://github.com/vikramsingh",
      department: "Computer Science",
      role: "Backend"
    },
    {
      id: 6,
      name: "Anjali Desai",
      designation: "Frontend Developer",
      email: "anjali.desai@example.com",
      linkedin: "https://linkedin.com/in/anjalidesai",
      github: "https://github.com/anjalidesai",
      department: "Computer Science",
      role: "Frontend"
    }
  ];

  const getRoleIcon = (role) => {
    const roleLower = role?.toLowerCase() || '';
    if (roleLower === 'backend') return Database;
    if (roleLower === 'frontend') return Palette;
    if (roleLower === 'designer') return Palette;
    if (roleLower === 'full stack') return Code;
    if (roleLower.includes('ml') || roleLower.includes('ai')) return Zap;
    return Sparkles;
  };

  const getRoleColor = (role) => {
    const roleLower = role?.toLowerCase() || '';
    if (roleLower === 'backend') return 'from-green-50 to-green-100 border-green-200';
    if (roleLower === 'frontend') return 'from-purple-50 to-purple-100 border-purple-200';
    if (roleLower === 'designer') return 'from-pink-50 to-pink-100 border-pink-200';
    if (roleLower === 'full stack') return 'from-blue-50 to-blue-100 border-blue-200';
    if (roleLower.includes('ml') || roleLower.includes('ai')) return 'from-orange-50 to-orange-100 border-orange-200';
    return 'from-gray-50 to-gray-100 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-24 overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-purple-200 to-purple-300 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-r from-green-100 to-green-200 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute top-32 right-1/3 w-10 h-10 bg-gradient-to-r from-pink-100 to-pink-200 rounded-full opacity-30 animate-bounce"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 text-sm font-medium text-gray-700 mb-6 border border-blue-200 shadow-lg">
            <Users className="h-4 w-4 mr-2" />
            Meet Our Team
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
            The Minds Behind{' '}
            <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">Innovation</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Passionate individuals working together to build something extraordinary
          </p>
        </div>
      </section>

      {/* Team Grid Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => {
              const RoleIcon = getRoleIcon(member.role);
              const roleColor = getRoleColor(member.role);
              
              return (
                <Card 
                  key={member.id} 
                  className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 overflow-hidden"
                >
                  <CardHeader className="text-center pb-4 relative">
                    {/* Decorative background */}
                    <div className={`absolute top-0 left-0 right-0 h-24 bg-gradient-to-br ${roleColor} transition-all duration-300 group-hover:h-28`}></div>
                    
                    {/* Role Badge */}
                    {member.role && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm shadow-md">
                          <RoleIcon className="h-3 w-3 mr-1" />
                          {member.role}
                        </Badge>
                      </div>
                    )}
                    
                    {/* Avatar */}
                    <div className="relative z-10 flex justify-center mb-4 mt-8">
                      <div className="relative group-hover:scale-110 transition-transform duration-300">
                        <Avatar className="h-28 w-28 border-4 border-white shadow-xl">
                          {member.image && <AvatarImage src={member.image} alt={member.name} />}
                          <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {/* Pulse Ring */}
                        <div className="absolute inset-0 rounded-full bg-blue-400 opacity-0 group-hover:opacity-20 group-hover:scale-125 transition-all duration-500"></div>
                      </div>
                    </div>
                    
                    {/* Name & Designation */}
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-sm font-medium text-blue-600">
                        {member.designation}
                      </p>
                      {member.department && (
                        <p className="text-xs text-gray-500">
                          {member.department}
                        </p>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Email */}
                    <div className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      <div className="p-2 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors">
                        <Mail className="h-4 w-4" />
                      </div>
                      <a 
                        href={`mailto:${member.email}`}
                        className="truncate flex-1 hover:underline"
                      >
                        {member.email}
                      </a>
                    </div>
                    
                    {/* Social Links */}
                    <div className="flex gap-2">
                      {member.figma && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300"
                          asChild
                        >
                          <a 
                            href={member.figma}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Figma className="h-4 w-4 hover:text-purple-600" />
                          </a>
                        </Button>
                      )}
                      
                      {member.behance && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
                          asChild
                        >
                          <a 
                            href={member.behance}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Dribbble className="h-4 w-4 hover:text-blue-600" />
                          </a>
                        </Button>
                      )}
                      
                      {member.linkedin && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
                          asChild
                        >
                          <a 
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Linkedin className="h-4 w-4 hover:text-blue-600" />
                          </a>
                        </Button>
                      )}
                      
                      {member.github && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 hover:bg-gray-900 hover:border-gray-900 hover:text-white transition-all duration-300"
                          asChild
                        >
                          <a 
                            href={member.github}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                  
                  {/* Hover Effect Line */}
                  <div className="h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Team;