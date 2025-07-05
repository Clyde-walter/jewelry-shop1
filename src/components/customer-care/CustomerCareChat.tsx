
import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChat } from '@/contexts/ChatContext';

interface CustomerCareChatProps {
  onSubmitSuccess?: () => void;
}

export function CustomerCareChat({ onSubmitSuccess }: CustomerCareChatProps) {
  const { messages, addMessage, markAllAsRead, refreshMessages } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    markAllAsRead();
  }, [messages, markAllAsRead]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    addMessage(newMessage, 'user');
    setNewMessage('');
    
    if (onSubmitSuccess) {
      setTimeout(() => {
        onSubmitSuccess();
      }, 1500);
    }
  };

  const handleRefreshMessages = async () => {
    setIsRefreshing(true);
    refreshMessages();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const isAdminResponse = (message: any) => {
    return message.sender === 'support' && 
           !message.message.includes('Thank you for your message! Our support team will get back to you shortly.');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-medium">Customer Support</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefreshMessages}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start a conversation</h3>
            <p className="text-gray-500">Send a message to get help from our support team.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex flex-col max-w-xs lg:max-w-md">
                <div
                  className={`px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : isAdminResponse(message)
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <p className={`text-xs ${
                    message.sender === 'user' ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {message.sender === 'user' ? 'You' : isAdminResponse(message) ? 'Support Team' : 'Auto Reply'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" disabled={!newMessage.trim()} className="bg-blue-600 hover:bg-blue-700">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
