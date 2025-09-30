import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, User, Check, X, Mail } from 'lucide-react'

interface RequestItem {
  id: number
  message: string
  status: string
  created_at: string
  other_user_name: string
  other_user_email: string
}

export const AlumniMenteesPage: React.FC = () => {
  const { token, user, isLoading } = useAuth()
  const [items, setItems] = useState<RequestItem[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<number | null>(null)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/mentorship/requests', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setItems(data)
        }
      } finally {
        setLoading(false)
      }
    }
    if (token) load()
  }, [token])

  const handleMentorshipRequest = async (requestId: number, action: 'accept' | 'decline') => {
    if (!token) return
    
    setProcessing(requestId)
    try {
      const res = await fetch(`http://localhost:5001/api/mentorship/${requestId}/${action}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      
      if (res.ok) {
        // Update the request status in the local state
        setItems(prev => prev.map(item => 
          item.id === requestId ? { ...item, status: action === 'accept' ? 'accepted' : 'declined' } : item
        ))
      }
    } finally {
      setProcessing(null)
    }
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
        <p className="text-muted-foreground">Only alumni can view mentee requests.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Mentee Requests</h1>
          <p className="text-muted-foreground">Requests you have received from students</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No requests yet</CardTitle>
              <CardDescription>Students will contact you here for mentorship.</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-4">
            {items.map((r) => (
              <Card key={r.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{r.other_user_name}</p>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">{r.other_user_email}</p>
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant={r.status === 'accepted' ? 'default' : r.status === 'declined' ? 'secondary' : 'outline'} 
                      className="capitalize"
                    >
                      {r.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {r.message && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm">{r.message}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Requested on {new Date(r.created_at).toLocaleDateString()}
                      </span>
                      
                      {r.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleMentorshipRequest(r.id, 'decline')}
                            disabled={processing === r.id}
                          >
                            {processing === r.id ? (
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
                            onClick={() => handleMentorshipRequest(r.id, 'accept')}
                            disabled={processing === r.id}
                          >
                            {processing === r.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <>
                                <Check className="mr-1 h-3 w-3" />
                                Accept
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


