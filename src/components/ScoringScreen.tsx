import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGameState } from '../hooks/useGameState'
import { ScoreInputForm } from './ScoreInputForm'
import { ScoreInput, Difficulty } from '../types'
import { checkVictory, determineMedal } from '../services/scoring'
import { getChallengeById } from '../data/challenges'
import { saveGameHistory } from '../services/history'
import { LanguageSwitcher } from './LanguageSwitcher'
import { VictoryCertificate } from './VictoryCertificate'
import { GameHistory } from '../types'

interface ScoringScreenProps {
  onGoToHistory?: () => void
}

export function ScoringScreen({ onGoToHistory }: ScoringScreenProps) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'ko' | 'en'
  const { challengeId, clearGame } = useGameState()
  const [result, setResult] = useState<{
    isVictory: boolean
    score: number
    medal: Difficulty | null
    requiredScore: number | null
    history: GameHistory
  } | null>(null)
  const [showCertificate, setShowCertificate] = useState(false)

  if (!challengeId) {
    return (
      <div className="min-h-screen bg-forest-50 flex items-center justify-center">
        <p className="text-forest-600">{t('common.loading')}</p>
      </div>
    )
  }

  const challenge = getChallengeById(challengeId)
  if (!challenge) {
    return (
      <div className="min-h-screen bg-forest-50 flex items-center justify-center">
        <p className="text-forest-600">Challenge not found</p>
      </div>
    )
  }

  const handleScoreSubmit = (input: ScoreInput, adjustedScore: number) => {
    const { isVictory, medal } = checkVictory(adjustedScore, challengeId, input.goalMet)
    const requiredScore = medal ? challenge.minScore[medal] : null

    const savedHistory = saveGameHistory({
      challengeId,
      difficulty: medal || 'bronze', // 메달이 없어도 기록을 위해 기본값 사용
      score: adjustedScore,
      goalMet: input.goalMet,
      isVictory
    })

    setResult({
      isVictory,
      score: adjustedScore,
      medal,
      requiredScore,
      history: savedHistory
    })

    if (isVictory) {
      setShowCertificate(true)
    }
  }

  const handleNewGame = () => {
    clearGame()
  }

  return (
    <div className="min-h-screen bg-forest-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-forest-800 mb-2">
              {t('scoring.title')}
            </h1>
            <div className="text-forest-600">
              <p className="font-semibold">
                {challenge.id}. {challenge.title[lang]}
              </p>
              <p className="text-sm">{challenge.description[lang]}</p>
            </div>
          </div>
          <LanguageSwitcher />
        </div>

        {/* Score Input Form */}
        {!result && (
          <section className="card mb-8">
            <h2 className="text-2xl font-semibold text-forest-800 mb-6">
              {t('scoring.title')}
            </h2>
            <ScoreInputForm
              onSubmit={handleScoreSubmit}
              challengeId={challengeId}
              onSaveAndGoToHistory={onGoToHistory}
            />
          </section>
        )}

        {/* Result Display */}
        {result && (
          <section className="card mb-8">
            <div className={`text-center p-8 rounded-lg ${
              result.isVictory
                ? 'bg-forest-100 border-4 border-forest-500'
                : 'bg-moor-100 border-4 border-moor-500'
            }`}>
              <div className="text-6xl mb-4">
                {result.isVictory ? '🎉' : '😢'}
              </div>
              <h2 className={`text-4xl font-bold mb-4 ${
                result.isVictory ? 'text-forest-800' : 'text-moor-800'
              }`}>
                {result.isVictory ? t('scoring.victory') : t('scoring.defeat')}
              </h2>
              <div className="space-y-2 mb-6">
                <p className="text-lg text-forest-700">
                  {t('scoring.scoreAchieved')}: <strong>{result.score}점</strong>
                </p>
                {result.medal && (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl">
                      {result.medal === 'bronze' && '🥉'}
                      {result.medal === 'silver' && '🥈'}
                      {result.medal === 'gold' && '🥇'}
                    </span>
                    <p className="text-lg text-forest-700">
                      {t(`setup.${result.medal}`)} 메달 획득!
                    </p>
                  </div>
                )}
                {result.requiredScore && (
                  <p className="text-lg text-forest-700">
                    {t('scoring.scoreRequired')}: <strong>{result.requiredScore}점</strong>
                  </p>
                )}
              </div>
              {result.isVictory && result.medal && (
                <p className="text-xl text-forest-800 font-semibold">
                  {t('scoring.victoryMessage', { difficulty: t(`setup.${result.medal}`) })}
                </p>
              )}
              {!result.isVictory && result.medal === null && (
                <p className="text-xl text-moor-800 font-semibold">
                  {t('scoring.noMedalMessage')}
                </p>
              )}
              {!result.isVictory && (
                <p className="text-xl text-moor-800 font-semibold">
                  {t('scoring.defeatMessage')}
                </p>
              )}
            </div>

            <div className="mt-6 flex gap-4">
              {result.isVictory && (
                <button
                  onClick={() => setShowCertificate(true)}
                  className="btn-primary flex-1"
                >
                  {t('certificate.title')}
                </button>
              )}
              <button
                onClick={handleNewGame}
                className="btn-secondary flex-1"
              >
                {t('setup.title')}
              </button>
            </div>
          </section>
        )}
      </div>

      {/* Victory Certificate Modal */}
      {showCertificate && result && (
        <VictoryCertificate
          history={result.history}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  )
}
