import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { GameState, GamePhase, Difficulty, AutomaCard, ActionLog } from '../types'
import { initializeGame, getNextAutomaCard, processAutomaAction } from '../services/gameLogic'

interface GameStore extends GameState {
  // Actions
  startGame: (challengeId: number) => void
  nextAction: (clearingCardCount?: number) => void
  endGame: () => void
  resetGame: () => void
  addActionLog: (log: ActionLog) => void
  setPhase: (phase: GamePhase) => void
}

const initialState: GameState = {
  phase: 'setup',
  challengeId: null,
  difficulty: null,
  automaDeck: [],
  automaDiscard: [],
  currentAutomaCard: null,
  round: 1,
  actionHistory: [],
  startTime: null
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      startGame: (challengeId: number) => {
        const gameInit = initializeGame()
        set({
          phase: 'playing',
          challengeId,
          difficulty: null,
          startTime: new Date().toISOString(),
          ...gameInit
        })
      },

      nextAction: (clearingCardCount: number = 0) => {
        const state = get()
        if (!state.currentAutomaCard) return

        // 현재 카드 처리
        const log = processAutomaAction(state.currentAutomaCard, clearingCardCount)
        
        // 다음 카드 가져오기
        const { card, newDeck, newDiscard } = getNextAutomaCard(
          state.automaDeck,
          state.automaDiscard
        )

        // 라운드 증가 (덱이 재생성될 때)
        let newRound = state.round
        if (state.automaDeck.length === 0 && state.automaDiscard.length > 0) {
          newRound += 1
        }

        set({
          currentAutomaCard: card,
          automaDeck: newDeck,
          automaDiscard: newDiscard,
          round: newRound,
          actionHistory: [...state.actionHistory, log]
        })
      },

      endGame: () => {
        set({
          phase: 'scoring'
        })
      },

      resetGame: () => {
        set({
          ...initialState,
          startTime: null
        })
      },

      addActionLog: (log: ActionLog) => {
        set(state => ({
          actionHistory: [...state.actionHistory, log]
        }))
      },

      setPhase: (phase: GamePhase) => {
        set({ phase })
      }
    }),
    {
      name: 'dartmoor-game-storage',
      partialize: (state) => ({
        phase: state.phase,
        challengeId: state.challengeId,
        difficulty: state.difficulty,
        automaDeck: state.automaDeck,
        automaDiscard: state.automaDiscard,
        currentAutomaCard: state.currentAutomaCard,
        round: state.round,
        actionHistory: state.actionHistory,
        startTime: state.startTime
      })
    }
  )
)

