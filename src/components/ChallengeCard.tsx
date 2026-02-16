import { Challenge, Difficulty } from '../types'
import { useTranslation } from 'react-i18next'
import { getMissionThumbnailUrl } from '../utils/missionThumbnails'

interface ChallengeCardProps {
  challenge: Challenge
  selected: boolean
  onClick: () => void
  /** 기록 있으면 해당 메달 이미지 표시 */
  bestResult?: { difficulty: Difficulty; isVictory: boolean } | null
}

export function ChallengeCard({ challenge, selected, onClick, bestResult }: ChallengeCardProps) {
  const { i18n } = useTranslation()
  const lang = i18n.language as 'ko' | 'en'

  return (
    <button
      onClick={onClick}
      className={`text-left transition-all duration-200 flex flex-col overflow-hidden h-full bg-white rounded-xl shadow-lg border border-forest-100 ${
        selected
          ? 'ring-4 ring-forest-500 bg-forest-50'
          : 'hover:shadow-xl hover:scale-105'
      }`}
    >
      {/* 이미지: 기록 있으면 해당 메달 이미지, 없으면 동메달 */}
      <div className="w-full flex-shrink-0 overflow-hidden rounded-t-xl relative">
        <img
          src={getMissionThumbnailUrl(challenge.id, bestResult)}
          alt=""
          className="w-full aspect-[4/3] object-cover bg-forest-100 block"
          width={800}
          height={597}
        />
        {/* 기록 있을 때 메달 배지 */}
        {bestResult && (
          <span className="absolute top-2 right-2 text-3xl drop-shadow-lg">
            {bestResult.isVictory
              ? { bronze: '🥉', silver: '🥈', gold: '🥇' }[bestResult.difficulty]
              : '❌'}
          </span>
        )}
      </div>

      {/* 본문: 패딩 적용 */}
      <div className="p-6 flex flex-col flex-1 min-h-0">
      {/* 제목 + 특수설정 */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-lg font-bold text-forest-800 flex-1 min-w-0">
          {challenge.id}. {challenge.title[lang]}
        </h3>
        {challenge.specialSetup && (
          <span className="bg-moor-200 text-moor-800 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap flex-shrink-0">
            ⚠ 특수 설정
          </span>
        )}
        {selected && (
          <span className="text-forest-600 text-2xl flex-shrink-0">✓</span>
        )}
      </div>

      {/* 설명 */}
      <p className="text-sm text-forest-600 mb-3">
        {challenge.description[lang]}
      </p>

      {/* 점수 기준 */}
      <div className="flex gap-2 text-xs mt-auto">
        <span className="bg-tree-200 text-tree-800 px-2 py-1 rounded">
          동 {challenge.minScore.bronze}
        </span>
        <span className="bg-moor-200 text-moor-800 px-2 py-1 rounded">
          은 {challenge.minScore.silver}
        </span>
        <span className="bg-forest-300 text-forest-900 px-2 py-1 rounded">
          금 {challenge.minScore.gold}
        </span>
      </div>
      </div>
    </button>
  )
}

