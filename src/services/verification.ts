import pako from 'pako'
import QRCode from 'qrcode'
import { GameHistory, Difficulty, VerificationData, VerificationRecord } from '../types'

const GAME_CODE = 'FS_D'

/** Difficulty → 메달 코드: 0=실패 1=동 2=은 3=금 */
function medalToCode(medal: Difficulty | null, isVictory: boolean): number {
  if (!isVictory || !medal) return 0
  return medal === 'bronze' ? 1 : medal === 'silver' ? 2 : 3
}

// GameHistory를 VerificationData의 단일 기록으로 변환
export function historyToVerificationRecord(
  history: GameHistory,
  language: 'ko' | 'en'
): VerificationData {
  const record: VerificationRecord = {
    t: history.completedAt ?? Math.floor(new Date(history.date).getTime() / 1000),
    d: history.duration ?? 0,
    c: [history.challengeId, history.score, medalToCode(history.difficulty, history.isVictory)]
  }

  return {
    p: history.playerName ?? '',
    l: language,
    g: GAME_CODE,
    r: [record]
  }
}

// 여러 기록을 하나의 VerificationData로
export function historiesToVerificationData(
  histories: GameHistory[],
  playerName: string,
  language: 'ko' | 'en'
): VerificationData {
  const record: VerificationRecord[] = histories.map(h => ({
    t: h.completedAt ?? Math.floor(new Date(h.date).getTime() / 1000),
    d: h.duration ?? 0,
    c: [h.challengeId, h.score, medalToCode(h.difficulty, h.isVictory)]
  }))

  return {
    p: playerName,
    l: language,
    g: GAME_CODE,
    r: record
  }
}

// gzip 압축 → base64
export function compress(data: VerificationData): string {
  const json = JSON.stringify(data)
  const compressed = pako.gzip(new TextEncoder().encode(json))
  return btoa(String.fromCharCode(...compressed))
}

// base64 → gzip decompress → JSON
export function decompress(base64: string): VerificationData {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  const decompressed = pako.ungzip(bytes, { to: 'string' })
  return JSON.parse(decompressed) as VerificationData
}

// VerificationData → 압축 → QR Code Data URL
export async function encodeToQRDataUrl(data: VerificationData): Promise<string> {
  const compressed = compress(data)
  return QRCode.toDataURL(compressed, {
    errorCorrectionLevel: 'M',
    margin: 2,
    width: 200,
    color: { dark: '#1f3a0f', light: '#ffffff' }
  })
}
