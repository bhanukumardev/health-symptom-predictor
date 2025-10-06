import { useTranslation } from 'react-i18next'
import ChatBot from '../components/ChatBot'

export default function ChatPage() {
  const { t } = useTranslation()
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('chat.title')}</h1>
          <p className="mt-2 text-slate-400">
            {t('chat.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-4">
          <div className="mb-2 text-2xl">🌐</div>
          <h3 className="font-semibold text-slate-200">{t('chat.features.multilingual.title')}</h3>
          <p className="text-sm text-slate-400">{t('chat.features.multilingual.description')}</p>
        </div>
        <div className="card p-4">
          <div className="mb-2 text-2xl">⚡</div>
          <h3 className="font-semibold text-slate-200">{t('chat.features.fast.title')}</h3>
          <p className="text-sm text-slate-400">{t('chat.features.fast.description')}</p>
        </div>
        <div className="card p-4">
          <div className="mb-2 text-2xl">🤖</div>
          <h3 className="font-semibold text-slate-200">{t('chat.features.ai.title')}</h3>
          <p className="text-sm text-slate-400">{t('chat.features.ai.description')}</p>
        </div>
      </div>

      <ChatBot />
    </div>
  )
}
