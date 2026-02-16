import { GameHistory } from '../types'
import { getChallengeById } from '../data/challenges'
import { historiesToVerificationData, encodeToQRDataUrl } from './verification'
import { getGameHistory } from './history'

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Image load failed: ${src}`))
    img.src = src
  })
}

function getMissionImageUrl(history: GameHistory): string {
  const id = history.challengeId
  const suffix = history.isVictory ? history.difficulty : 'fail'
  return suffix === 'bronze'
    ? `/mission_thumbnails/${id}.webp`
    : `/mission_thumbnails/${id}_${suffix}.webp`
}

/**
 * Canvas API를 사용한 인증 이미지 생성 (미션 이미지 배경 + QR 포함)
 */
export function generateCertificate(
  history: GameHistory,
  language: 'ko' | 'en' = 'ko'
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const canvas = document.createElement('canvas')
    canvas.width = 1200
    canvas.height = 800
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      reject(new Error('Canvas context not available'))
      return
    }

    const W = canvas.width
    const H = canvas.height

    try {
      // 1. 배경: 미션+메달 이미지 (캔버스에 맞게 cover)
      const bgUrl = getMissionImageUrl(history)
      const bgImg = await loadImage(bgUrl)

      const imgAspect = bgImg.width / bgImg.height
      const canvasAspect = W / H
      let sx = 0, sy = 0, sw = bgImg.width, sh = bgImg.height
      if (imgAspect > canvasAspect) {
        sw = bgImg.height * canvasAspect
        sx = (bgImg.width - sw) / 2
      } else {
        sh = bgImg.width / canvasAspect
        sy = (bgImg.height - sh) / 2
      }
      ctx.drawImage(bgImg, sx, sy, sw, sh, 0, 0, W, H)

      // 2. 텍스트 영역 어두운 오버레이 (하단 ~30%만, 이미지가 덜 어두워지도록)
      const overlayTop = H * 0.7
      const overlayGradient = ctx.createLinearGradient(0, overlayTop, 0, H)
      overlayGradient.addColorStop(0, 'rgba(0,0,0,0.15)')
      overlayGradient.addColorStop(0.4, 'rgba(0,0,0,0.55)')
      overlayGradient.addColorStop(1, 'rgba(0,0,0,0.8)')
      ctx.fillStyle = overlayGradient
      ctx.fillRect(0, overlayTop, W, H - overlayTop)

      // 3. 상단 좌측: 도전 성공/실패 (테두리+그림자)
      const successFailText = history.isVictory
        ? (language === 'ko' ? '도전 성공' : 'Challenge Success')
        : (language === 'ko' ? '도전 실패' : 'Challenge Failed')
      ctx.font = 'bold 28px Arial'
      ctx.textAlign = 'left'
      ctx.strokeStyle = 'rgba(0,0,0,0.7)'
      ctx.lineWidth = 4
      ctx.strokeText(successFailText, 40, 50)
      ctx.shadowColor = 'rgba(0,0,0,0.5)'
      ctx.shadowBlur = 6
      ctx.shadowOffsetX = 2
      ctx.shadowOffsetY = 2
      ctx.fillStyle = history.isVictory ? '#86efac' : '#fca5a5'
      ctx.fillText(successFailText, 40, 50)
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0

      // 4. 상단 우측: 메달 이모티콘 (상단·우측 간격 동일)
      const medalEmoji = history.isVictory
        ? { bronze: '🥉', silver: '🥈', gold: '🥇' }[history.difficulty]
        : '❌'
      const cornerGap = 70
      ctx.font = '64px Arial'
      ctx.textAlign = 'right'
      ctx.fillText(medalEmoji, W - cornerGap, cornerGap)

      // 5. 최하단 좌측: 미션 명 / XXX점 / YYYY년 MM월 DD일 - h시간 m분 플레이
      const challenge = getChallengeById(history.challengeId)
      const missionName = challenge
        ? `${challenge.id}. ${challenge.title[language]}`
        : `Challenge ${history.challengeId}`

      const durationSec = history.duration ?? 0
      const hours = Math.floor(durationSec / 3600)
      const minutes = Math.floor((durationSec % 3600) / 60)
      const durationStr =
        language === 'ko'
          ? `${hours}시간 ${minutes}분 플레이`
          : `${hours}h ${minutes}m played`

      const date = new Date(history.completedAt ? history.completedAt * 1000 : history.date)
      const formattedDate =
        language === 'ko'
          ? `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
          : `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`

      const line1 = missionName
      const line2 = `${medalEmoji} ${history.score}점`
      const line3 = `${formattedDate} - ${durationStr}`

      const leftX = 48
      const lineHeight = 42
      const bottomPadding = 48
      let y = H - bottomPadding

      ctx.textAlign = 'left'
      ctx.fillStyle = '#ffffff'

      ctx.font = '26px Arial'
      ctx.fillText(line3, leftX, y)
      y -= lineHeight

      ctx.font = 'bold 28px Arial'
      ctx.fillText(line2, leftX, y)
      y -= lineHeight

      ctx.font = 'bold 32px Arial'
      ctx.fillText(line1, leftX, y)

      // 6. QR 코드 (우측 하단)
      const allHistories = getGameHistory()
      const toTimestamp = (h: GameHistory) =>
        h.completedAt ?? Math.floor(new Date(h.date).getTime() / 1000)
      const sortedHistories = [...allHistories].sort(
        (a, b) => toTimestamp(a) - toTimestamp(b)
      )
      const verificationData = historiesToVerificationData(
        sortedHistories,
        history.playerName ?? '',
        language
      )
      const qrDataUrl = await encodeToQRDataUrl(verificationData)

      const qrSize = 140
      const qrX = W - qrSize - 32
      const qrY = H - qrSize - 32

      const qrImg = await loadImage(qrDataUrl)
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)

      const dataUrl = canvas.toDataURL('image/png')
      resolve(dataUrl)
    } catch (error) {
      reject(error)
    }
  })
}
