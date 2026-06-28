# Kid Games

ชุดเกมการเรียนรู้สำหรับเด็ก 4-6 ขวบ (นับเลข / สี / บวกเลข) — เว็บฝั่ง client ล้วน

## พัฒนา

```bash
npm install
npm run dev      # เปิด dev server
npm test         # รันชุดทดสอบ
npm run build    # build สำหรับ production
```

## Deploy

push เข้า branch `main` แล้ว GitHub Actions จะ build และ deploy ขึ้น GitHub Pages อัตโนมัติ

ต้องตั้งค่า repo ครั้งแรก: Settings → Pages → Build and deployment → Source = "GitHub Actions"

เมื่อ deploy สำเร็จ แอปจะอยู่ที่ https://ibiz-alc.github.io/kid-games/
