import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useGameState } from '../hooks/useGameState'
import { AutomaActionDisplay } from './AutomaActionDisplay'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useGameStore } from '../store/gameStore'

export function PlayScreen() {
  const { t } = useTranslation()
  const {
    currentAutomaCard,
    remainingCards,
    proceedToNextAction,
    finishGame
  } = useGameState()
  const startTime = useGameStore(state => state.startTime)
  const [playTime, setPlayTime] = useState<string>('00:00')

  useEffect(() => {
    if (!startTime) return

    const updatePlayTime = () => {
      const now = new Date()
      const start = new Date(startTime)
      const diff = Math.floor((now.getTime() - start.getTime()) / 1000) // 초 단위
      
      const minutes = Math.floor(diff / 60)
      const seconds = diff % 60
      setPlayTime(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`)
    }

    updatePlayTime()
    const interval = setInterval(updatePlayTime, 1000)

    return () => clearInterval(interval)
  }, [startTime])

  if (!currentAutomaCard) {
    return (
      <div className="min-h-screen bg-forest-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-forest-600 mb-4">{t('play.noMoreCards')}</p>
          <button
            onClick={() => proceedToNextAction()}
            className="btn-primary"
          >
            {t('play.nextAction')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-forest-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-forest-800 mb-2">
              {t('play.title')}
            </h1>
            <div className="flex gap-4 text-forest-600">
              <span>
                {t('play.remainingCards')}: {remainingCards}
              </span>
              <span>
                {t('play.playTime')}: {playTime}
              </span>
            </div>
          </div>
          <LanguageSwitcher />
        </div>

        {/* Current Action Display */}
        <section className="mb-8 animate-fade-in">
          <h2 className="text-2xl font-semibold text-forest-800 mb-4">
            {t('play.currentAction')}
          </h2>
          <AutomaActionDisplay card={currentAutomaCard} />
        </section>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => proceedToNextAction()}
            className="btn-primary w-full text-xl py-4"
          >
            {t('play.nextAction')}
          </button>
          
          <button
            onClick={finishGame}
            className="w-full text-xl py-4 rounded-lg font-semibold 
                       bg-gradient-to-br from-sky-50 to-white 
                       border-2 border-sky-200 
                       text-sky-700 
                       hover:from-sky-100 hover:to-sky-50 hover:border-sky-300 
                       active:from-sky-200 active:to-sky-100 
                       transition-all duration-200 
                       touch-manipulation
                       transform hover:scale-105 active:scale-95
                       shadow-sm hover:shadow-md"
          >
            {t('play.winterCard')}
          </button>
        </div>
      </div>
    </div>
  )
}

