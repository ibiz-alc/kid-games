# K.2 Quiz (เกม K.2) — Design

วันที่: 2026-07-11
สถานะ: อนุมัติดีไซน์แล้ว

## 1. ภาพรวม

เกมที่ 6 ของ kid-games: ทายคำศัพท์ภาษาอังกฤษระดับชั้น K.2 มี 11 หมวด
ผู้เล่นเลือกหมวดก่อนเล่น เล่นรอบละ 10 ข้อ แต่ละข้อมี 4 ตัวเลือก เก็บดาวสูงสุดแยกรายหมวด (`k2:<category>`)

**11 หมวด:** numbers, colours, shapes, feelings, weather, vegetables, fruits, foods, body, actions, days

## 2. กลไกโจทย์ (สุ่มสลับต่อข้อ)

แต่ละคำมีข้อมูล `{ word, emoji? , hex? }` — โจทย์แต่ละข้อสุ่มโหมด:

- **visual → word:** โชว์ภาพ (emoji หรือช่องสี hex) → ตัวเลือกเป็นคำอังกฤษ 4 คำ
- **audio → image:** พูดคำอังกฤษ (อ่านอัตโนมัติครั้งแรก + ปุ่ม 🔊 เล่นซ้ำ) → ตัวเลือกเป็นภาพ 4 ภาพ
- **audio → word:** (เฉพาะคำที่ไม่มีภาพ เช่นหมวด days) พูดคำ → ตัวเลือกเป็นคำ 4 คำ

กติกา: คำที่ **มีภาพ** สุ่มระหว่าง visual→word และ audio→image; คำที่ **ไม่มีภาพ** ใช้ audio→word เสมอ
หมวด colours เก็บ hex (ช่องสี) แทน emoji เพราะ emoji วงกลมสีแสดงผลไม่สม่ำเสมอ

## 3. ตัวจับเวลา

- แถบเวลานับถอยหลัง ค่าเริ่มต้น 15 วินาที ปรับได้ช่วง 5–30 วินาที (ขั้นละ 5) ด้วยปุ่ม −/+ บนหน้าเลือกหมวด
- เก็บค่าวินาทีที่เลือกไว้ใน localStorage (คีย์ `kid-games:setting:k2-seconds`)
- **โจทย์เสียง:** เริ่มนับเวลาหลังอ่านโจทย์จบ (ใช้ event `onend` ของ speechSynthesis; ถ้าไม่รองรับให้เริ่มนับทันที)
- **โจทย์ภาพ:** เริ่มนับทันที
- **หมดเวลา = ตอบผิด:** ไฮไลต์คำตอบที่ถูก แล้วไปข้อถัดไป (เหมือนตอบผิดปกติ) — ไม่ได้แต้ม
- เมื่อผู้เล่นตอบแล้ว ตัวจับเวลาหยุด

## 4. คะแนน / รอบการเล่น

10 ข้อต่อรอบ ได้แต้มเฉพาะข้อที่ตอบถูก ดาวเกณฑ์เดิม (8-10=⭐⭐⭐, 5-7=⭐⭐, 1-4=⭐)

## 5. สถาปัตยกรรม

แยก engine ใหม่ `K2Engine` (ต่างจาก `QuizEngine` เพราะมีโจทย์เสียง + ตัวจับเวลา + ตัวเลือกเป็นภาพได้)
ใช้ส่วนกลางร่วมกัน: `scoring` (ดาว), `audio` (speak/tone), `storage` (ดาว + setting), `Result`

### หน่วยงาน (units)

- `src/games/k2/types.ts` — ชนิดข้อมูลของเกม K.2
- `src/games/k2/content.ts` — ข้อมูล 11 หมวด (word + emoji/hex)
- `src/games/k2/generate.ts` — `generateK2Question(category)` คืน `K2Question` (มีเทสต์)
- `src/engine/K2Engine.tsx` — คุมรอบ 10 ข้อ, timer, replay, ตรวจ, นับดาว
- `src/components/K2Prompt.tsx` — แสดงโจทย์ (ภาพ emoji/สี หรือปุ่มเสียง 🔊)
- `src/components/K2Choices.tsx` — แสดง 4 ตัวเลือก (คำ หรือ ภาพ)
- `src/components/TimerBar.tsx` — แถบเวลานับถอยหลัง
- `src/components/CategoryPickerK2.tsx` — หน้าเลือกหมวด + ปุ่มปรับวินาที
- แก้ `src/lib/storage.ts` — เพิ่ม `getSetting(key, fallback)` / `setSetting(key, value)` (number)
- แก้ `src/components/Home.tsx` — เพิ่มการ์ด "K.2" 🎓
- แก้ `src/App.tsx` — เพิ่ม screen `k2-category` และ `k2`
- แก้ `src/lib/audio.ts` — เพิ่ม `speak(text, onEnd?)` รับ callback ตอนอ่านจบ (ไม่ทำลาย signature เดิม)

### ชนิดข้อมูล

```ts
export type K2Category =
  | 'numbers' | 'colours' | 'shapes' | 'feelings' | 'weather'
  | 'vegetables' | 'fruits' | 'foods' | 'body' | 'actions' | 'days'

export type K2Item = { word: string; emoji?: string; hex?: string }

export type K2Visual =
  | { kind: 'emoji'; emoji: string }
  | { kind: 'color'; hex: string }

// โจทย์เป็นภาพ หรือเสียง
export type K2Prompt =
  | { kind: 'visual'; visual: K2Visual; speakText: string }
  | { kind: 'audio'; speakText: string }

// ตัวเลือกเป็นคำ หรือภาพ
export type K2Choice = {
  id: string
  correct: boolean
  render: { kind: 'word'; word: string } | { kind: 'image'; visual: K2Visual }
}

export type K2Question = {
  prompt: K2Prompt
  speakText: string          // คำตอบสำหรับอ่านออกเสียงตอนตอบถูก
  choices: K2Choice[]        // 4 ตัวเลือก
}
```

## 6. เนื้อหา 11 หมวด (ค่าเริ่มต้น)

ทุกหมวดมีอย่างน้อย 6 คำเพื่อให้สุ่มตัวลวง 3 ตัวได้เสมอ

- **numbers** (emoji ตัวเลข): 1️⃣ ONE … 🔟 TEN (ใช้ NUMBER_WORDS เดิม; emoji keycap)
- **colours** (hex จาก COLOR_PALETTE เดิม): RED, ORANGE, YELLOW, GREEN, BLUE, PURPLE, PINK, BROWN, BLACK, WHITE
- **shapes**: 🔵 CIRCLE, 🟦 SQUARE, 🔺 TRIANGLE, ⭐ STAR, ❤️ HEART, 🔷 DIAMOND
- **feelings**: 😀 HAPPY, 😢 SAD, 😠 ANGRY, 😨 SCARED, 😴 SLEEPY, 😲 SURPRISED
- **weather**: ☀️ SUNNY, 🌧️ RAINY, ☁️ CLOUDY, 🌬️ WINDY, ❄️ SNOWY, ⛈️ STORMY
- **vegetables**: 🥕 CARROT, 🥦 BROCCOLI, 🍅 TOMATO, 🌽 CORN, 🥔 POTATO, 🧅 ONION, 🥬 CABBAGE
- **fruits**: 🍎 APPLE, 🍌 BANANA, 🍊 ORANGE, 🍇 GRAPE, 🍓 STRAWBERRY, 🍉 WATERMELON, 🥭 MANGO
- **foods** (Foods & Drinks): 🍚 RICE, 🍞 BREAD, 🥚 EGG, 🍜 NOODLE, 🥛 MILK, 💧 WATER, 🧃 JUICE
- **body** (Body Parts): 👁️ EYE, 👂 EAR, 👃 NOSE, 👄 MOUTH, ✋ HAND, 🦶 FOOT, 🦷 TOOTH
- **actions** (Action Words): 🏃 RUN, 🚶 WALK, 🦘 JUMP, 😴 SLEEP, 😋 EAT, 🥤 DRINK, 📖 READ, 🎤 SING
- **days** (7 Days, ไม่มีภาพ): MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY

หมายเหตุ: หมวด numbers/colours นำคำจาก `words.ts`/`palette.ts` เดิมมาใช้ (DRY)

## 7. เทสต์ (Vitest, logic ล้วน)

- `k2/generate.test.ts` — ทุกหมวด รัน ~150 รอบ:
  - มี 4 ตัวเลือก, คำตอบถูก 1 ตัว, id ไม่ซ้ำ, ตัวลวงไม่ซ้ำคำตอบ
  - โหมด choice ตรงกับ prompt: visual→word ให้ choices เป็น word ทั้งหมด; audio→image ให้ choices เป็น image ทั้งหมด; audio→word ให้ choices เป็น word
  - หมวด days ใช้ prompt.kind === 'audio' และ choices เป็น word เสมอ (ไม่มี image)
  - `speakText` ของโจทย์ = คำของคำตอบถูก (ตัวพิมพ์เล็ก)
- `storage` — เพิ่มเทสต์ `getSetting`/`setSetting` (คืน fallback เมื่อไม่มีค่า, เขียนแล้วอ่านกลับได้)
- UI (K2Engine, TimerBar, K2Choices, CategoryPickerK2) ตรวจด้วย build + preview

## 8. ตัดออกโดยตั้งใจ (YAGNI)

- ไม่มีไฟล์เสียง/ไฟล์ภาพภายนอก (ใช้ TTS + emoji/สี)
- ไม่มีระดับความยากอื่นนอกจากปรับวินาที
- ตัวจับเวลาไม่เล่นเสียงเตือนเมื่อใกล้หมด (แค่แถบเปลี่ยนสี)
