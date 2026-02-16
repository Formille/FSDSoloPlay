import { Difficulty } from '../types'

/** 미션별 썸네일 URL (fail/bronze/silver/gold) */
export function getMissionThumbnailUrl(
  missionId: number,
  result?: { difficulty: Difficulty; isVictory: boolean } | null
): string {
  if (!result) return `/mission_thumbnails/${missionId}.png` // 기본: 동메달
  const suffix = result.isVictory ? result.difficulty : 'fail'
  return suffix === 'bronze'
    ? `/mission_thumbnails/${missionId}.png`
    : `/mission_thumbnails/${missionId}_${suffix}.png`
}
