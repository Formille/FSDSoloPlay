import { getFrame } from '../utils/missionResultsSprite'

/** public 폴더에서 직접 서빙 (67MB 스프라이트는 import 시 로딩 이슈 가능) */
const SPRITE_URL = '/mission_results_sprite.webp'

const FRAME_WIDTH = 800
const FRAME_HEIGHT = 597
const SPRITE_WIDTH = 3200
const SPRITE_HEIGHT = 8955

interface MissionResultThumbnailProps {
  missionId: number
  /** 0=실패, 1=동, 2=은, 3=금 */
  medalCode: number
  width?: number
  height?: number
  className?: string
}

export function MissionResultThumbnail({
  missionId,
  medalCode,
  width = 120,
  height = 90,
  className = ''
}: MissionResultThumbnailProps) {
  const frame = getFrame(missionId, medalCode)
  if (!frame) return null

  const scaleX = width / FRAME_WIDTH
  const scaleY = height / FRAME_HEIGHT
  const bgWidth = SPRITE_WIDTH * scaleX
  const bgHeight = SPRITE_HEIGHT * scaleY
  const bgPosX = -frame.x * scaleX
  const bgPosY = -frame.y * scaleY

  return (
    <div
      className={`rounded-lg overflow-hidden bg-forest-100 flex-shrink-0 ${className}`}
      style={{
        width,
        height,
        backgroundImage: `url(${SPRITE_URL})`,
        backgroundSize: `${bgWidth}px ${bgHeight}px`,
        backgroundPosition: `${bgPosX}px ${bgPosY}px`,
        backgroundRepeat: 'no-repeat'
      }}
      role="img"
      aria-label={`Mission ${missionId} result thumbnail`}
    />
  )
}
