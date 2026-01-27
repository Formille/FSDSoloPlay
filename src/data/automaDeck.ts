import { AutomaCard } from '../types'
import { shuffle } from '../utils/shuffle'

/**
 * 오토마 덱 생성 함수
 * 총 20장의 카드를 생성합니다.
 */
export function generateAutomaDeck(): AutomaCard[] {
  const cards: AutomaCard[] = []
  
  // 새로운 분포에 따른 카드 생성
  let cardId = 1
  
  // 1. 3장 추가 : 2장
  for (let i = 0; i < 2; i++) {
    cards.push({
      id: cardId++,
      addCount: 3,
      removeCount: 0,
      removeDirection: 'left_to_right', // removeCount가 0이므로 방향은 의미 없음
      burnTopCard: true
    })
  }
  
  // 2. 3장 추가 + 더미에서 1장 제거 : 2장 (더미에서 제거하므로 방향 불필요)
  for (let i = 0; i < 2; i++) {
    cards.push({
      id: cardId++,
      addCount: 3,
      removeCount: 1,
      removeDirection: 'left_to_right', // 더미에서 제거하므로 방향은 의미 없음
      burnTopCard: true
    })
  }
  
  // 3. 2장 추가 : 2장
  for (let i = 0; i < 2; i++) {
    cards.push({
      id: cardId++,
      addCount: 2,
      removeCount: 0,
      removeDirection: 'left_to_right', // removeCount가 0이므로 방향은 의미 없음
      burnTopCard: true
    })
  }
  
  // 4. 1장 추가 + 더미에서 2장 제거 : 2장 (더미에서 제거하므로 방향 불필요)
  for (let i = 0; i < 2; i++) {
    cards.push({
      id: cardId++,
      addCount: 1,
      removeCount: 2,
      removeDirection: 'left_to_right', // 더미에서 제거하므로 방향은 의미 없음
      burnTopCard: true
    })
  }
  
  // 5. 공터 왼쪽에서부터 2장 제거 : 1장 (더미에서 제거하지 않음)
  cards.push({
    id: cardId++,
    addCount: 0,
    removeCount: 2,
    removeDirection: 'left_to_right',
    burnTopCard: false
  })
  
  // 6. 공터 오른쪽에서부터 2장 제거 : 1장 (더미에서 제거하지 않음)
  cards.push({
    id: cardId++,
    addCount: 0,
    removeCount: 2,
    removeDirection: 'right_to_left',
    burnTopCard: false
  })
  
  // 7. 공터 왼쪽에서부터 3장 제거 : 1장 (더미에서 제거하지 않음)
  cards.push({
    id: cardId++,
    addCount: 0,
    removeCount: 3,
    removeDirection: 'left_to_right',
    burnTopCard: false
  })
  
  // 8. 공터 오른쪽에서부터 3장 제거 : 1장 (더미에서 제거하지 않음)
  cards.push({
    id: cardId++,
    addCount: 0,
    removeCount: 3,
    removeDirection: 'right_to_left',
    burnTopCard: false
  })
  
  // 9. 공터 왼쪽에서부터 3장 제거 + 더미에서 1장 제거: 1장
  cards.push({
    id: cardId++,
    addCount: 0,
    removeCount: 3,
    removeDirection: 'left_to_right',
    burnTopCard: true
  })
  
  // 10. 공터 오른쪽에서부터 3장 제거 + 더미에서 1장 제거: 1장
  cards.push({
    id: cardId++,
    addCount: 0,
    removeCount: 3,
    removeDirection: 'right_to_left',
    burnTopCard: true
  })
  
  // 11. 공터 왼쪽에서부터 1장 제거 + 더미에서 1장 제거: 3장
  for (let i = 0; i < 3; i++) {
    cards.push({
      id: cardId++,
      addCount: 0,
      removeCount: 1,
      removeDirection: 'left_to_right',
      burnTopCard: true
    })
  }
  
  // 12. 공터 오른쪽에서부터 1장 제거 + 더미에서 1장 제거: 3장
  for (let i = 0; i < 3; i++) {
    cards.push({
      id: cardId++,
      addCount: 0,
      removeCount: 1,
      removeDirection: 'right_to_left',
      burnTopCard: true
    })
  }
  
  // 셔플하여 반환
  return shuffle(cards)
}

/**
 * 오토마 덱 재생성 (버려진 카드로부터)
 */
export function regenerateAutomaDeck(discard: AutomaCard[]): AutomaCard[] {
  return shuffle(discard)
}

