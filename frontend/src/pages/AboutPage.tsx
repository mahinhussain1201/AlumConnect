import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { WavesBackground } from '@/components/ui/waves-background'
import { BGPattern } from '@/components/ui/bg-pattern'
import { 
  Target, 
  Users, 
  Lightbulb, 
  Globe, 
  Award, 
  BookOpen,
  Briefcase,
  Heart,
  Zap,
  Shield
} from 'lucide-react'

export const AboutPage: React.FC = () => {
  const values = [
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Fostering creative thinking and breakthrough solutions that address real-world challenges."
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Building bridges between students and alumni to create meaningful connections and mentorship opportunities."
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "Empowering our community to make a positive difference on a global scale through technology and innovation."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Maintaining the highest standards of quality and achievement in all our endeavors."
    }
  ]

  const features = [
    {
      icon: Briefcase,
      title: "Project Showcase",
      description: "Discover and explore innovative projects from our talented students and alumni community."
    },
    {
      icon: Users,
      title: "Alumni Connect",
      description: "Connect with successful alumni for mentorship, internships, and career guidance."
    },
    {
      icon: BookOpen,
      title: "Knowledge Sharing",
      description: "Access insights, experiences, and expertise through our comprehensive blog platform."
    },
    {
      icon: Heart,
      title: "Community Building",
      description: "Join a vibrant community of innovators, entrepreneurs, and changemakers."
    }
  ]

  const stats = [
    { label: "Years of Excellence", value: "75+", icon: Award },
    { label: "Alumni Worldwide", value: "50,000+", icon: Globe },
    { label: "Active Projects", value: "150+", icon: Lightbulb },
    { label: "Success Stories", value: "200+", icon: Zap }
  ]

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
      
      {/* Hero Section */}
      <section className="relative z-10 py-20 bg-gradient-to-br from-pink-50/80 via-background/80 to-blue-50/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About IIT KGP Launchpad
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Empowering the next generation of innovators and connecting them with the wisdom and experience of our accomplished alumni community.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="hover:shadow-lg transition-shadow backdrop-blur-sm bg-background/80">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Our Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  To create a dynamic platform that showcases the innovative spirit of IIT Kharagpur, 
                  facilitates meaningful connections between students and alumni, and provides a space 
                  for knowledge sharing and mentorship. We aim to build a thriving ecosystem where 
                  ideas flourish, connections are forged, and the next generation of leaders emerges.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow backdrop-blur-sm bg-background/80">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Our Vision</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  To become the premier platform for innovation and collaboration within the IIT Kharagpur 
                  community, recognized globally for fostering breakthrough technologies, successful startups, 
                  and meaningful mentorship relationships. We envision a world where every student has access 
                  to the guidance and resources they need to turn their ideas into reality.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 py-16 bg-muted/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do and shape our community culture.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm bg-background/80">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <value.icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="relative z-10 py-20 bg-muted/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Platform Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the powerful tools and features that make IIT KGP Launchpad the ultimate platform for innovation and collaboration.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm bg-background/80">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join Our Community
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Whether you're a current student with innovative ideas or an accomplished alumni looking to give back, 
              there's a place for you in our community. Together, we can build the future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Badge variant="outline" className="px-4 py-2 text-sm">
                <Shield className="h-4 w-4 mr-2" />
                Secure & Trusted Platform
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm">
                <Users className="h-4 w-4 mr-2" />
                Global Alumni Network
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm">
                <Lightbulb className="h-4 w-4 mr-2" />
                Innovation Focused
              </Badge>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
