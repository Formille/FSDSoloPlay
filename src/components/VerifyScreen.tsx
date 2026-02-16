import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import jsQR from 'jsqr'
import { decompress } from '../services/verification'
import { VerificationData } from '../types'
import { challenges, getChallengeById } from '../data/challenges'
import { MissionResultThumbnail } from './MissionResultThumbnail'

interface VerifyScreenProps {
  onBack: () => void
}

type ScanMode = 'camera' | 'image'

export function VerifyScreen({ onBack }: VerifyScreenProps) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'ko' | 'en'
  const [mode, setMode] = useState<ScanMode | null>(null)
  const [result, setResult] = useState<VerificationData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationRef = useRef<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  useEffect(() => {
    return () => stopCamera()
  }, [stopCamera])

  const handleDecode = useCallback((data: string) => {
    try {
      const decoded = decompress(data)
      if (decoded?.r?.length && Array.isArray(decoded.r)) {
        setResult(decoded)
        setError(null)
        setScanning(false)
        stopCamera()
      } else {
        setError(t('verify.invalidQR'))
      }
    } catch {
      setError(t('verify.invalidQR'))
    }
  }, [t, stopCamera])

  const scanFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !streamRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height)
      if (code) {
        handleDecode(code.data)
        return
      }
    }
    animationRef.current = requestAnimationFrame(scanFrame)
  }, [handleDecode])

  const startCamera = async () => {
    setMode('camera')
    setResult(null)
    setError(null)
    setScanning(true)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 } }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        scanFrame()
      }
    } catch (err) {
      setError(t('verify.cameraError'))
      setScanning(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setMode('image')
    setResult(null)
    setError(null)

    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height)
      if (code) {
        handleDecode(code.data)
      } else {
        setError(t('verify.noQRFound'))
      }
    }
    img.onerror = () => setError(t('verify.invalidImage'))
    img.src = URL.createObjectURL(file)
    e.target.value = ''
  }

  const reset = () => {
    setMode(null)
    setResult(null)
    setError(null)
    setScanning(false)
    stopCamera()
  }

  const medalLabel = (code: number) => {
    if (code === 0) return lang === 'ko' ? '실패' : 'Fail'
    const labels = lang === 'ko' ? ['', '동메달', '은메달', '금메달'] : ['', 'Bronze', 'Silver', 'Gold']
    return labels[code] ?? ''
  }

  return (
    <div className="min-h-screen bg-forest-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-forest-800">
            {t('verify.title')}
          </h1>
          <button
            onClick={onBack}
            className="text-forest-600 hover:text-forest-800 font-medium"
          >
            {t('common.back')}
          </button>
        </div>

        {!mode && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={startCamera}
              className="card p-8 flex flex-col items-center gap-4 hover:border-forest-500 transition-colors"
            >
              <span className="text-5xl">📷</span>
              <h2 className="text-xl font-semibold text-forest-800">
                {t('verify.cameraScan')}
              </h2>
              <p className="text-forest-600 text-sm text-center">
                {t('verify.cameraScanDesc')}
              </p>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="card p-8 flex flex-col items-center gap-4 hover:border-forest-500 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <span className="text-5xl">🖼️</span>
              <h2 className="text-xl font-semibold text-forest-800">
                {t('verify.imageUpload')}
              </h2>
              <p className="text-forest-600 text-sm text-center">
                {t('verify.imageUploadDesc')}
              </p>
            </button>
          </div>
        )}

        {mode === 'camera' && scanning && (
          <div className="card overflow-hidden">
            <div className="relative aspect-video bg-black">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute inset-0 border-4 border-forest-400 border-dashed rounded-lg pointer-events-none" />
            </div>
            <p className="p-4 text-center text-forest-600">
              {t('verify.scanningHint')}
            </p>
            <button
              onClick={reset}
              className="w-full py-2 btn-secondary"
            >
              {t('verify.cancelScan')}
            </button>
          </div>
        )}

        {error && (
          <div className="card p-4 bg-moor-100 border-2 border-moor-400 text-moor-800 mb-4">
            {error}
          </div>
        )}

        {result && (() => {
          const TOTAL_CHALLENGES = challenges.length
          const clearedChallengeIds = new Set(
            result.r.filter(rec => rec.c[2] > 0).map(rec => rec.c[0])
          )
          const clearedCount = clearedChallengeIds.size
          const totalPlayTime = result.r.reduce((sum, rec) => sum + rec.d, 0)
          const avgScore = result.r.length > 0
            ? Math.round(result.r.reduce((sum, rec) => sum + rec.c[1], 0) / result.r.length)
            : 0
          const avgPlayTime = result.r.length > 0
            ? Math.round(totalPlayTime / result.r.length)
            : 0
          const formatDuration = (sec: number) =>
            `${Math.floor(sec / 60)}${lang === 'ko' ? '분 ' : ` ${t('verify.minutes')} `}${sec % 60}${lang === 'ko' ? '초' : ` ${t('verify.seconds')}`}`

          return (
          <div className="card space-y-6">
            <h2 className="text-2xl font-bold text-forest-800 border-b pb-4">
              {t('verify.resultTitle')}
            </h2>
            <div className="flex items-center gap-3 flex-wrap">
              <div>
                <p className="text-forest-600 mb-1">{t('verify.player')}</p>
                <p className="text-xl font-semibold text-forest-800">
                  {result.p || t('verify.anonymous')}
                </p>
              </div>
              <span className="text-forest-500 font-medium px-3 py-1 bg-forest-100 rounded-lg">
                {t('verify.clearedChallenges', { count: clearedCount, total: TOTAL_CHALLENGES })}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-forest-50 rounded-lg border border-forest-200">
              <div>
                <p className="text-forest-600 text-sm">{t('verify.totalPlays')}</p>
                <p className="font-semibold text-forest-800">{result.r.length}</p>
              </div>
              <div>
                <p className="text-forest-600 text-sm">{t('verify.totalPlayTime')}</p>
                <p className="font-semibold text-forest-800">{formatDuration(totalPlayTime)}</p>
              </div>
              <div>
                <p className="text-forest-600 text-sm">{t('verify.avgScore')}</p>
                <p className="font-semibold text-forest-800">{avgScore}</p>
              </div>
              <div>
                <p className="text-forest-600 text-sm">{t('verify.avgPlayTime')}</p>
                <p className="font-semibold text-forest-800">{formatDuration(avgPlayTime)}</p>
              </div>
            </div>
            <div>
              <p className="text-forest-600 mb-2">{t('verify.records')}</p>
              <div className="overflow-x-auto rounded-lg border border-forest-200">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-forest-100 border-b border-forest-200">
                      <th className="px-4 py-3 font-semibold text-forest-800 w-16">
                        {lang === 'ko' ? '' : ''}
                      </th>
                      <th className="px-4 py-3 font-semibold text-forest-800">
                        {lang === 'ko' ? '도전과제' : 'Challenge'}
                      </th>
                      <th className="px-4 py-3 font-semibold text-forest-800">
                        {t('scoring.score')}
                      </th>
                      <th className="px-4 py-3 font-semibold text-forest-800">
                        {t('verify.medal')}
                      </th>
                      <th className="px-4 py-3 font-semibold text-forest-800">
                        {t('verify.duration')}
                      </th>
                      <th className="px-4 py-3 font-semibold text-forest-800">
                        {t('verify.playedAt')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.r.map((rec, i) => {
                      const challenge = getChallengeById(rec.c[0])
                      return (
                        <tr
                          key={i}
                          className="border-b border-forest-100 last:border-b-0 hover:bg-forest-50/50"
                        >
                          <td className="px-2 py-2 align-middle">
                            <MissionResultThumbnail
                              missionId={rec.c[0]}
                              medalCode={rec.c[2]}
                              width={64}
                              height={48}
                            />
                          </td>
                          <td className="px-4 py-3 text-forest-800 font-medium">
                            {challenge
                              ? `${challenge.id}. ${challenge.title[lang]}`
                              : `Challenge ${rec.c[0]}`}
                          </td>
                          <td className="px-4 py-3 text-forest-700">
                            {rec.c[1]}
                          </td>
                          <td className="px-4 py-3 text-forest-700">
                            {medalLabel(rec.c[2])}
                            {rec.c[2] > 0 && ` ${['', '🥉', '🥈', '🥇'][rec.c[2]]}`}
                          </td>
                          <td className="px-4 py-3 text-forest-700">
                            {Math.floor(rec.d / 60)}{lang === 'ko' ? '분 ' : ` ${t('verify.minutes')} `}{rec.d % 60}{lang === 'ko' ? '초' : ` ${t('verify.seconds')}`}
                          </td>
                          <td className="px-4 py-3 text-forest-700 text-sm">
                            {new Date(rec.t * 1000).toLocaleString(lang === 'ko' ? 'ko-KR' : 'en-US')}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <button
              onClick={reset}
              className="btn-primary w-full"
            >
              {t('verify.scanAnother')}
            </button>
          </div>
          )
        })()}
      </div>
    </div>
  )
}
