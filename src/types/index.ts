export type GamePhase = 'setup' | 'playing' | 'scoring' | 'finished'
export type Difficulty = 'bronze' | 'silver' | 'gold'
export type RemoveDirection = 'left_to_right' | 'right_to_left'

export interface AutomaCard {
  id: number
  addCount: number // 1-3
  removeCount: number // 0-2
  removeDirection: RemoveDirection
  burnTopCard: boolean // 더미에서 카드를 제거할 때 true
}

export interface Challenge {
  id: number
  title: {
    ko: string
    en: string
  }
  description: {
    ko: string
    en: string
  }
  minScore: {
    bronze: number
    silver: number
    gold: number
  }
  validationType: 'diversity' | 'count' | 'score' | 'complex'
  specialSetup?: string // Challenge #7의 경우
}

export interface GameState {
  phase: GamePhase
  challengeId: number | null
  difficulty: Difficulty | null
  automaDeck: AutomaCard[]
  automaDiscard: AutomaCard[]
  currentAutomaCard: AutomaCard | null
  round: number
  actionHistory: ActionLog[]
  startTime: string | null
}

export interface ActionLog {
  id: string
  timestamp: string
  cardId: number
  action: {
    add: number
    remove: number
    direction: RemoveDirection
    burn: boolean
  }
}

export interface GameHistory {
  id: string
  date: string
  challengeId: number
  difficulty: Difficulty
  score: number
  goalMet: boolean
  isVictory: boolean
  note?: string
  certificateImage?: string // Base64 인코딩된 이미지
}

export interface ScoreInput {
  totalScore: number
  moors: number
  blackTailedGodwits: number
  dartmoorPonies: number
  goalMet: boolean
}

