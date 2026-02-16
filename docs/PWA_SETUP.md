# PWA 설치 가이드

## 현재 구성 상태

### ✅ 완료된 항목

| 항목 | 상태 | 비고 |
|------|------|------|
| **vite-plugin-pwa** | ✅ | VitePWA 플러그인 적용됨 |
| **manifest** | ✅ | name, short_name, icons, display, theme_color 등 설정 |
| **Service Worker** | ✅ | Workbox 기반, autoUpdate 모드 |
| **아이콘** | ✅ | 192×192, 512×512 (generate-pwa-icons로 생성) |
| **display: standalone** | ✅ | 앱처럼 전체화면 실행 |
| **orientation: portrait** | ✅ | 세로 고정 |
| **Apple 메타 태그** | ✅ | apple-mobile-web-app-capable 등 |
| **theme-color** | ✅ | #2d5016 (숲 녹색) |

### 수정한 항목

- **includeAssets**: 존재하지 않는 `favicon.ico` 제거
- **favicon**: `vite.svg` → `icons/icon-192x192.png`로 변경 (PWA 아이콘과 통일)

---

## PWA 설치 방법

### 1. 빌드 및 배포

```bash
npm run build
npm run preview   # 로컬에서 dist 미리보기
```

### 2. 배포 환경

- **HTTPS 필수**: PWA 설치에는 HTTPS가 필요합니다 (localhost 제외)
- **정적 호스트**: Vercel, Netlify, GitHub Pages 등에 배포 가능

### 3. 설치 절차 (사용자)

**Chrome/Edge (데스크톱)**
- 주소창 오른쪽의 ⊕ 설치 아이콘 클릭
- 또는 메뉴 → "앱 설치" / "앱으로 설치"

**Chrome/Edge (Android)**
- 메뉴 → "홈 화면에 추가" 또는 "앱 설치"

**Safari (iOS)**
- 공유 버튼 → "홈 화면에 추가"

---

## 아이콘 재생성

아이콘을 다시 만들 때:

```bash
npm run generate-pwa-icons
```

---

## 확인 체크리스트

배포 후 다음을 확인하세요:

- [ ] HTTPS로 접속 가능
- [ ] 개발자 도구 → Application → Manifest에서 manifest 로드 확인
- [ ] Application → Service Workers에서 SW 등록 확인
- [ ] Lighthouse PWA 감사 통과
