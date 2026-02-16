#!/usr/bin/env node
/**
 * PWA 아이콘 생성 (192x192, 512x512)
 * sharp 패키지 필요: npm install sharp --save-dev
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, '..', 'public', 'icons')
const THEME_COLOR = { r: 45, g: 80, b: 22 } // #2d5016

async function main() {
  let sharp
  try {
    sharp = (await import('sharp')).default
  } catch {
    console.error('sharp 패키지가 필요합니다: npm install sharp --save-dev')
    process.exit(1)
  }

  fs.mkdirSync(OUT_DIR, { recursive: true })

  for (const size of [192, 512]) {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <rect width="${size}" height="${size}" fill="rgb(${THEME_COLOR.r},${THEME_COLOR.g},${THEME_COLOR.b})"/>
        <text x="50%" y="50%" font-family="Arial" font-size="${size/4}" font-weight="bold" fill="white" text-anchor="middle" dy=".35em">FS</text>
      </svg>
    `
    const outPath = path.join(OUT_DIR, `icon-${size}x${size}.png`)
    await sharp(Buffer.from(svg))
      .png()
      .toFile(outPath)
    console.log('생성:', outPath)
  }
  console.log('완료: public/icons/')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
