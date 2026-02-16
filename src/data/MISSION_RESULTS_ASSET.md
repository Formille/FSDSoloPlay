# 미션 결과 이미지 에셋 (스프라이트 시트)

## 개요

게임 종료 시 성공/실패에 따라 표시할 미션 결과 이미지들을 하나의 스프라이트 시트로 통합한 에셋입니다.

## 파일 구성

| 파일 | 설명 |
|------|------|
| `mission_results_sprite.webp` | 통합 스프라이트 시트 이미지 (4열 × 15행, WebP) |
| `mission_results_atlas.json` | 각 프레임의 좌표·크기 정보 (아틀라스) |
| `build_sprite_sheet.py` | 원본 이미지에서 스프라이트 시트를 생성하는 빌드 스크립트 |
| `scripts/extract_bronze_thumbnails.py` | 스프라이트에서 프레임 추출 → `public/mission_thumbnails/` (WebP, 미션 선택 화면용) |

## 네이밍 규칙 (원본 X_Y.png)

- **X**: 미션 번호 (1~15)
- **Y**: 결과 타입
  - `0` = 실패 (fail)
  - `1` = 동메달 (bronze)
  - `2` = 은메달 (silver)
  - `3` = 금메달 (gold)

## 스프라이트 시트 레이아웃

```
        열0(실패)  열1(동)   열2(은)   열3(금)
행1    1_0        1_1       1_2       1_3
행2    2_0        2_1       2_2       2_3
...
행15   15_0       15_1      15_2      15_3
```

- **열**: 결과 타입 (0→1→2→3)
- **행**: 미션 번호 (1~15)
- **셀 크기**: 800×597 px (원본 2400×1792의 1/3 리사이즈)

## 게임에서 사용하기

### 1. 아틀라스 JSON 파싱

```javascript
// 예: mission=3, 성공 시 금메달(3) 표시
const key = `3_gold`;  // 또는 실패 시 `3_fail`
const frame = atlas.frames[key];
// frame: { x, y, w, h, mission, result, result_name }
```

### 2. 결과에 따른 키 생성

```javascript
function getResultKey(mission, success, medalLevel) {
  if (!success) return `${mission}_fail`;
  const names = { 1: 'bronze', 2: 'silver', 3: 'gold' };
  return `${mission}_${names[medalLevel]}`;
}
```

### 3. Canvas/WebGL에서 잘라서 그리기

```javascript
// Canvas 2D 예시
ctx.drawImage(
  spriteSheet,
  frame.x, frame.y, frame.w, frame.h,  // 소스 영역
  0, 0, frame.w, frame.h               // 대상 영역
);
```

## 빌드 방법

원본 `X_Y.png` 파일들이 같은 폴더에 있을 때:

```bash
pip install Pillow
python build_sprite_sheet.py
```

### 옵션 조정

`build_sprite_sheet.py` 상단에서 다음 값을 변경할 수 있습니다.

- `TARGET_WIDTH`: 출력 셀 너비 (기본 800, 작게 하면 파일 크기 감소)
- `QUALITY`: PNG 저장 품질 (현재 미사용, 향후 JPEG/WebP 지원 시 활용)

## 압축 효과

- **원본**: 60개 PNG (약 8~11 MB/개) → 총 약 600 MB
- **통합 후**: 1개 스프라이트 시트 WebP (약 9 MB) + 아틀라스 JSON
- **리사이즈**: 2400×1792 → 800×597 (면적 약 1/9)

## 라이선스·저작권

원본 이미지의 저작권·라이선스에 따릅니다.
