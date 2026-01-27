import { Challenge } from '../types'

export const challenges: Challenge[] = [
  {
    id: 1,
    title: {
      ko: '잠자리 연못',
      en: 'Water Stripper'
    },
    description: {
      ko: '서로 다른 잠자리(Dragonfly) 종 5개 모두 보유',
      en: 'Have all 5 different dragonfly species in your forest.'
    },
    minScore: {
      bronze: 200,
      silver: 250,
      gold: 300
    },
    validationType: 'diversity'
  },
  {
    id: 2,
    title: {
      ko: '습지 보호구역',
      en: 'Mire Protection'
    },
    description: {
      ko: '습지(Moor) 카드 최소 10장 보유',
      en: 'Have at least 10 moors in your forest.'
    },
    minScore: {
      bronze: 200,
      silver: 250,
      gold: 300
    },
    validationType: 'count'
  },
  {
    id: 3,
    title: {
      ko: '나무 위 합창단',
      en: 'Treetop Dwellers'
    },
    description: {
      ko: '서로 다른 새(Bird) 종 최소 8개 보유',
      en: 'Have at least 8 different bird species in your forest.'
    },
    minScore: {
      bronze: 175,
      silver: 225,
      gold: 275
    },
    validationType: 'diversity'
  },
  {
    id: 4,
    title: {
      ko: '숲의 발자국',
      en: 'Paw Prints'
    },
    description: {
      ko: '발바닥(Paw) 아이콘 동물 최소 14마리 보유',
      en: 'Have at least 14 pawed animals in your forest.'
    },
    minScore: {
      bronze: 225,
      silver: 300,
      gold: 375
    },
    validationType: 'count'
  },
  {
    id: 5,
    title: {
      ko: '밤의 비행사',
      en: 'Forest Gliders'
    },
    description: {
      ko: '박쥐(Bat) 최소 7마리 보유',
      en: 'Have at least 7 bats in your forest.'
    },
    minScore: {
      bronze: 200,
      silver: 250,
      gold: 300
    },
    validationType: 'count'
  },
  {
    id: 6,
    title: {
      ko: '보석 같은 습지',
      en: 'Precious Moor'
    },
    description: {
      ko: '단일 습지(Moor) 하나에서 최소 20점 획득',
      en: 'Score at least 20 points from a single moor in your forest.'
    },
    minScore: {
      bronze: 250,
      silver: 325,
      gold: 400
    },
    validationType: 'score'
  },
  {
    id: 7,
    title: {
      ko: '살무사의 자취',
      en: 'Reptile Trail'
    },
    description: {
      ko: '숲에 있는 살무사 한 장으로 최소 10점 획득',
      en: 'Score at least 10 points from an Adder in your forest.'
    },
    minScore: {
      bronze: 225,
      silver: 275,
      gold: 325
    },
    validationType: 'score',
    specialSetup: '무작위 살무사 카드 1장을 손에 들고 게임 시작'
  },
  {
    id: 8,
    title: {
      ko: '생명의 터전',
      en: 'Species Grove'
    },
    description: {
      ko: '서로 다른 나무, 관목, 지형 종류 합계 11개 이상',
      en: 'Have at least 11 different trees, shrubs, and terrains in your forest.'
    },
    minScore: {
      bronze: 200,
      silver: 250,
      gold: 300
    },
    validationType: 'diversity'
  },
  {
    id: 9,
    title: {
      ko: '숲의 작은 주인',
      en: 'Crawler'
    },
    description: {
      ko: '곤충 최소 10마리 보유',
      en: 'Have at least 10 insects in your forest.'
    },
    minScore: {
      bronze: 200,
      silver: 250,
      gold: 300
    },
    validationType: 'count'
  },
  {
    id: 10,
    title: {
      ko: '물가의 생명들',
      en: 'Forest Spawners'
    },
    description: {
      ko: '양서류 최소 6마리 보유',
      en: 'Have at least 6 amphibians in your forest.'
    },
    minScore: {
      bronze: 200,
      silver: 275,
      gold: 350
    },
    validationType: 'count'
  },
  {
    id: 11,
    title: {
      ko: '초록빛 덤불',
      en: 'Plant Grove'
    },
    description: {
      ko: '식물 최소 12개 보유',
      en: 'Have at least 12 plants in your forest.'
    },
    minScore: {
      bronze: 200,
      silver: 275,
      gold: 350
    },
    validationType: 'count'
  },
  {
    id: 12,
    title: {
      ko: '발굽 소리',
      en: 'Hoof Prints'
    },
    description: {
      ko: '굽이 있는 동물 최소 6마리 보유',
      en: 'Have at least 6 cloven-hoofed animals in your forest.'
    },
    minScore: {
      bronze: 200,
      silver: 250,
      gold: 300
    },
    validationType: 'count'
  },
  {
    id: 13,
    title: {
      ko: '생쥐 마을',
      en: 'Mice Grove'
    },
    description: {
      ko: '쥐 최소 8마리 보유',
      en: 'Have at least 8 mice in your forest.'
    },
    minScore: {
      bronze: 200,
      silver: 275,
      gold: 350
    },
    validationType: 'count'
  },
  {
    id: 14,
    title: {
      ko: '아늑한 은신처',
      en: 'Cave Hideout'
    },
    description: {
      ko: '동굴에 카드 최소 15장 보유',
      en: 'Have at least 15 cards in your cave.'
    },
    minScore: {
      bronze: 150,
      silver: 200,
      gold: 250
    },
    validationType: 'count'
  },
  {
    id: 15,
    title: {
      ko: '새들의 낙원',
      en: 'Winged Kingdom'
    },
    description: {
      ko: '모든 나무, 관목, 습지에 새가 최소 2마리씩 배치됨',
      en: 'Have at least 2 birds on every tree, bush, and moor.'
    },
    minScore: {
      bronze: 150,
      silver: 200,
      gold: 250
    },
    validationType: 'complex'
  }
]

export const getChallengeById = (id: number): Challenge | undefined => {
  return challenges.find(challenge => challenge.id === id)
}

