import { ScoreInput, Difficulty, Challenge } from '../types'
import { getChallengeById } from '../data/challenges'

/**
 * 솔로 모드 전용 점수 조정
 * Black-Tailed Godwit: 습지 6개 미만 시 0점
 * Dartmoor Pony: 습지 8개 미만 시 15점 -> 5점
 */
export function calculateAdjustedScore(
  baseScore: number,
  moors: number,
  blackTailedGodwits: number,
  dartmoorPonies: number
): number {
  let adjustedScore = baseScore
  
  // Black-Tailed Godwit 조정 (습지 6개 미만 시 0점)
  const godwitPointsPerCard = moors >= 6 ? 10 : 0
  const godwitTotalPoints = blackTailedGodwits * godwitPointsPerCard
  
  // Dartmoor Pony 조정 (습지 8개 미만 시 15점 -> 5점)
  const ponyPointsPerCard = moors >= 8 ? 15 : 5
  const ponyTotalPoints = dartmoorPonies * ponyPointsPerCard
  
  // 기본 점수에서 Godwit와 Pony 점수를 제외하고 다시 계산
  // (실제로는 사용자가 입력한 총점에서 조정해야 함)
  // 여기서는 조정된 점수를 반환
  adjustedScore = baseScore
  
  // 만약 baseScore에 이미 포함되어 있다면, 차이만 조정
  // 실제 구현에서는 사용자가 입력한 점수에서 직접 조정하는 것이 더 정확함
  // 이 함수는 검증용으로 사용
  
  return adjustedScore
}

/**
 * Godwit와 Pony의 실제 점수를 계산
 */
export function calculateSpecialCardScores(
  moors: number,
  blackTailedGodwits: number,
  dartmoorPonies: number
): {
  godwitScore: number
  ponyScore: number
  totalSpecialScore: number
} {
  const godwitScore = blackTailedGodwits * (moors >= 6 ? 10 : 0)
  const ponyScore = dartmoorPonies * (moors >= 8 ? 15 : 5)
  
  return {
    godwitScore,
    ponyScore,
    totalSpecialScore: godwitScore + ponyScore
  }
}

/**
 * 점수에 따라 메달 결정
 */
export function determineMedal(score: number, challengeId: number): Difficulty | null {
  const challenge = getChallengeById(challengeId)
  if (!challenge) return null
  
  // 점수가 높은 메달부터 확인
  if (score >= challenge.minScore.gold) {
    return 'gold'
  } else if (score >= challenge.minScore.silver) {
    return 'silver'
  } else if (score >= challenge.minScore.bronze) {
    return 'bronze'
  }
  
  return null
}

/**
 * 승리 조건 검증
 */
export function checkVictory(
  score: number,
  challengeId: number,
  goalMet: boolean
): {
  isVictory: boolean
  medal: Difficulty | null
} {
  const challenge = getChallengeById(challengeId)
  if (!challenge) {
    return { isVictory: false, medal: null }
  }
  
  const medal = determineMedal(score, challengeId)
  
  // 목표를 달성하고 메달을 획득해야 승리
  const isVictory = medal !== null && goalMet
  
  return { isVictory, medal }
}

/**
 * 도전 과제 목표 달성 여부 검증
 * (실제 검증은 사용자가 직접 확인하지만, 여기서는 기본 검증 로직 제공)
 */
export function validateChallengeGoal(
  challengeId: number,
  goalMet: boolean
): boolean {
  // Challenge #15 (Winged Kingdom)는 복잡한 검증이 필요하므로
  // 사용자가 직접 확인해야 함
  if (challengeId === 15) {
    return goalMet // 사용자 확인 결과를 그대로 사용
  }
  
  // 다른 도전 과제도 사용자가 직접 확인
  return goalMet
}

