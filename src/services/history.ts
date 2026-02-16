import { GameHistory, Difficulty } from '../types'

const STORAGE_KEY = 'dartmoor-game-history'

const MEDAL_RANK: Record<Difficulty | 'fail', number> = {
  fail: 0,
  bronze: 1,
  silver: 2,
  gold: 3
}

/**
 * 게임 기록 저장
 */
export function saveGameHistory(history: Omit<GameHistory, 'id' | 'date'> & {
  playerName?: string
  duration?: number
  completedAt?: number
}): GameHistory {
  const gameHistory: GameHistory = {
    id: `game-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    date: new Date().toISOString().split('T')[0],
    ...history
  }

  const histories = getGameHistory()
  histories.unshift(gameHistory) // 최신 기록을 앞에 추가
  
  // 최대 100개까지만 저장
  const limitedHistories = histories.slice(0, 100)
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedHistories))
  
  return gameHistory
}

/**
 * 게임 기록 조회
 */
export function getGameHistory(): GameHistory[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []
    
    return JSON.parse(data) as GameHistory[]
  } catch (error) {
    console.error('Failed to load game history:', error)
    return []
  }
}

/**
 * 특정 기록 조회
 */
export function getGameHistoryById(id: string): GameHistory | null {
  const histories = getGameHistory()
  return histories.find(h => h.id === id) || null
}

/**
 * 게임 기록 삭제
 */
export function deleteGameHistory(id: string): boolean {
  try {
    const histories = getGameHistory()
    const filtered = histories.filter(h => h.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    return true
  } catch (error) {
    console.error('Failed to delete game history:', error)
    return false
  }
}

/**
 * 챌린지별 최고 기록 조회 (금 > 은 > 동 > 실패 순)
 * @returns { difficulty, isVictory } 또는 null (기록 없음)
 */
export function getBestResultByChallengeId(challengeId: number): {
  difficulty: Difficulty
  isVictory: boolean
} | null {
  const histories = getGameHistory()
  const challengeHistories = histories.filter(h => h.challengeId === challengeId)
  if (challengeHistories.length === 0) return null

  let best: GameHistory | null = null
  for (const h of challengeHistories) {
    const rank = h.isVictory ? MEDAL_RANK[h.difficulty] : MEDAL_RANK.fail
    const bestRank = best ? (best.isVictory ? MEDAL_RANK[best.difficulty] : MEDAL_RANK.fail) : -1
    if (rank > bestRank) best = h
  }
  if (!best) return null
  return {
    difficulty: best.difficulty,
    isVictory: best.isVictory
  }
}

/**
 * 모든 챌린지에 대한 최고 기록 맵
 */
export function getBestResultsMap(): Map<number, { difficulty: Difficulty; isVictory: boolean }> {
  const histories = getGameHistory()
  const map = new Map<number, { difficulty: Difficulty; isVictory: boolean }>()
  for (const h of histories) {
    const existing = map.get(h.challengeId)
    const rank = h.isVictory ? MEDAL_RANK[h.difficulty] : MEDAL_RANK.fail
    const existingRank = existing ? (existing.isVictory ? MEDAL_RANK[existing.difficulty] : MEDAL_RANK.fail) : -1
    if (rank > existingRank) {
      map.set(h.challengeId, { difficulty: h.difficulty, isVictory: h.isVictory })
    }
  }
  return map
}

/**
 * 모든 기록 삭제
 */
export function clearAllHistory(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('Failed to clear game history:', error)
    return false
  }
}

