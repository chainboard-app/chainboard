import React, { useState, useEffect } from 'react'
import { Avatar } from '../../components/Avatar'

interface User {
  id: string
  username: string
  displayName: string
  avatarUrl?: string
}

interface Message {
  id: string
  senderId: string
  recipientId: string
  encryptedContent: string
  read: boolean
  createdAt: string
  sender: User
  recipient: User
}

interface Conversation {
  user: User
  lastMessage: Message
  unreadCount: number
}

export function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [currentUserId] = useState('current-user-id') // Replace with actual user ID

  // Mock data for now
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: 'user1',
        username: 'alice',
        displayName: 'Alice',
        avatarUrl: 'https://i.pravatar.cc/150?u=alice',
      },
      {
        id: 'user2',
        username: 'bob',
        displayName: 'Bob',
        avatarUrl: 'https://i.pravatar.cc/150?u=bob',
      },
    ]

    const mockConversations: Conversation[] = [
      {
        user: mockUsers[0],
        lastMessage: {
          id: 'msg1',
          senderId: mockUsers[0].id,
          recipientId: currentUserId,
          encryptedContent: 'Hello! How are you?',
          read: false,
          createdAt: new Date().toISOString(),
          sender: mockUsers[0],
          recipient: { id: currentUserId, username: 'me', displayName: 'Me' } as User,
        },
        unreadCount: 2,
      },
      {
        user: mockUsers[1],
        lastMessage: {
          id: 'msg2',
          senderId: currentUserId,
          recipientId: mockUsers[1].id,
          encryptedContent: 'Thanks for the help!',
          read: true,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          sender: { id: currentUserId, username: 'me', displayName: 'Me' } as User,
          recipient: mockUsers[1],
        },
        unreadCount: 0,
      },
    ]

    setConversations(mockConversations)
  }, [currentUserId])

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    // Mock messages
    const mockMessages: Message[] = [
      {
        id: 'msg1',
        senderId: conversation.user.id,
        recipientId: currentUserId,
        encryptedContent: 'Hello! How are you?',
        read: false,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        sender: conversation.user,
        recipient: { id: currentUserId, username: 'me', displayName: 'Me' } as User,
      },
      {
        id: 'msg2',
        senderId: currentUserId,
        recipientId: conversation.user.id,
        encryptedContent: "I'm good, thanks! How about you?",
        read: true,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        sender: { id: currentUserId, username: 'me', displayName: 'Me' } as User,
        recipient: conversation.user,
      },
    ]
    setMessages(mockMessages)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return
    // Handle sending message
    setNewMessage('')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Conversation Sidebar */}
      <div className="w-80 border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Messages</h1>
        </div>
        <div className="overflow-y-auto">
          {conversations.map((conv) => (
            <div
              key={conv.user.id}
              onClick={() => handleSelectConversation(conv)}
              className={`p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
                selectedConversation?.user.id === conv.user.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <Avatar
                  username={conv.user.username}
                  avatarUrl={conv.user.avatarUrl}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {conv.user.displayName}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm text-gray-600 truncate">
                      {conv.lastMessage.encryptedContent}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Thread */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-white flex items-center gap-3">
              <Avatar
                username={selectedConversation.user.username}
                avatarUrl={selectedConversation.user.avatarUrl}
                size="md"
              />
              <div>
                <h2 className="font-semibold text-gray-900">
                  {selectedConversation.user.displayName}
                </h2>
                <p className="text-sm text-gray-500">@{selectedConversation.user.username}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    msg.senderId === currentUserId ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.senderId !== currentUserId && (
                    <Avatar
                      username={msg.sender.username}
                      avatarUrl={msg.sender.avatarUrl}
                      size="sm"
                    />
                  )}
                  <div
                    className={`max-w-[60%] rounded-lg px-4 py-2 ${
                      msg.senderId === currentUserId
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    <p>{msg.encryptedContent}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.senderId === currentUserId ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {msg.senderId === currentUserId && (
                    <Avatar
                      username={msg.sender.username}
                      avatarUrl={msg.sender.avatarUrl}
                      size="sm"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  )
}
