import missionResultsAtlas from '../data/mission_results_atlas.json'

export type ResultType = 'fail' | 'bronze' | 'silver' | 'gold'

const RESULT_NAMES: ResultType[] = ['fail', 'bronze', 'silver', 'gold']

/** 메달 코드(0~3) → result_name */
export function medalCodeToResultName(code: number): ResultType {
  const idx = Math.max(0, Math.min(3, code))
  return RESULT_NAMES[idx]
}

/** missionId + medalCode → 아틀라스 프레임 키 */
export function getFrameKey(missionId: number, medalCode: number): string {
  const resultName = medalCodeToResultName(medalCode)
  return `${missionId}_${resultName}`
}

/** 아틀라스에서 프레임 정보 조회 */
export function getFrame(missionId: number, medalCode: number): { x: number; y: number; w: number; h: number } | null {
  const key = getFrameKey(missionId, medalCode)
  const frame = (missionResultsAtlas as { frames: Record<string, { x: number; y: number; w: number; h: number }> }).frames[key]
  return frame ?? null
}
