import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScoreInput } from '../types'
import { calculateSpecialCardScores } from '../services/scoring'
import { getChallengeById } from '../data/challenges'

interface ScoreInputFormProps {
  onSubmit: (input: ScoreInput, adjustedScore: number) => void
  challengeId: number
  onSaveAndGoToHistory?: () => void
}

export function ScoreInputForm({ onSubmit, challengeId, onSaveAndGoToHistory }: ScoreInputFormProps) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'ko' | 'en'
  
  const challenge = getChallengeById(challengeId)
  
  const [totalScore, setTotalScore] = useState<number>(0)
  const [moors, setMoors] = useState<number>(0)
  const [blackTailedGodwits, setBlackTailedGodwits] = useState<number>(0)
  const [dartmoorPonies, setDartmoorPonies] = useState<number>(0)
  const [goalMet, setGoalMet] = useState<boolean>(false)

  // 특수 카드 점수 계산이 필요한 도전과제 확인
  const needsSpecialCards = challengeId === 2 || challengeId === 6 || challengeId === 7 || 
                            blackTailedGodwits > 0 || dartmoorPonies > 0
  
  // 습지 개수가 필요한 도전과제 확인
  const needsMoors = challengeId === 2 || challengeId === 6 || needsSpecialCards

  const specialScores = calculateSpecialCardScores(moors, blackTailedGodwits, dartmoorPonies)
  const adjustedScore = totalScore + specialScores.totalSpecialScore

  const handleSubmit = () => {
    const input: ScoreInput = {
      totalScore,
      moors: needsMoors ? moors : 0,
      blackTailedGodwits: needsSpecialCards ? blackTailedGodwits : 0,
      dartmoorPonies: needsSpecialCards ? dartmoorPonies : 0,
      goalMet
    }
    onSubmit(input, adjustedScore)
    if (onSaveAndGoToHistory) {
      onSaveAndGoToHistory()
    }
  }

  return (
    <div className="space-y-6">
      {/* Challenge Goal Checklist - First */}
      {challenge && (
        <div className="card bg-forest-50 border-2 border-forest-300">
          <h3 className="font-bold text-forest-800 mb-3">
            {challenge.id}. {challenge.title[lang]} - {t('scoring.challengeChecklist')}
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-white rounded-lg border border-forest-200">
              <p className="text-sm text-forest-700 font-semibold mb-2">
                {challenge.description[lang]}
              </p>
              {/* Challenge-specific checks */}
              {challengeId === 2 && (
                <div className="flex items-center gap-2 text-sm mt-2">
                  <span className={moors >= 10 ? 'text-green-600 font-bold text-lg' : 'text-moor-600 text-lg'}>
                    {moors >= 10 ? '✓' : '○'}
                  </span>
                  <span className={moors >= 10 ? 'text-green-700 font-semibold' : 'text-forest-600'}>
                    습지 카드 {moors}장 / 최소 10장 필요
                  </span>
                </div>
              )}
              {(challengeId === 6 || challengeId === 7) && (
                <p className="text-sm text-moor-700 mt-2 font-semibold">
                  ⚠ {challenge.description[lang]} 조건을 충족했는지 확인하세요
                </p>
              )}
            </div>
            <p className="text-xs text-forest-600 italic">
              {t('scoring.challengeChecklistNote')}
            </p>
          </div>
        </div>
      )}

      {/* Goal Met Checkbox - Second */}
      <div>
        {challengeId === 15 ? (
          <div className="card bg-moor-50 border-2 border-moor-300">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={goalMet}
                onChange={(e) => setGoalMet(e.target.checked)}
                className="mt-1 w-5 h-5"
              />
              <div>
                <p className="font-semibold text-moor-800 mb-1">
                  {t('scoring.wingedKingdomCheck')}
                </p>
                <p className="text-sm text-moor-600">
                  {t('scoring.goalMet')}
                </p>
              </div>
            </label>
          </div>
        ) : (
          <label className="flex items-center gap-3 cursor-pointer card">
            <input
              type="checkbox"
              checked={goalMet}
              onChange={(e) => setGoalMet(e.target.checked)}
              className="w-5 h-5"
            />
            <span className="font-semibold text-forest-800">
              {t('scoring.goalMet')}
            </span>
          </label>
        )}
      </div>

      {/* Total Score - Third */}
      <div>
        <label className="block text-forest-800 font-semibold mb-2">
          {t('scoring.totalScore')}
        </label>
        <input
          type="number"
          value={totalScore || ''}
          onChange={(e) => setTotalScore(Number(e.target.value))}
          className="w-full px-4 py-3 rounded-lg border-2 border-forest-300 focus:border-forest-500 focus:outline-none text-lg"
          min="0"
        />
      </div>

      {/* Moors - Only for challenges that need it */}
      {needsMoors && (
        <div>
          <label className="block text-forest-800 font-semibold mb-2">
            {t('scoring.moorsRequired')} *
          </label>
          <input
            type="number"
            value={moors || ''}
            onChange={(e) => setMoors(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-lg border-2 border-forest-300 focus:border-forest-500 focus:outline-none text-lg"
            min="0"
            required
          />
        </div>
      )}

      {/* Black-Tailed Godwit - Only for challenges that need special cards */}
      {needsSpecialCards && (
        <div>
          <label className="block text-forest-800 font-semibold mb-2">
            {t('scoring.blackTailedGodwit')}
          </label>
          <input
            type="number"
            value={blackTailedGodwits || ''}
            onChange={(e) => setBlackTailedGodwits(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-lg border-2 border-forest-300 focus:border-forest-500 focus:outline-none text-lg mb-2"
            min="0"
          />
          <p className="text-sm text-forest-600">
            {t('scoring.blackTailedGodwitNote')}
          </p>
          {blackTailedGodwits > 0 && moors > 0 && (
            <p className="text-sm text-moor-700 mt-1">
              점수: {specialScores.godwitScore}점
            </p>
          )}
        </div>
      )}

      {/* Dartmoor Pony - Only for challenges that need special cards */}
      {needsSpecialCards && (
        <div>
          <label className="block text-forest-800 font-semibold mb-2">
            {t('scoring.dartmoorPony')}
          </label>
          <input
            type="number"
            value={dartmoorPonies || ''}
            onChange={(e) => setDartmoorPonies(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-lg border-2 border-forest-300 focus:border-forest-500 focus:outline-none text-lg mb-2"
            min="0"
          />
          <p className="text-sm text-forest-600">
            {t('scoring.dartmoorPonyNote')}
          </p>
          {dartmoorPonies > 0 && moors > 0 && (
            <p className="text-sm text-moor-700 mt-1">
              점수: {specialScores.ponyScore}점
            </p>
          )}
        </div>
      )}

      {/* Adjusted Score Display with Medal Requirements */}
      <div className="card bg-forest-50 border-2 border-forest-300">
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold text-forest-800">
            {t('scoring.scoreAchieved')}:
          </span>
          <span className="text-2xl font-bold text-forest-600">
            {adjustedScore}점
          </span>
        </div>
        {/* Medal Score Requirements - Only show if goal is met */}
        {goalMet && challenge && (
          <div className="pt-3 border-t border-forest-200">
            <p className="text-xs text-forest-600 mb-2 font-semibold">
              {t('scoring.medalScoreRequirements')}:
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <span className="text-lg">🥉</span>
                <p className="text-forest-700 font-semibold">
                  {t('setup.bronze')}: {challenge.minScore.bronze}점
                </p>
              </div>
              <div className="text-center">
                <span className="text-lg">🥈</span>
                <p className="text-forest-700 font-semibold">
                  {t('setup.silver')}: {challenge.minScore.silver}점
                </p>
              </div>
              <div className="text-center">
                <span className="text-lg">🥇</span>
                <p className="text-forest-700 font-semibold">
                  {t('setup.gold')}: {challenge.minScore.gold}점
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <button
        onClick={handleSubmit}
        disabled={needsMoors && moors === 0}
        className="btn-primary w-full text-xl py-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t('scoring.saveRecord')}
      </button>
    </div>
  )
}

