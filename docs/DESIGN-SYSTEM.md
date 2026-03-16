# disappearing-lighters.com — Design System v1

## 🎯 Tasarım Felsefesi

Bu bir website değil, bir **deneyim**. QR tarayan kişi bir "kapıdan" geçiyor.
Hierofani konsepti: seçilmiş kişi bir sınavdan geçiyor. Her piksel bunu desteklemeli.

**Anahtar kelimeler:** Mistik, samimi, sıcak, gizemli, minimal, duygusal
**Referans:** lighter-coin.com — koyu arka plan, ortada yanan kibrit, minimal UI

---

## 🎨 Renk Paleti

### Ateş / Alev Tonları (Primary)
- **Flame Core** `#FFF8E1` — Alevin merkezi, en parlak nokta
- **Flame Bright** `#FFB300` — Aktif elemanlar, başlık vurguları
- **Flame Mid** `#E8832A` — Gradient geçişler, hover
- **Flame Deep** `#D4651A` — Aksan, border glow
- **Ember** `#BF360C` — Kor, dikkat çekici elemanlar

### Karanlık / Gece Tonları (Background)
- **Void** `#060A14` — Ana arka plan (en koyu)
- **Night** `#0D1322` — Kart/panel arka planları
- **Shadow** `#161D30` — Elevated yüzeyler
- **Mist** `#2A3250` — Border, divider çizgileri
- **Smoke** `#6B7394` — İkincil/placeholder metin
- **Ash** `#A0A8C0` — Body metin
- **Light** `#E8E4DC` — Başlık metin (kırık beyaz)

### Aksan Renkler
- **Mystical Blue** `#1A3A8F` — CTA buton arka planı
- **Blue Glow** `#2A5FD6` — Hover, focus state
- **Gold** `#C9A84C` — Premium/özel elemanlar, outline butonlar
- **Telegram Blue** `#2AABEE` — Heyoo'ya geçiş butonu

### Gradientler
- **Flame Gradient:** 135° → `#FFB300` → `#E8832A` → `#D4651A`
- **Ember Gradient:** 180° → `#FFB300` → `#BF360C`
- **Night Gradient:** 180° → `#060A14` → `#0D1322` → `#161D30`
- **Glow:** Radial → `rgba(255,147,41,0.15)` → transparent

---

## 🔤 Tipografi

### Fontlar
- **Display / Başlık:** Playfair Display (serif) — mistik, klasik hava
- **Body / UI:** Inter (sans-serif) — okunabilir, modern

### Ölçek (Mobile)
- **Hero Başlık:** Playfair, 42-72px, weight 900, `#E8E4DC`
- **Alt Başlık:** Playfair, 22-40px, weight 700, flame gradient
- **Mistik Soru:** Playfair Italic, 22-30px, weight 400, `#E8E4DC`
- **Tagline/Açıklama:** Playfair Italic, 14-17px, weight 400, `#A0A8C0`
- **Body Text:** Inter, 14-16px, weight 300-400, `#A0A8C0`
- **Buton:** Inter, 13px, weight 500, uppercase, letter-spacing 0.12em
- **Caption:** Inter, 12px, weight 400, `#6B7394`

### Efektler
- Başlıklarda ateş glow: `text-shadow: 0 0 40px rgba(255,147,41,0.12)`

---

## 📐 Layout — Mobile-First

### Genel Kurallar
- Her ekran **tam viewport** (`100dvh`), scroll yok
- İçerik max-width: **420px**, her zaman ortalı
- Yatay padding: **24px**
- Touch hedefleri minimum **48x48px**
- Safe area inset desteği (notch'lu telefonlar)

### 4 Ekranlı Akış

#### Ekran 1 — Karşılama
```
┌─────────────────────────┐
│                         │
│       $LIGHTER          │  ← Playfair 900, kırık beyaz
│     Story of Fire       │  ← Playfair 700, flame gradient
│                         │
│  "Bu çakmağı buldun.    │  ← Playfair italic, ash rengi
│   Ama o seni mi buldu?" │
│                         │
│     [ Ateşe Gir ]       │  ← Blue Glow filled buton
│   [ Hikâyeyi Keşfet ]   │  ← Gold outline buton
│                         │
│         🔥              │  ← Alev animasyonu (CSS)
│         |               │  ← Kibrit çubuğu
│         |               │
│         |               │
└─────────────────────────┘
```
- Kibrit sayfanın alt kısmında, dikey, ortada
- Alev: flicker (titreme) + sway (sallanma) animasyonu
- Alevin etrafında radial glow pulse
- Küçük parçacıklar (8-10 adet) alevden yukarı yükseliyor
- Mavi alev tabanı (gerçekçi kibrit efekti)
- Arka planda hafif ambient glow (turuncu, aşağıdan yukarı)

#### Ekran 2 — Mistik Soru
```
┌─────────────────────────┐
│                         │
│   (duman/sis animasyon)  │
│                         │
│  "En son ne zaman       │
│   birine aşık oldun?"   │  ← Playfair italic, 22-30px
│                         │
│  ┌───────────────────┐  │
│  │                   │  │  ← Textarea
│  │  placeholder:     │  │     bg: Night + opacity
│  │  "Düşün...        │  │     border: Mist
│  │   acele etme."    │  │     focus border: Flame Bright
│  └───────────────────┘  │
│                         │
│ [ Cevabını Ateşe Ver ]  │  ← Flame outline buton
│                         │
└─────────────────────────┘
```
- Arka planda yavaş hareket eden duman/sis efekti
- Textarea: koyu yarı-saydam arka plan, ince border
- Boş gönderim engellenmeli

#### Ekran 3 — Bekleme
```
┌─────────────────────────┐
│                         │
│                         │
│          🔥             │  ← Daha büyük alev, yavaşça büyüyor
│                         │
│   "Ateş cevabını        │  ← Playfair italic, ash
│    dinliyor..."         │
│                         │
│   ══════════════════    │  ← İnce progress bar (flame gradient)
│                         │
│                         │
└─────────────────────────┘
```
- Alev öncekinden büyük, yavaşça scale up animasyonu
- Progress bar: 10 saniye, flame gradient fill
- Süre dolunca otomatik geçiş

#### Ekran 4 — Onboarding
```
┌─────────────────────────┐
│                         │
│   "Hoş geldin, gezgin." │  ← Playfair 700, 28-40px
│                         │
│  "Ateşi buldun. Artık   │  ← Inter 300, ash
│   hikâyenin parçasısın."│
│                         │
│  🔥 $LIGHTER — kaybolmak│
│     üzere olan alevler   │
│  📍 Her çakmak bir      │  ← Liste, step-by-step
│     koordinat, bir sır   │
│  ⛓️ TON blockchain      │
│     dijital alev sahipliği│
│                         │
│   [ Heyoo'ya Geç → ]   │  ← Telegram Blue buton
│                         │
└─────────────────────────┘
```
- Liste maddeleri arasında ince divider (Mist rengi)
- Her maddenin yanında emoji ikon

---

## 🔥 Alev Animasyonu Detayları

### Yapı (CSS-only, canvas gerekmez)
1. **Ana alev:** Radial gradient (core → bright → mid → deep → transparent), dikey oval, üst kısım yuvarlak
2. **İç alev:** Daha küçük, daha parlak, daha hızlı titreme
3. **Mavi taban:** Küçük daire, blur efektli, yarı saydam
4. **Glow:** Alevin etrafında büyük radial gradient, pulse animasyonu
5. **Parçacıklar:** 2px noktalar, aşağıdan yukarı hareket, farklı hız/gecikme

### Animasyonlar
- **Flicker:** Height/width arası hızlı geçiş (~0.12s), doğal titreme
- **Sway:** Yavaş sağa-sola sallanma (~2.2s), ±1.2 derece
- **Glow pulse:** Opasite ve scale arası geçiş (~2.5s)
- **Particle rise:** Aşağıdan yukarı, hafif yatay sapma, küçülerek kaybolma

### Kibrit Çubuğu
- Genişlik: 4px (mobile), 5px (tablet+)
- Yükseklik: viewport'un ~28%'i
- Renk: Kahverengi gradient (koyu → açık)
- Başlık (match head): 10x16px, siyahtan koyu kahverengiye gradient

---

## 🎵 Ses

- Sayfa açılışı: sessiz (autoplay yok)
- Ses toggle: sağ üst köşe, 36px daire, mute/unmute ikonu
- "Ateşe Gir" tıklama: kibrit çakma sesi (kısa)
- Soru sayfası: ambient drone müzik (loop)
- Bekleme sayfası: ateş çıtırtısı + ambient devam
- Tüm sesler lazy load

---

## ✨ Geçiş Animasyonları

- Ekranlar arası: fade out (0.8s) + hafif scale
- İçerik elemanları: fade-in-up, kademeli gecikme (0.3s aralıkla)
- Giriş ekranı: başlık → alt başlık → tagline → butonlar sırayla beliriyor

---

## 📏 Spacing Sistemi

Base unit: **8px**
```
4px  — çok küçük boşluk
8px  — küçük boşluk
12px — buton arası gap
16px — orta boşluk, input padding
24px — yatay sayfa padding, bölüm arası
32px — buton grubu üst margin
48px — büyük bölüm arası
64px — ekstra büyük boşluk
```

---

## 🧩 Buton Stilleri

| Tip | Arka Plan | Metin | Border | Kullanım |
|-----|-----------|-------|--------|----------|
| Fire (Primary CTA) | `#2A5FD6` | Beyaz | Aynı renk | "Ateşe Gir" |
| Gold (Secondary) | Transparent | `#C9A84C` | `rgba(201,168,76,0.4)` | "Hikâyeyi Keşfet" |
| Flame (Submit) | Transparent | `#FFB300` | `rgba(255,179,0,0.4)` | "Cevabını Ateşe Ver" |
| Telegram | `#2AABEE` | Beyaz | Aynı renk | "Heyoo'ya Geç" |

Tümü: 4px radius, 14px dikey padding, 48px min yükseklik, uppercase, 0.12em spacing

---

## ⚡ Performans

- İlk yükleme < 1 saniye
- Toplam < 200KB (font hariç)
- Animasyonlar sadece transform + opacity (GPU)
- Ses dosyaları lazy load
- No framework — vanilla HTML/CSS/JS
- Deploy: Cloudflare Pages veya Vercel Edge

---

## 🚫 Yapılmayacaklar

- Navbar, header, footer, menü
- Logo
- Sosyal medya linkleri
- Cookie banner, popup
- Scroll gerektiren içerik
- Parlak beyaz arka plan
- Stock görseller
- "Bu bir blockchain projesidir" gibi açıklamalar
