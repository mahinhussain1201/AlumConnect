import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { formatDate } from '@/lib/dataUtils'
import { MessageCircle, Search, Plus, Users, UserPlus, Loader2, Send, Clock, MapPin, Building, GraduationCap, Star, ExternalLink, ArrowLeft } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'

interface Conversation {
  id: number
  other_user_id: number
  other_user_name: string
  other_user_email: string
  other_user_role: string
  last_message?: string
  last_message_time?: string
  unread_count: number
  is_online?: boolean
}

interface User {
  id: number
  name: string
  email: string
  role: string
  department?: string
  graduation_year?: number
  current_company?: string
  current_position?: string
  location?: string
  bio?: string
  linkedin?: string
  github?: string
  website?: string
  hall?: string
  branch?: string
}

interface Message {
  id: number
  sender_id: number
  receiver_id: number
  content: string
  created_at: string
  is_read: boolean
}

export const MessagesPage: React.FC = () => {
  const { token, user, isLoading } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [availableUsers, setAvailableUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [showNewChat, setShowNewChat] = useState(false)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [messagesLoading, setMessagesLoading] = useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (token) {
      fetchData()
    }
  }, [token])

  // Handle URL parameter for conversation ID (but keep it inline)
  useEffect(() => {
    if (id && conversations.length > 0) {
      const conversation = conversations.find(c => c.id === parseInt(id))
      if (conversation) {
        selectConversation(conversation)
      }
    }
  }, [id, conversations])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchData = async () => {
    try {
      // Fetch conversations and available users in parallel
      const [conversationsRes, usersRes] = await Promise.all([
        fetch('http://localhost:5001/api/messages/conversations', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://localhost:5001/api/messages/available-users', {
          headers: { Authorization: `Bearer ${token}` },
        })
      ])

      if (conversationsRes.ok) {
        const conversationsData = await conversationsRes.json()
        setConversations(conversationsData)
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setAvailableUsers(usersData)
      }
    } catch (error) {
      console.error('Error fetching messages data:', error)
    } finally {
      setLoading(false)
    }
  }

  const startNewConversation = async (otherUserId: number) => {
    try {
      const response = await fetch('http://localhost:5001/api/messages/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ other_user_id: otherUserId })
      })

      if (response.ok) {
        const newConversation = await response.json()
        // Find the conversation in our list or create a new one
        const conversation = conversations.find(c => c.other_user_id === otherUserId) || {
          id: newConversation.id,
          other_user_id: otherUserId,
          other_user_name: availableUsers.find(u => u.id === otherUserId)?.name || 'Unknown',
          other_user_email: availableUsers.find(u => u.id === otherUserId)?.email || '',
          other_user_role: availableUsers.find(u => u.id === otherUserId)?.role || 'alumni',
          last_message: '',
          last_message_time: '',
          unread_count: 0,
          is_online: false
        }
        setSelectedConversation(conversation)
        setShowNewChat(false)
        // Update URL without navigation
        window.history.pushState({}, '', `/messages/${newConversation.id}`)
      }
    } catch (error) {
      console.error('Error starting conversation:', error)
    }
  }

  const selectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation)
    setMessagesLoading(true)
    try {
      const response = await fetch(`http://localhost:5001/api/messages/conversations/${conversation.id}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const messagesData = await response.json()
        setMessages(messagesData)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setMessagesLoading(false)
    }
    // Update URL without navigation
    window.history.pushState({}, '', `/messages/${conversation.id}`)
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    setSending(true)
    try {
      const response = await fetch(`http://localhost:5001/api/messages/conversations/${selectedConversation.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newMessage.trim() })
      })

      if (response.ok) {
        const newMsg = await response.json()
        setMessages(prev => [...prev, newMsg])
        setNewMessage('')
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const filteredUsers = availableUsers.filter(u => 
    u.id !== user?.id && 
    (u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     u.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     u.current_company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     u.current_position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     u.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     u.hall?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     u.branch?.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
          <span className="text-lg text-gray-600">Loading messages...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center">
        <p className="text-muted-foreground">Please log in to access messages.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {/* Left Sidebar - Conversations List */}
        <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-gray-900">Messages</h1>
              <Button 
                onClick={() => setShowNewChat(!showNewChat)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {showNewChat && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search alumni..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : showNewChat ? (
              <div className="p-2">
                {filteredUsers.map((alumni) => (
                  <div
                    key={alumni.id}
                    className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-gray-100 mb-2"
                    onClick={() => startNewConversation(alumni.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-semibold">
                          {alumni.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{alumni.name}</p>
                        <p className="text-sm text-gray-500 truncate">
                          {alumni.current_position && alumni.current_company 
                            ? `${alumni.current_position} at ${alumni.current_company}`
                            : alumni.department || 'Alumni'
                          }
                        </p>
                      </div>
                      <Badge variant="default" className="text-xs">Alumni</Badge>
                    </div>
                  </div>
                ))}
                {filteredUsers.length === 0 && searchTerm && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No alumni found</p>
                  </div>
                )}
              </div>
            ) : conversations.length > 0 ? (
              <div className="p-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-lg cursor-pointer mb-2 transition-colors ${
                      selectedConversation?.id === conversation.id 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                    onClick={() => selectConversation(conversation)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-semibold">
                            {conversation.other_user_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.is_online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900 truncate">{conversation.other_user_name}</p>
                          {conversation.unread_count > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {conversation.unread_count}
                            </Badge>
                          )}
                        </div>
                        {conversation.last_message && (
                          <p className="text-sm text-gray-500 truncate">
                            {conversation.last_message}
                          </p>
                        )}
                        {conversation.last_message_time && (
                          <p className="text-xs text-gray-400">
                            {formatDate(conversation.last_message_time)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  {user.role === 'student' 
                    ? 'Start a conversation with an alumni mentor'
                    : 'Students can reach out to you for mentorship'
                  }
                </p>
                <Button 
                  onClick={() => setShowNewChat(true)}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Start New Chat
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Chat Interface */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-semibold">
                        {selectedConversation.other_user_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedConversation.other_user_name}</h3>
                      <p className="text-sm text-gray-500">
                        {selectedConversation.other_user_role === 'alumni' ? 'Alumni Mentor' : 'Student'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedConversation(null)
                      setMessages([])
                      window.history.pushState({}, '', '/messages')
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isOwnMessage = message.sender_id === user?.id
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                              isOwnMessage
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-gray-900 border border-gray-200'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {new Date(message.created_at).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
                      <p className="text-gray-600">
                        Start the conversation by sending a message below.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-3">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={sending}
                    className="flex-1"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sending}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Welcome to Messages</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-8">
                  {user.role === 'student' 
                    ? 'Select a conversation or start a new chat with an alumni mentor to get guidance and support.'
                    : 'Select a conversation or start a new chat with a student to provide mentorship.'
                  }
                </p>
                <Button 
                  onClick={() => setShowNewChat(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Start New Chat
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
