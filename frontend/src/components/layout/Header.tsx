import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { GooeyNav } from '@/components/ui/gooey-nav'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, GraduationCap, Users, BookOpen, User } from 'lucide-react'

export const Header: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navigationItems = [
    { label: 'Alumni Connect', href: '/alumni-connect' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
  ]

  const mobileNavigationItems = [
    { name: 'Alumni Connect', href: '/alumni-connect', icon: Users },
    { name: 'Blog', href: '/blog', icon: BookOpen },
    { name: 'About', href: '/about', icon: GraduationCap },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-blue-200/40 bg-gradient-to-r from-blue-50/95 via-white/98 to-blue-50/95 backdrop-blur-lg supports-[backdrop-filter]:bg-gradient-to-r supports-[backdrop-filter]:from-blue-50/80 supports-[backdrop-filter]:via-white/90 supports-[backdrop-filter]:to-blue-50/80 shadow-lg shadow-blue-200/20">
      <div className="container mx-auto px-4">
        <div className="flex h-18 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">IIT KGP Launchpad</span>
          </Link>

          {/* Desktop Navigation with GooeyNav */}
          <div className="hidden md:flex">
            <GooeyNav 
              items={navigationItems}
              animationTime={600}
              particleCount={12}
              particleDistances={[80, 15]}
              particleR={90}
              timeVariance={200}
              initialActiveIndex={0}
            />
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 shadow-sm"
                  onClick={() => navigate(user.role === 'student' ? '/student-dashboard' : '/alumni-dashboard')}
                >
                  Dashboard
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile/1')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(user.role === 'student' ? '/student-dashboard' : '/alumni-dashboard')}>
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" className="text-blue-700 hover:bg-blue-100" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-200/30 border-0" asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-blue-700 hover:bg-blue-100">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {mobileNavigationItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="flex items-center space-x-2 text-lg font-medium text-blue-700 hover:text-blue-900 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                  {!user && (
                    <div className="flex flex-col space-y-2 pt-4 border-t">
                      <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50" asChild>
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                          Login
                        </Link>
                      </Button>
                      <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0" asChild>
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
