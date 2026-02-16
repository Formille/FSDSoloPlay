#!/usr/bin/env python3
"""
스프라이트 시트에서 미션 결과 프레임을 추출하여 썸네일로 저장합니다.
- fail, bronze, silver, gold 4종 × 15미션 = 60개
- {id}.png = bronze (기본/미션선택용), {id}_fail.png, {id}_silver.png, {id}_gold.png
"""
import json
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Pillow가 필요합니다: pip install Pillow")
    exit(1)

# 경로 설정
ROOT = Path(__file__).resolve().parent.parent
SPRITE_PATH = ROOT / "public" / "mission_results_sprite.png"
ATLAS_PATH = ROOT / "src" / "data" / "mission_results_atlas.json"
OUTPUT_DIR = ROOT / "public" / "mission_thumbnails"

# 썸네일 크기: 원본 스프라이트 프레임(800×597) 그대로 사용 → 고해상도
THUMB_WIDTH = 800
THUMB_HEIGHT = 597

RESULT_SUFFIXES = ["fail", "bronze", "silver", "gold"]


def main():
    if not SPRITE_PATH.exists():
        # src/data에 있으면 복사 후 사용
        alt = ROOT / "src" / "data" / "mission_results_sprite.png"
        if alt.exists():
            import shutil
            SPRITE_PATH.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy(alt, SPRITE_PATH)
            print(f"스프라이트를 public으로 복사했습니다.")
        else:
            print(f"스프라이트를 찾을 수 없습니다: {SPRITE_PATH}")
            exit(1)

    atlas = json.loads(ATLAS_PATH.read_text(encoding="utf-8"))
    img = Image.open(SPRITE_PATH).convert("RGBA")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for mission_id in range(1, 16):
        for suffix in RESULT_SUFFIXES:
            key = f"{mission_id}_{suffix}"
            frame = atlas.get("frames", {}).get(key)
            if not frame:
                print(f"경고: {key} 프레임 없음")
                continue

            x, y, w, h = frame["x"], frame["y"], frame["w"], frame["h"]
            crop = img.crop((x, y, x + w, y + h))
            if (w, h) != (THUMB_WIDTH, THUMB_HEIGHT):
                crop = crop.resize((THUMB_WIDTH, THUMB_HEIGHT), Image.Resampling.LANCZOS)

            filename = f"{mission_id}.png" if suffix == "bronze" else f"{mission_id}_{suffix}.png"
            out_path = OUTPUT_DIR / filename
            crop.save(out_path, "PNG", optimize=True)
        print(f"저장: 미션 {mission_id} (fail, bronze, silver, gold)")

    print(f"\n완료: {OUTPUT_DIR}에 60개 썸네일 생성")


if __name__ == "__main__":
    main()
