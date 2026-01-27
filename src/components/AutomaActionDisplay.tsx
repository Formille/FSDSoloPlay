import { AutomaCard } from '../types'
import { useTranslation } from 'react-i18next'
import { ArrowRight, ArrowLeft } from 'lucide-react'

interface AutomaActionDisplayProps {
  card: AutomaCard
}

export function AutomaActionDisplay({ card }: AutomaActionDisplayProps) {
  const { t } = useTranslation()

  const getDirectionText = () => {
    return card.removeDirection === 'left_to_right'
      ? t('play.leftToRight')
      : t('play.rightToLeft')
  }

  return (
    <div className="space-y-4">
      {/* Step 1: Add Cards */}
      {card.addCount > 0 && (
        <div className="card bg-forest-50 border-2 border-forest-300">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-forest-800 font-semibold">
                {t('play.step1', { count: card.addCount })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Remove Cards */}
      {card.removeCount > 0 && (
        <div className="card bg-moor-50 border-2 border-moor-300">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-moor-800 font-semibold">
                {t('play.step2', {
                  count: card.removeCount,
                  direction: getDirectionText()
                })}
              </p>
              <div className="flex gap-2 mt-2 items-center">
                {card.removeDirection === 'left_to_right' && (
                  <ArrowRight className="w-6 h-6 text-moor-600" />
                )}
                {Array.from({ length: card.removeCount }).map((_, i) => (
                  <div
                    key={i}
                    className="w-12 h-16 bg-moor-200 rounded border-2 border-moor-500 flex items-center justify-center"
                  >
                    <span className="text-moor-800 font-bold">-</span>
                  </div>
                ))}
                {card.removeDirection === 'right_to_left' && (
                  <ArrowLeft className="w-6 h-6 text-moor-600" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Burn Card - Only shown when burnTopCard is true */}
      {card.burnTopCard && (
        <div className="card bg-tree-50 border-2 border-tree-300">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-tree-800 font-semibold">
                {t('play.step3')}
              </p>
              <div className="mt-2">
                <div className="w-12 h-16 bg-tree-200 rounded border-2 border-tree-500 flex items-center justify-center">
                  <span className="text-tree-800 font-bold">🔥</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

