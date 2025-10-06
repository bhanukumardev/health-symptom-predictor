import React, { useState, useRef, useEffect } from 'react'
import { generateHealthResponse, ChatMessage } from '../services/backend-chat'
import { translateBotResponse } from '../services/translate'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import { IoIosSend } from 'react-icons/io'
import { FaRobot, FaUser } from 'react-icons/fa'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

export default function ChatBot() {
  const { t, i18n } = useTranslation()
  const [userInput, setUserInput] = useState('')
  const [chat, setChat] = useState<ChatMessage[]>([
    {
      type: 'bot',
      text: t('chat.greeting'),
      timestamp: new Date()
    }
  ])
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat])

  const submitMessage = async () => {
    if (!userInput.trim() || loading) return

    const userMessage: ChatMessage = {
      type: 'user',
      text: userInput,
      timestamp: new Date()
    }

    setChat(prev => [...prev, userMessage])
    setUserInput('')
    setLoading(true)

    try {
      // Pass chat history to backend for context (last 10 messages)
      const reply = await generateHealthResponse(userInput, chat.slice(-10))
      
      // Translate bot response based on user's UI language preference
      const translatedReply = await translateBotResponse(reply, i18n.language)
      
      const botMessage: ChatMessage = {
        type: 'bot',
        text: translatedReply,
        timestamp: new Date()
      }
      setChat(prev => [...prev, botMessage])
    } catch (error: any) {
      console.error('💥 Chat error:', error)
      const errorMessage: ChatMessage = {
        type: 'bot',
        text: `❌ Error: ${error?.message || 'Sorry, I encountered an error. Please try again.'}\n\nPlease check the browser console for more details.`,
        timestamp: new Date()
      }
      setChat(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submitMessage()
    }
  }

  return (
    <div className="card h-[600px] flex flex-col bg-slate-900/50 backdrop-blur">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-700 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600">
          <FaRobot className="text-white text-xl" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-100">{t('chat.title')}</h3>
          <p className="text-xs text-slate-400">{t('chat.subtitle')}</p>
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div
              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                msg.type === 'user'
                  ? 'bg-gradient-to-br from-green-500 to-cyan-500'
                  : 'bg-gradient-to-br from-purple-500 to-pink-500'
              }`}
            >
              {msg.type === 'user' ? (
                <FaUser className="text-white text-sm" />
              ) : (
                <FaRobot className="text-white text-sm" />
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.type === 'user'
                  ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white'
                  : 'bg-slate-800 text-slate-100'
              }`}
            >
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    strong: ({ children }) => <strong className="font-semibold text-cyan-300">{children}</strong>,
                    ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
              <div className="mt-1 text-xs opacity-60">
                {msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
              <FaRobot className="text-white text-sm" />
            </div>
            <div className="rounded-2xl bg-slate-800 px-4 py-3">
              <div className="flex items-center gap-2 text-slate-400">
                <AiOutlineLoading3Quarters className="animate-spin" />
                <span className="text-sm">{t('common.loading')}</span>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-700 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('chat.placeholder')}
            disabled={loading}
            className="flex-1 rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-50"
          />
          <button
            onClick={submitMessage}
            disabled={loading || !userInput.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white transition-all hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IoIosSend className="text-xl" />
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500 text-center">
          💡 Ask about symptoms, health tips, or general wellness in any language
        </p>
      </div>
    </div>
  )
}
