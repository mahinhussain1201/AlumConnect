import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { GooeyNav } from '@/components/ui/gooey-nav'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, GraduationCap, Users, BookOpen, MessageCircle } from 'lucide-react'

export const Header: React.FC = () => {
  const { user } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)


  const navigationItems = [
    { label: 'Alumni Connect', href: '/alumni-connect' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
  ]

  // Show different navigation based on user role and current page
  const getNavigationItems = () => {
    if (!user) {
      return navigationItems
    }
    
    if (user.role === 'alumni') {
      return [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Messages', href: '/messages' },
        { label: 'My Projects', href: '/alumni/projects' },
        { label: 'My Blogs', href: '/alumni/blogs' },
        { label: 'Mentees', href: '/alumni/mentees' },
      ]
    } else if (user.role === 'student') {
      return [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Messages', href: '/messages' },
        { label: 'Alumni Connect', href: '/alumni-connect' },
        { label: 'Blog', href: '/blog' },
      ]
    }
    
    return navigationItems
  }

  const getMobileNavigationItems = () => {
    if (!user) {
      return [
        { name: 'Alumni Connect', href: '/alumni-connect', icon: Users },
        { name: 'Blog', href: '/blog', icon: BookOpen },
        { name: 'About', href: '/about', icon: GraduationCap },
      ]
    }
    
    if (user.role === 'alumni') {
      return [
        { name: 'Dashboard', href: '/dashboard', icon: GraduationCap },
        { name: 'Messages', href: '/messages', icon: MessageCircle },
        { name: 'My Projects', href: '/alumni/projects', icon: Users },
        { name: 'My Blogs', href: '/alumni/blogs', icon: BookOpen },
        { name: 'Mentees', href: '/alumni/mentees', icon: Users },
      ]
    } else if (user.role === 'student') {
      return [
        { name: 'Dashboard', href: '/dashboard', icon: GraduationCap },
        { name: 'Messages', href: '/messages', icon: MessageCircle },
        { name: 'Alumni Connect', href: '/alumni-connect', icon: Users },
        { name: 'Blog', href: '/blog', icon: BookOpen },
      ]
    }
    
    return [
      { name: 'Alumni Connect', href: '/alumni-connect', icon: Users },
      { name: 'Blog', href: '/blog', icon: BookOpen },
      { name: 'About', href: '/about', icon: GraduationCap },
    ]
  }

  return (
     <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/95 backdrop-blur-lg supports-[backdrop-filter]:bg-white/90 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-18 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-sm">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">IIT KGP Launchpad</span>
          </Link>

          {/* Desktop Navigation with GooeyNav */}
           <div className="hidden md:flex">
             <GooeyNav 
               items={getNavigationItems()}
               animationTime={300}
               particleCount={6}
               particleDistances={[40, 15]}
               particleR={50}
               timeVariance={100}
               initialActiveIndex={0}
             />
           </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Button variant="ghost" className="relative h-8 w-8 rounded-full" asChild>
                  <Link to="/profile">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Link>
                </Button>
              </div>
            ) : (
               <div className="flex items-center space-x-3">
                 <Button variant="ghost" className="text-gray-700 hover:bg-gray-100" asChild>
                   <Link to="/login">Login</Link>
                 </Button>
                 <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-sm border-0" asChild>
                   <Link to="/register">Get Started</Link>
                 </Button>
               </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                 <Button variant="ghost" size="icon" className="md:hidden text-gray-700 hover:bg-gray-100">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {getMobileNavigationItems().map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                       className="flex items-center space-x-2 text-lg font-medium text-gray-700 hover:text-gray-900 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                  {!user && (
                    <div className="flex flex-col space-y-2 pt-4 border-t">
                       <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50" asChild>
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                          Login
                        </Link>
                      </Button>
                      <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0" asChild>
                        <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                          Get Started
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
