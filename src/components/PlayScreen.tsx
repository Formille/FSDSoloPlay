import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useGameState } from '../hooks/useGameState'
import { AutomaActionDisplay } from './AutomaActionDisplay'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useGameStore } from '../store/gameStore'

/** 디버그: 나온 카드/남은 카드 ID 목록 표시 */
const SHOW_DEBUG = false

export function PlayScreen() {
  const { t } = useTranslation()
  const {
    currentAutomaCard,
    remainingCards,
    automaDeck,
    automaDiscard,
    shownCardsSinceShuffle,
    proceedToNextAction,
    finishGame
  } = useGameState()
  const startTime = useGameStore(state => state.startTime)
  const [showEndConfirm, setShowEndConfirm] = useState(false)
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
    <div className="min-h-screen bg-forest-50 flex flex-col">
      {/* 스크롤 가능한 콘텐츠 영역 */}
      <div className="flex-1 overflow-y-auto py-8 px-4 pb-48">
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
          <section className="animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-forest-800">
                {t('play.currentAction')}
              </h2>
              <span className="text-forest-600 font-medium bg-forest-100 px-3 py-1 rounded-lg">
                {t('play.cardId')}: {currentAutomaCard.id}
              </span>
            </div>
            <AutomaActionDisplay key={currentAutomaCard.id} card={currentAutomaCard} />
          </section>
        </div>
      </div>

      {/* 화면 하단 고정: 버튼 영역 */}
      <div className="fixed bottom-0 left-0 right-0 bg-forest-50 border-t border-forest-200 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        {SHOW_DEBUG && (
          <div className="max-w-2xl mx-auto px-4 pt-4">
            <section className="card bg-forest-50 border-2 border-forest-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-forest-700 mb-2">
                    {t('play.shownCards')}
                  </h3>
                  <p className="text-forest-600 text-sm break-all">
                    {[...shownCardsSinceShuffle, currentAutomaCard?.id].filter(Boolean).join(', ') || '-'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-forest-700 mb-2">
                    {t('play.remainingCardsIds')}
                  </h3>
                  <div className="grid grid-cols-5 gap-1.5">
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((id) => {
                      const shownIds = new Set([
                        ...automaDiscard.map((c) => c.id),
                        currentAutomaCard?.id
                      ].filter(Boolean))
                      const isShown = shownIds.has(id)
                      return (
                        <span
                          key={id}
                          className={`text-center py-2 px-1 rounded text-sm font-medium ${
                            isShown ? 'text-forest-400 opacity-40' : 'text-forest-700 bg-forest-100'
                          }`}
                        >
                          {id}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
        <div className="max-w-2xl mx-auto p-4 pb-6 space-y-3">
          <button
            onClick={() => proceedToNextAction()}
            className="btn-primary w-full text-xl py-4"
          >
            {t('play.nextAction')}
          </button>
          <button
            onClick={() => setShowEndConfirm(true)}
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

      {/* 게임 종료 확인 팝업 */}
      {showEndConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card bg-white max-w-sm w-full">
            <p className="text-lg font-semibold text-forest-800 mb-6 text-center">
              {t('play.gameEndConfirm')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEndConfirm(false)}
                className="btn-secondary flex-1"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={() => {
                  setShowEndConfirm(false)
                  finishGame()
                }}
                className="btn-primary flex-1"
              >
                {t('common.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

