import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import useAuth from '@/hooks/useAuth';
import { format } from 'date-fns';
import { Send, Clock, CheckCircle } from 'lucide-react';

export default function Messages({ jobId, workerId }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [canMessage, setCanMessage] = useState(false);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isOtherUserTyping]);

  useEffect(() => {
    const checkApplicationStatus = async () => {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('job_id', jobId)
        .eq('worker_id', workerId)
        .single();

      if (data) {
        setCanMessage(true);
      }
    };

    checkApplicationStatus();

    if (jobId && workerId) {
      const channel = supabase
        .channel(`messages:${jobId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `job_id=eq.${jobId}`
        }, (payload) => {
          setMessages(prevMessages => {
            const messageExists = prevMessages.some(msg => msg.id === payload.new.id);
            if (!messageExists) {
              return [...prevMessages, payload.new];
            }
            return prevMessages;
          });
        })
        .on('broadcast', { event: 'typing' }, (payload) => {
          if (payload.payload.sender !== user.id) {
            setIsOtherUserTyping(true);
            if (typingTimeoutRef.current) {
              clearTimeout(typingTimeoutRef.current);
            }
            typingTimeoutRef.current = setTimeout(() => setIsOtherUserTyping(false), 3000);
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [jobId, workerId, user.id]);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('job_id', jobId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages(data);
      }
    };

    if (jobId) {
      fetchMessages();
    }
  }, [jobId]);

  useEffect(() => {
    scrollToBottom();
  }, []);

  useEffect(() => {
    const markMessagesAsRead = async () => {
      if (jobId && user) {
        const { error } = await supabase
          .from('messages')
          .update({ is_read: true })
          .eq('job_id', jobId)
          .neq('sender_id', user.id)
          .eq('is_read', false);

        if (error) {
          console.error('Error marking messages as read:', error);
        }
      }
    };

    markMessagesAsRead();
  }, [jobId, user]);

  const sendTypingIndicator = async () => {
    await supabase.channel(`messages:${jobId}`).send({
      type: 'broadcast',
      event: 'typing',
      payload: { sender: user.id }
    });
  };

  const sendMessage = async () => {
    if (newMessage.trim() === '' || !canMessage) return;

    const { data, error } = await supabase
      .from('messages')
      .insert({
        job_id: jobId,
        sender_id: user.id,
        content: newMessage,
        worker_id: workerId,
        is_read: false
      })
      .select();

    if (error) {
      console.error('Error sending message:', error);
    } else if (data && data.length > 0) {
      setMessages(prevMessages => 
        prevMessages.map(msg => msg.id === data[0].id ? { ...data[0], status: 'sent' } : msg)
      );
      setNewMessage(''); // Clear the input field after sending
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 rounded-lg shadow-lg">
      <div className="bg-white p-4 rounded-t-lg shadow">
        <h2 className="text-2xl font-bold text-gray-800">Messages</h2>
      </div>
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwnMessage={message.sender_id === user.id}
          />
        ))}
        {isOtherUserTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-300 text-gray-700 rounded-lg px-4 py-2">
              <span className="animate-pulse">Typing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {canMessage ? (
        <div className="border-t bg-white p-4 rounded-b-lg">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                sendTypingIndicator();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendMessage();
                }
              }}
              placeholder="Type your message..."
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-100 border-t border-yellow-200 p-4 rounded-b-lg">
          <p className="text-center text-yellow-800">
            You can only message if you have applied for this job.
          </p>
        </div>
      )}
    </div>
  );
}

function MessageBubble({ message, isOwnMessage }) {
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg shadow ${
          isOwnMessage ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
        }`}
      >
        <div className="font-semibold mb-1 flex items-center justify-between">
          <span>{isOwnMessage ? 'You' : message.sender_name || 'Other'}</span>
          {isOwnMessage && (
            <span className="text-xs">
              {message.status === 'sending' ? (
                <Clock className="h-3 w-3 inline-block" />
              ) : (
                <CheckCircle className="h-3 w-3 inline-block" />
              )}
            </span>
          )}
        </div>
        <p className="break-words">{message.content}</p>
        <div className="text-xs mt-1 text-right opacity-75">
          {format(new Date(message.created_at), 'HH:mm')}
        </div>
      </div>
    </div>
  );
}
