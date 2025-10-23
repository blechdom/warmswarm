'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import TelebrainLayout from '@/components/TelebrainLayout';
import { io, Socket } from 'socket.io-client';

interface Message {
  sender: string;
  text: string;
  time: string;
  type?: 'text' | 'audio' | 'image';
}

interface Performer {
  nickname: string;
  role?: string;
  connected: boolean;
}

function TelebrainPerformContent() {
  const searchParams = useSearchParams();
  const swarmId = searchParams.get('swarmId');
  const [nickname, setNickname] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [activityLog, setActivityLog] = useState<Message[]>([]);
  const [performers, setPerformers] = useState<Performer[]>([]);
  const [textMessage, setTextMessage] = useState('');
  const [ttsMessage, setTtsMessage] = useState('');
  const [ttsLanguage, setTtsLanguage] = useState('en');
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const storedNickname = localStorage.getItem('nickname');
    if (storedNickname) {
      setNickname(storedNickname);
    }

    // Connect to Socket.IO
    if (swarmId) {
      socketRef.current = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4444');
      
      socketRef.current.on('connect', () => {
        console.log('Connected to server');
        socketRef.current?.emit('join-swarm', { swarmId, nickname: storedNickname });
      });

      socketRef.current.on('user-joined', (data) => {
        setActivityLog(prev => [...prev, {
          sender: 'System',
          text: `${data.nickname} joined the swarm`,
          time: new Date().toLocaleTimeString(),
        }]);
      });

      socketRef.current.on('text-message', (data) => {
        setMessages(prev => [...prev, {
          sender: data.nickname,
          text: data.message,
          time: new Date().toLocaleTimeString(),
          type: 'text'
        }]);
      });

      return () => {
        socketRef.current?.disconnect();
      };
    }
  }, [swarmId]);

  const sendTextMessage = () => {
    if (textMessage.trim() && socketRef.current) {
      socketRef.current.emit('send-text', {
        swarmId,
        message: textMessage,
        nickname
      });
      setTextMessage('');
    }
  };

  const sendTTSMessage = () => {
    if (ttsMessage.trim() && socketRef.current) {
      socketRef.current.emit('send-tts', {
        swarmId,
        message: ttsMessage,
        language: ttsLanguage,
        nickname
      });
      setTtsMessage('');
    }
  };

  return (
    <TelebrainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main performance area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image viewer area */}
            <div className="glass-panel rounded-xl p-6 min-h-[200px]">
              <div id="imageViewer" className="text-center text-[#a0a0a0]">
                <span className="text-4xl mb-2 block">🖼️</span>
                Visual content appears here
              </div>
            </div>

            {/* Text receive area */}
            <div className="glass-panel rounded-xl p-6">
              <h5 className="text-sm font-bold mb-3 text-[#ded5e1]">Received Messages</h5>
              <div className="activity-log max-h-[150px] space-y-2">
                {messages.length === 0 ? (
                  <p className="text-[#606060] text-sm">No messages yet...</p>
                ) : (
                  messages.map((msg, i) => (
                    <div 
                      key={i} 
                      className={`message-item rounded px-3 py-2 ${
                        msg.sender === nickname ? 'bg-[#222] text-white' : 'bg-[#3a3a3a] text-[#e0e0e0]'
                      }`}
                    >
                      <span className="font-bold text-xs">{msg.sender}:</span>{' '}
                      <span className="text-sm">{msg.text}</span>
                      <span className="float-right text-xs text-[#999]">{msg.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Text send */}
            <div className="glass-panel rounded-xl p-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={textMessage}
                  onChange={(e) => setTextMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendTextMessage()}
                  placeholder="Type a message..."
                  className="chat-input flex-1"
                />
                <button 
                  onClick={sendTextMessage}
                  className="btn-telebrain px-6 py-3"
                >
                  Send
                </button>
              </div>
            </div>

            {/* TTS send */}
            <div className="glass-panel rounded-xl p-6">
              <h5 className="text-sm font-bold mb-3 text-[#ded5e1]">Live Text-to-Speech</h5>
              <div className="space-y-3">
                <select 
                  value={ttsLanguage}
                  onChange={(e) => setTtsLanguage(e.target.value)}
                  className="chat-input w-full"
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="es">Spanish</option>
                  <option value="pt-PT">Portuguese</option>
                  <option value="zh-CN">Chinese</option>
                  <option value="ja">Japanese</option>
                </select>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={ttsMessage}
                    onChange={(e) => setTtsMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendTTSMessage()}
                    placeholder="Type text for speech..."
                    className="chat-input flex-1"
                  />
                  <button 
                    onClick={sendTTSMessage}
                    className="btn-telebrain px-6 py-3"
                  >
                    Speak
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performer list */}
            <div className="glass-panel rounded-xl p-6">
              <h5 className="text-sm font-bold mb-4 text-[#ded5e1]">👥 Performers</h5>
              <div className="space-y-2">
                {performers.length === 0 ? (
                  <p className="text-[#606060] text-sm">Waiting for performers...</p>
                ) : (
                  performers.map((performer, i) => (
                    <div 
                      key={i}
                      className="flex items-center gap-2 p-2 rounded hover:bg-white/5 transition-colors"
                    >
                      <span className={`w-2 h-2 rounded-full ${performer.connected ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                      <span className="text-sm">{performer.nickname}</span>
                      {performer.role && (
                        <span className="text-xs text-[#999] ml-auto">{performer.role}</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Activity Log */}
            <div className="glass-panel rounded-xl p-6">
              <h5 className="text-sm font-bold mb-4 text-[#ded5e1]">📋 Activity Log</h5>
              <div className="activity-log space-y-2">
                {activityLog.length === 0 ? (
                  <p className="text-[#606060] text-sm">No activity yet...</p>
                ) : (
                  activityLog.map((log, i) => (
                    <div key={i} className="message-item rounded px-3 py-2 text-sm">
                      <span className="font-bold text-xs text-[#39a64e]">{log.sender}:</span>{' '}
                      <span className="text-[#a0a0a0]">{log.text}</span>
                      <span className="float-right text-xs text-[#666]">{log.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Swarm info */}
            <div className="glass-panel rounded-xl p-6">
              <h5 className="text-sm font-bold mb-4 text-[#ded5e1]">ℹ️ Session Info</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#a0a0a0]">Swarm ID:</span>
                  <span className="font-mono text-xs">{swarmId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a0a0a0]">Your Name:</span>
                  <span className="text-[#ded5e1]">{nickname}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#a0a0a0]">Status:</span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full icon-pulse"></span>
                    <span className="text-green-500">Connected</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TelebrainLayout>
  );
}

export default function TelebrainPerformPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TelebrainPerformContent />
    </Suspense>
  );
}

