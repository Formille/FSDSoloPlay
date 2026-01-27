import { Challenge } from '../types'
import { useTranslation } from 'react-i18next'

interface ChallengeCardProps {
  challenge: Challenge
  selected: boolean
  onClick: () => void
}

export function ChallengeCard({ challenge, selected, onClick }: ChallengeCardProps) {
  const { i18n } = useTranslation()
  const lang = i18n.language as 'ko' | 'en'

  return (
    <button
      onClick={onClick}
      className={`card text-left transition-all duration-200 flex flex-col items-start justify-start h-full ${
        selected
          ? 'ring-4 ring-forest-500 bg-forest-50'
          : 'hover:shadow-xl hover:scale-105'
      }`}
    >
      <div className="flex items-start justify-between mb-2 w-full">
        <div className="flex items-center gap-2 flex-1">
          <h3 className="text-lg font-bold text-forest-800">
            {challenge.id}. {challenge.title[lang]}
          </h3>
          {challenge.specialSetup && (
            <span className="bg-moor-200 text-moor-800 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap">
              ⚠ 특수 설정
            </span>
          )}
        </div>
        {selected && (
          <span className="text-forest-600 text-2xl ml-2">✓</span>
        )}
      </div>
      <p className="text-sm text-forest-600 mb-3">
        {challenge.description[lang]}
      </p>
      <div className="flex gap-2 text-xs">
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
    </button>
  )
}

