import { Difficulty } from '../types'

/** 미션별 썸네일 URL (fail/bronze/silver/gold) */
export function getMissionThumbnailUrl(
  missionId: number,
  result?: { difficulty: Difficulty; isVictory: boolean } | null
): string {
  if (!result) return `/mission_thumbnails/${missionId}.webp` // 기본: 동메달
  const suffix = result.isVictory ? result.difficulty : 'fail'
  return suffix === 'bronze'
    ? `/mission_thumbnails/${missionId}.webp`
    : `/mission_thumbnails/${missionId}_${suffix}.webp`
}
