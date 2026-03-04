**$LIGHTER × HEYOO**

**DETAYLI ÇALIŞMA PLANI**

_Doküman Değil, Kod Yaz. Hayal Değil, Çakmak Dağıt._

**Bu doküman projenin son yazılı çıktısıdır.**

Bundan sonra yapılacak tek şey: bu plandaki maddeleri teker teker işaretlemek.

Mart 2026 | Versiyon 1.0

# 1\. Gerçeklik Kontrolü: Bugün Neredeyiz?

**Elimizdekiler:**

- 1 milyar adetlik $LIGHTER token (TON blockchain, canlı)
- STON.fi’de aktif likidite havuzu ($4.1K, 77 holder, 4 günlük)
- TON blockchain’da aktif token contractı (EQDheHEbyYsL5brD3uRxNgpxtH5KoUqdP6LC98iMhBNHyh0V)
- Kapsamlı dokümantasyon: Tokenomics V5, Yazılım Yol Haritası, Ürün Dokümanı, Mitoloji, God Mode
- Derin bir vizyon ve tutkulu bir kurucu

**Elimizde OLMAYANLAR:**

- Çalışan bir TMA (sıfır satır production kodu)
- Dağıtılmış tek bir çakmak (10,000 hedefin %0’ı)
- Tek bir mekan ortaklığı
- Tek bir gerçek kullanıcı (token holderlara hariç)
- Geliştirici ekibi (solo kurucu)
- Yıllık gelir: $0

Bu planın amacı: yukarıdaki “elimizde olmayanlar” listesini sistematik olarak çözmek. Sıralama kritik — her adım bir sonrakinin ön koşulu.

# 2\. Kritik Yol: Ne, Ne Zaman, Neden Bu Sırayla

Bu proje iki paralel iş kolundan oluşur. Birisi olmadan diğeri anlamsız:

|     |     |     |     |
| --- | --- | --- | --- |
| **İş Kolu** | **Ne?** | **Neden Kritik?** | **Biri Olmazsa** |
| **A: Yazılım** | Minimal TMA: QR tara → wallet bağla → claim | Taranacak QR bir yere yönlendirmeli | Çakmak dağıtılsa bile QR’ı tarayan kişi boş sayfaya düşer |
| **B: Fiziksel** | 10,000 QR sticker + çakmak üretimi ve dağıtımı | Kullanıcı kazanım motorunun yakıtı | Mükemmel TMA olsa bile kimse bilmez |

**İkisi PARALEL yürümeli. TMA geliştirirken sticker tasarımı ve üretimi başlamalı. 30. günde ikisi de hazır olmalı.**

# 3\. İlk 30 Gün: Ateşi Yak Sprint’i

Bu 30 gün projenin tüm geleceğini belirler. Burada başarısız olursan geri kalanı tartışmanın anlamı yok.

## 3.1 İş Kolu A: Minimal TMA (Yazılım)

### Hafta 1 (Gün 1–7): Temel Alştyapı

|     |     |     |     |
| --- | --- | --- | --- |
| **Gün** | **Görev** | **Çıktı** | **Tamamlandı ☐** |
| 1   | Monorepo kur: pnpm init, turborepo install, apps/tma/ klasörü oluştur | Boş ama çalışan monorepo |     |
| 1   | Vite + @telegram-apps/sdk-react v3 + TypeScript kur (apps/tma/) | TMA boş sayfa açılıyor |     |
| 2   | BotFather’da bot oluştur, TMA URL’ini bağla | Telegram’dan /start ile TMA açılıyor |     |
| 2   | Vercel’e deploy (apps/tma/ build output) | Canlı URL: lighter-tma.vercel.app |     |
| 3   | TON Connect manifest.json oluştur, CORS ayarla | Manifest public URL’de erişilebilir |     |
| 3   | @tonconnect/ui-react v2 kur, TonConnectButton entegre et | Wallet bağlama butonu çalışıyor |     |
| 4   | Zustand store kur: user wallet, connection status, claim status | State management hazır |     |
| 4   | Basit landing page: logo + "Alevi Al" butonu + wallet connect | Taranmış QR’dan gelen kullanıcı bir şey görüyor |     |
| 5   | Backend: Supabase veya Neon PostgreSQL + tRPC server kur | API endpoint çalışıyor |     |
| 5   | DB tablo: users (wallet, created_at), scans (qr_id, wallet, timestamp, location) | Veri kaydedilebilir |     |
| 6   | QR tarama endpointi: POST /api/scan { qr_id, wallet } | QR taranınca DB’ye yazılıyor |     |
| 6   | Rate limiting: aynı QR + aynı wallet = günde 1 kez | Gaming önlendi |     |
| 7   | Test: QR oluştur → telefonla tara → TMA aç → wallet bağla → scan kayıt | Uçtan uca akış çalışıyor |     |

**Hafta 1 Sonu Checkpoint: Telefonunla bir QR kodu tara, Telegram’da TMA açılsın, wallet bağla, DB’de scan kaydı gör. Bu olmazsa Hafta 2’ye geçme.**

### Hafta 2 (Gün 8–14): Token Claim Akışı

|     |     |     |     |
| --- | --- | --- | --- |
| **Gün** | **Görev** | **Çıktı** | **☐** |
| 8   | Token dağıtım smart contractı yazma VEYA backend distribution | Token gönderim mekanizması hazır |     |
| 8-9 | Karar: smart contract mı backend transfer mi? (Başlangıç için backend daha hızlı) | Teknik karar verildi |     |
| 9-10 | Claim flow: kullanıcı "Alevi Al" tıklar → backend scan doğrular → token transfer başlatır | Claim UI + backend hazır |     |
| 10-11 | Wallet aktivasyonu ödülü: ilk claim yapan kullanıcıya 200 $LIGHTER | Onboarding ödülü aktif |     |
| 11-12 | Claim sonrası ekran: "Tebrikler! 200 $LIGHTER aldın. Bu ateşi yay!" + share butonu | Viral loop UI |     |
| 12-13 | Telegram share: deep link oluştur (t.me/lighter_bot?start=ref_XXXX) | Referans sistemi temeli |     |
| 13-14 | Security: claim rate limit (1 claim/QR/gün), wallet blocklist, basic anti-bot | Güvenlik katmanı |     |
| 14  | Uçtan uca test: farklı cihazlardan tara → claim → token wallet’ta görünüyor | MVP tamamlandı |     |

**Hafta 2 Sonu Checkpoint: Başka birinin telefonundan QR tara, wallet bağla, 200 $LIGHTER al, Tonkeeper’da gör. Bu gerçekleşmezse her şeyi bırak bunu düzelt.**

### Hafta 3 (Gün 15–21): Landing Page ve QR Sistemi

|     |     |     |     |
| --- | --- | --- | --- |
| **Gün** | **Görev** | **Çıktı** | **☐** |
| 15-16 | Landing page: lighter.app/flame/{qrId} — 3 saniye yüklenme hedefi | Mobil-first, hızlı, etkileyici |     |
| 16-17 | QR taranmamış durum: mitoloji teaser + "Telegram’dan Aç" butonu | Telegram dışından gelen kullanıcı yönlendirilir |     |
| 17-18 | QR taranmış durum: kaç kişi taralamış + flame chain derinliği | Sosyal kanıt görünür |     |
| 18-19 | i18n temel: TR + EN (otomatik tarayıcı dili algılama) | İki dil aktif |     |
| 19-20 | QR batch üretim scripti: UUID v4 üret → URL oluştur → QR PNG kaydet | 10,000 benzersiz QR dosyası hazır |     |
| 20-21 | QR analytics: her taramada IP, cihaz, lokasyon, zaman kaydı | Dönüşüm oranları ölçülebilir |     |

### Hafta 4 (Gün 22–30): Polish + Dağıtım Hazırlığı

|     |     |     |     |
| --- | --- | --- | --- |
| **Gün** | **Görev** | **Çıktı** | **☐** |
| 22-23 | Admin panel: toplam scan, benzersiz kullanıcı, günlük aktif, token dağıtım | Metrikleri takip edebilirsin |     |
| 23-24 | Bug fix, performans optimizasyonu, TMA bundle size kontrolü (<650KB) | Production hazır |     |
| 24-25 | Sentry veya benzeri error tracking entegrasyonu | Hataları görebilirsin |     |
| 25-26 | Telegram kanalı ve grubu oluştur, bot komutları (/start, /help, /flame) | Topluluk altyapısı hazır |     |
| 26-28 | Soft launch: 50 çakmak + sticker ile kendi çevrende test | Gerçek kullanıcı geri bildirimi |     |
| 28-30 | Geri bildirime göre kritik düzeltmeler | V1.0 hazır |     |

**30\. GÜN GO/NO-GO: TMA çalışıyor mu? 50 test çakmaktan en az 10 gerçek claim var mı? Evet → 10,000 çakmak dağıtımına başla. Hayır → Durup analiz et.**

## 3.2 İş Kolu B: Fiziksel Üretim ve Dağıtım

Bu iş kolu yazılımla PARALEL yürür. TMA geliştirirken sticker tasarım ve üretim sürecini başlat.

### Hafta 1–2: Tasarım ve Sipariş

|     |     |     |     |
| --- | --- | --- | --- |
| **Görev** | **Detay** | **Maliyet** | **Süre** |
| Sticker görsel tasarımı | 2.5x2.5cm, Auauauau + QR + CTA: "Tara, Ateşi Al" | TL0 (kendin yap) veya TL500-1000 (freelancer) | 3-5 gün |
| QR batch üretimi | 10,000 benzersiz QR PNG (Hafta 3 script’i ile) | TL0 (script) | 1 saat |
| Baskı firması araştırma | Barkem Barkod Etiket, Baskımo, yerel matbaalar | TL0 | 2 gün |
| Teklif al + sipariş ver | 10,000 lamine vinil sticker, değişken QR baskı, UV dayanıklı | TL6,500-10,000 (~$200) | 1 gün |
| Çakmak tedariki | 10,000 tek kullanımlık çakmak (toptan) | TL3,000-5,000 (~$100) | 1 gün |

### Hafta 3: Üretim Takibi

- Baskı proof onayı (fiziksel örnek iste, QR taranabilirliğini telefonla test et)
- Sticker + çakmak eşleştirme planı: sticker yapıştırma işçiliği (kendin veya 2-3 yardımcı)
- Üretim süresi: tasarım onayından 5-10 iş günü
- KENDİN TEST ET: Farklı telefonlarla (eski Android, iPhone SE, Samsung) QR taranabilirlik testi

### Hafta 4: Dağıtım Hazırlığı

|     |     |     |
| --- | --- | --- |
| **Görev** | **Detay** | **Not** |
| Dağıtım haritası | Kadıköy’ün 50 hedef mekanını belirle: Kadife Sokak barları, Moda sahili kafeleri, Bahariye dükkanları | Google Maps’te pin’le |
| Mekan konuşmaları | Her mekana git, yüz yüze konuş: “Ücretsiz çakmak veriyoruz, sizin çakmak masrafınızı sıfırlar” | 30 dakika/mekan, 2 gün |
| Akrilik tepsi | Bar tezgahları için basit tepsi (50-100 adet, TL50-100/adet) | Opsiyonel — bütce varsa |
| Test batch | 50 çakmak + sticker: kendi arkadaş çevrende test | MUTLAKA yap |

# 4\. 30 Günlük Bütce Planı

|     |     |     |     |
| --- | --- | --- | --- |
| **Kalem** | **Maliyet (TL)** | **Maliyet (USD)** | **Zorunlu mu?** |
| 10,000 lamine vinil sticker (değişken QR) | 6,500-10,000 | $200-300 | **EVET** |
| 10,000 tek kullanımlık çakmak | 3,000-5,000 | $90-150 | **EVET** |
| Vercel Pro (TMA hosting) | ~700/ay | $20/ay | **EVET** |
| Supabase (DB) | 0   | $0 (free tier) | **EVET** |
| Domain (lighter.app veya benzeri) | ~1,000 | $30 | **EVET** |
| Sticker tasarım (freelancer) | 0-1,000 | $0-30 | Opsiyonel |
| Akrilik tepsi (50 adet) | 2,500-5,000 | $75-150 | Opsiyonel |
| Test telefonlar (eski cihazlar) | 0   | $0 (ödünç al) | Hayır |
| **TOPLAM** | **~13,000-22,000** | **~$400-680** |     |

Bu bütce projenin hayata geçip geçmeyeceğini belirler. $400-680 ile global bir proje başlatıyorsun. Bu değerlendirmeyi kaybetme: eğer bu parayı harcayamıyorsanm, projenin gerçekliğine inanıyor musun gerçekten?

# 5\. Gün 31–60: İlk Büyüme Sprint’i

Önkoşul: TMA çalışıyor, 10,000 çakmak dağıtılmaya başladı.

## 5.1 Haftalık Yazılım Görevleri

|     |     |     |
| --- | --- | --- |
| **Hafta** | **Görev** | **Çıktı** |
| 5   | Flame chain takibi: her QR’ın kaç farklı kişi taradığını göster | Lighter journey sayfası |
| 5   | Spark Academy: YouTube onboarding videosu (1 video, 3-5dk) | AdSense geliri başlar |
| 6   | MapLibre + h3-js: basit harita — QR taramalarının konum noktalari | Flame Map V0.1 |
| 6   | Hexagon keşif mekaniği: ilk kez bir hexagonda tarayan kullanıcı 150 $LIGHTER | Keşif teşviği |
| 7   | Referans sistemi: davet linki + 100 $LIGHTER (davet eden + edilen) | Viral loop |
| 7   | Haftalık analitik e-posta (kendine): scan, claim, kullanıcı, retention | Veri odaklı karar |
| 8   | Check-in mekaniği (basit): mekan yakınında QR tara = check-in | KOBİ hazırlığı |
| 8   | Profil sayfası: Book of Fires — kaç alev aldın, kaç yaydın | Kullanıcı kimliği |

## 5.2 Haftalık Fiziksel Görevler

|     |     |     |
| --- | --- | --- |
| **Hafta** | **Görev** | **Hedef** |
| 5   | Kadıköy Kadife Sokak: 10 bara 200’er çakmak bırak | 2,000 çakmak aktif |
| 6   | Moda sahil kafeleri: 10 kafeye 200’er çakmak | 4,000 çakmak aktif |
| 7   | Bahariye caddesi: 10 mekana 200’er çakmak | 6,000 çakmak aktif |
| 8   | Geri kalan 4,000 çakmağı en çok scan alan mekanlara yoğunlaştır | 10,000 çakmak tamam |

**60\. GÜN KPİ: 500+ benzersiz wallet aktivasyonu, 2,000+ QR tarama. Bu sayılara ulaşamazsan Faz 2’ye geçme — neden ulaşamadığını analiz et.**

# 6\. Ay 2–4: Alev Haritası Fazı

Önkoşul: 500+ wallet, 2,000+ scan. Go kararı verildi.

## 6.1 Teknik İş Listesi

|     |     |     |
| --- | --- | --- |
| **Hafta** | **Görev** | **Öncelik** |
| 9-10 | GPS doğrulama: check-in için konum + H3 eşleştirme | YÜKSEK |
| 9-10 | Anti-spoofing Level 1: GPS tutarlılık kontrolü (bir dakika içinde 10km atlama = red) | YÜKSEK |
| 11-12 | Flame Map görselleştirme: renk kodlu hexagonlar, chain derinliği animasyonları | ORTA |
| 11-12 | Herkese açık paylaşım sayfası: lighter.app/flame/XYZ — screenshot-worthy | YÜKSEK (viral) |
| 13-14 | Premium burn mekanikleri: gizli hafıza (100), sesli mesaj (50), karakter (200) | ORTA |
| 13-14 | 250K çakmak QR batch hazırlığı (Faz 3 için ön sipariş planlaması) | DÜŞÜK |
| 15-16 | Backend ölçekleme: Redis caching, DB index optimizasyonu | YÜKSEK |
| 15-16 | Haftalık seri bonus: 7 gün arka arkaya = 500 $LIGHTER | ORTA |

## 6.2 Topluluk İnşa

- Telegram kanalı: günlük Flame Map ekran görüntüsü + "bugün ateş nereye yayıldı?"
- Telegram grubu: kullanıcı geri bildirimi, bug raporları, öneriler
- Twitter/X: günlük metrik paylaşımı (scan sayısı, yeni wallet, en uzun chain)
- Auauauau mitoloji dizisi: haftalık lore parçaları (Telegram kanalında)
- Yüz yüze etkinlik: Kadife Sokak’ta "Ateş Gecesi" — en çok chain kuran 10 kişiye özel rozet

Bütce: $2,000-5,000 (30,000 ek çakmak + sticker + topluluk etkinlikleri)

**Faz 2 Sonu KPİ: 2,000+ aktif, 100+ günlük check-in, 3+ mahalleye yayılan flame chain. Yoksa Faz 3’e geçme.**

# 7\. Ay 4–6: Bölge Ateşi Fazı

Önkoşul: 2,000+ aktif, check-in kültürü oluşmuş.

## 7.1 Teknik İş Listesi

|     |     |     |
| --- | --- | --- |
| **Hafta** | **Görev** | **Kritik Mi?** |
| 17-18 | Territory staking smart contract (TON FunC): token kilitle → hexagon talep et | **KRİTİK** |
| 18-19 | Staking UI: haritada hexagon seç → stake miktarı gir → onayla | **KRİTİK** |
| 19-20 | 30 günlük rolling kontrol penceresi + puan hesaplaması | YÜKSEK |
| 20-21 | Faksiyon sistemi: Sentry vs Nomad seçimi + faksiyon renkleri haritada | YÜKSEK |
| 21-22 | Denetçi programı: başvuru, onay, görev paneli, ödül sistemi | YÜKSEK |
| 22-23 | Ateş Konseyi altyapısı: 5-7 danışman seçimi, haftalık toplantı formatı | **DAO BAŞLANGIÇ** |
| 23-24 | Mystery Lighter mekaniği: rastgele çakmak = 1,000 $LIGHTER + NFT | ORTA |
| 23-24 | İlk 10 KOBİ ortaklığı: yüz yüze görüşme + onboarding | **GELİR TEMELI** |

Bütce: $5,000-10,000 (staking contract audit, ek çakmak üretimi, topluluk büyüme)

**Faz 3 Sonu KPİ: 5,000+ aktif, 10+ bölgede rekabet, 10 KOBİ, Ateş Konseyi aktif. Yoksa Faz 4’e geçme.**

# 8\. Ay 6–9: KOBİ Ağı Fazı

Önkoşul: 5,000+ kullanıcı, 10 KOBİ ortağı.

## 8.1 Teknik + İş Geliştirme

|     |     |     |
| --- | --- | --- |
| **Ay** | **Yazılım** | **İş Geliştirme** |
| 6-7 | KOBİ dashboard: ziyaretçi sayısı, check-in istatistikleri, müşteri demografisi | 50 mekana genişle: her görüşmeye veri ile git |
| 7-8 | CPA kampanya oluşturma aracı: "3 check-in = %10 indirim" tipi | İlk gelir faturası kes ($50-200/mekan/ay) |
| 8-9 | Next.js responsive web: mekan keşfet sayfaları (SEO, SSR) | 100 mekana ulaş, bulk onboarding |

**İlk Gelir Hedefi:**

100 mekan × $50/ay ortalama = $5,000/ay. Bu, projenin kendi kendini fonlayabileceğini kanıtlar. Yatırımcı aramadan önce bu rakama ulaş.

**Faz 4 Sonu KPİ: 100+ mekan, ölçülebilir aylık gelir (>$1,000), 10,000+ aktif kullanıcı.**

# 9\. Ay 9–18: Türkiye Genişlemesi

Bu fazın detaylı çalışma planı Faz 4 sonu verilerine göre oluşturulacaktır. Şimdi plan yapmak spekülasyondur. Ana hatlar:

- 7 coğrafi bölge (Marmara, Ege, Akdeniz, İç Anadolu, Karadeniz, Doğu, Güneydoğu)
- Bölgesel elçi sistemi: her bölgede 5-10 kurucu Denetçi
- 500K çakmak üretim hattı (toptan fiyat avantajı)
- DAO tam devreye girer: 250M kilitli kasa kararı topluluğa geçer
- Legendary Lighter NFT sistemi
- Native app geliştirme başlar (NFC/GPS için zorunlu)

Bu fazın detaylı planını yapmak için Faz 4 verilerine ihtiyacın var. Şimdi bunu planlamak zaman kaybıdır.

# 10\. Günlük Kurucu Rutini

Her gün bu rutini takip et. Rutin değişmez — içerik değişir.

|     |     |     |     |
| --- | --- | --- | --- |
| **Saat** | **Aktivite** | **Süre** | **Not** |
| 09:00 | Metrikleri kontrol et: dünkü scan, claim, yeni wallet, hata logları | 15dk | Her gün İLK iş |
| 09:15 | Telegram grubu: bug raporları oku, kritik soruları yanıtla | 15dk | Topluluk önce |
| 09:30 | Kod yaz: bugünkü sprint görevi (çalışma planından) | 4 saat | DERIN ÇALIŞMA |
| 13:30 | Öğle molası + yürüyüş | 30dk | Ekrandan uzaklaş |
| 14:00 | Kod devam: test yaz, deploy et, Vercel’de kontrol et | 2 saat | Ship > Perfect |
| 16:00 | Fiziksel işler: mekan ziyareti, çakmak dağıtımı, sticker kontrol | 2 saat | Haftada 3+ gün |
| 18:00 | Topluluk içeriği: Telegram post, Twitter metrik, lore parçası | 30dk | Tutarlılık > Kalite |
| 18:30 | Yarını planla: 3 görev yaz, önceliklendir, bitir | 15dk | Yazmazsan kaybolur |

**Haftalık Kural: Pazartesi-Cuma en az 4 saat/gün kod. Cumartesi mekan ziyareti. Pazar OFF — ama Telegram’ı kontrol et.**

# 11\. Haftalık Raporlama Şablonu

Her Pazar akşamı bu şablonu doldur. Kendine karşı dürüst ol.

|     |     |     |
| --- | --- | --- |
| **Alan** | **Soru** | **Örnek Cevap** |
| 📊 Metrikler | Bu hafta: scan, claim, wallet, DAU, retention? | 342 scan, 89 claim, 67 wallet, 31 DAU, %42 D7 |
| ✅ Tamamlanan | Hangi görevleri bitirdim? | TON Connect entegrasyonu, claim flow, 3 bug fix |
| ❌ Tamamlanmayan | Hangi görevleri BITIREMEDIM ve NEDEN? | Landing page: Vite config sorunu, 2 gün harcadım |
| 🚧 Blokajlar | Beni ne durduruyor? | Smart contract deploy test net’te başarısız |
| 🎯 Gelecek Hafta | 3 en önemli görev? | 1) Landing page bitir 2) 50 test çakmak dağıt 3) QR analytics |
| 💰 Harcama | Bu hafta ne harcadım? | TL2,400 sticker baskı ön ödeme |
| 🙏 Dürüstlük | Kendime yalan söylüyor muyum? Nerede kaçıyorum? | 4 saat kod yerine 2 saat yazdım, geri kalanı "araştırma" dedim |

# 12\. Teknoloji Seçimleri — İlk 30 Gün İçin

Sadece ilk 30 günde ihtiyacın olan teknolojiler. Geri kalanı o zamana kadar değişmiş olabilir.

|     |     |     |     |
| --- | --- | --- | --- |
| **Katman** | **Seçim** | **Neden Bu?** | **Alternatif** |
| TMA Framework | Vite + @telegram-apps/sdk-react v3 | En hafif bundle, en iyi TS desteği | twa-dev/sdk ama eski |
| Backend | Supabase (PostgreSQL + Edge Functions) | Ücretsiz tier yeterli, auth dahil, hızlı başla | Neon + tRPC |
| State | Zustand v5 | 3KB, basit, cross-platform | Jotai |
| Wallet | @tonconnect/ui-react v2+ | Telegram zorunluluğu, drop-in buton | Yok — zorunlu |
| Deploy | Vercel | Ücretsiz tier, otomatik deploy, HTTPS | Netlify |
| QR Üretim | Node.js script (qrcode npm) | Ücretsiz, batch üretim | API servis |
| Analytics | Supabase + basit SQL query | Ücretsiz, zaten DB’de | Amplitude (ücretli) |
| Error Track | Sentry (free tier) | 10K event/ay ücretsiz | Console.log (önerme) |

**Monorepo (Turborepo) ilk 30 günde ŞART DEĞİL. Sadece apps/tma/ klasörünü düzgün kur. Monorepo’yu Faz 2’de native app ihtiyacı doğdğunda kur. Şimdi overengineering yapma.**

# 13\. Risk ve Blokaj Matrisi

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| **Risk** | **Olasılık** | **Etki** | **Tetikleyici** | **Aksiyon** |
| TMA 30 günde bitmez | YÜKSEK | VAROLUŞSAL | Gün 20’de claim flow hala çalışmıyor | Kapsamı kıs: sadece tara+bağla. Claim’i Hafta 5’e ertele. |
| QR sticker taranmıyor | ORTA | VAROLUŞSAL | Test batch’te %30+ başarısız tarama | Sticker boyutunu büyüt (3x3cm), kontrast artır, farklı matbaa dene |
| Mekanlar ilgilenmiyor | ORTA | YÜKSEK | 30 mekandan 5’inden azı kabul | Değer önerisini değiştir: "ücretsiz çakmak" yerine "müşteri çekme aracı" |
| Token fiyatı sıfıra yakın kalır | YÜKSEK | ORTA | 3 ayda LP’de değişiklik yok | Fiyatı unutarak ürüne odaklan. Kullanıcı sayısı > token fiyatı. |
| Solo kurucu tükenmesi | YÜKSEK | VAROLUŞSAL | 3+ hafta üst üste 4 saatten az kod | Hafta 8’de geliştirici ara. Faz 3’te mutlaka ekip kur. |
| GPS spoofing saldirısı | DÜŞÜK (başlangıçta) | DÜŞÜK | Sahte check-in’ler tespit edilir | Faz 1’de önemli değil. Faz 3’te anti-spoof katmanı. |

# 14\. Go/No-Go Karar Noktaları

Her fazın sonunda dürüst bir değerlendirme yap. Devam etmek için tüm kriterlerin sağlanması gerekir.

|     |     |     |     |
| --- | --- | --- | --- |
| **Karar Noktası** | **Zaman** | **GO Kriteri** | **NO-GO Aksiyonu** |
| **KN-0: Soft Launch** | Gün 30 | TMA çalışıyor + 50 test çakmaktan 10+ claim | TMA’yı düzelt, 30 gün daha ver |
| **KN-1: İlk Ateş** | Gün 60 | 500+ wallet + 2,000+ scan | Dağıtım stratejisini değiştir (mekan seçimi, CTA) |
| **KN-2: Alev Yayılımı** | Ay 4 | 2,000+ aktif + 3+ mahalle + 100+ günlük check-in | Yayılmıyorsa: sticker mesajı değiştir, ödül artır |
| **KN-3: Bölge Rekabeti** | Ay 6 | 5,000+ aktif + 10+ bölge + 10 KOBİ | KOBİ yoksa: CPA modelini sadeleştir, ücretsiz dene |
| **KN-4: İlk Gelir** | Ay 9 | 100+ mekan + $1,000+/ay gelir | Gelir yoksa: pivot — KOBİ yerine premium kullanıcı odaklan |
| **KN-5: Ölçek** | Ay 18 | 50,000+ aktif + 7 bölge + DAO aktif | Faz 5 verilerine göre yeniden planla |

# 15\. Ekip Büyütme Planı

Solo kurucuyla başla, metriklerle büyüt. Erken işe alım en büyük hatalardan biridir — product-market fit olmadan ekip kurmak parayı yakar.

|     |     |     |     |
| --- | --- | --- | --- |
| **Faz** | **Ekip** | **Neden Şimdi?** | **Nasıl Bul?** |
| **Faz 1** | Solo kurucu (sen) | Ürün henüz yok, para yok, ispat yok | —   |
| **Faz 2** | +1 part-time frontend dev | Flame Map + check-in sistemi karmaşıklaşıyor | Freelancer: Üniversite öğrenci, token ödeme |
| **Faz 3** | +1 topluluk yöneticisi + 1 backend dev | 5,000 kullanıcı = destek yükü, smart contract ihtiyacı | Denetçilerden topluluk yöneticisi çıkar |
| **Faz 4** | +1 iş geliştirme (KOBİ satış) | 100 mekan = yüz yüze satış gerektirir | Komisyon bazlı: başarıya göre öde |
| **Faz 5** | Full-time ekip (5-8 kişi) | Gelir var, ölçek gerektiriyor | KOBİ gelirinden fonla |

# 16\. 18 Aylık Master Timeline

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| **Ay** | **Yazılım** | **Fiziksel** | **Topluluk** | **Gelir** |
| **1** | Minimal TMA: tara+bağla+claim | 10K sticker+çakmak üretimi | Telegram kanal+grup | $0  |
| **2** | Flame Map V0.1 + referans | 50 mekana dağıtım | Günlük içerik | $0  |
| **3** | Check-in + hexagon keşif | 10K çakmak tamamı dağıtıldı | 500+ wallet hedefi | $0  |
| **4** | GPS doğrulama + anti-spoof | 30K ek çakmak siparişi | 2K aktif hedefi | $0  |
| **5** | Premium burn + Flame Map V1 | 150 mekana genişle | Haftalık etkinlik | $0  |
| **6** | Territory staking + faksiyon | Denetçi programı | Ateş Konseyi kuruluş | $0  |
| **7** | KOBİ dashboard V1 | 10 KOBİ ortaklığı | 5K aktif hedefi | $500/ay |
| **8** | CPA kampanya aracı | 50 KOBİ ortaklığı | Faksiyon savaşları | $2.5K/ay |
| **9** | Web client (Next.js SSR) | 100 KOBİ ortaklığı | 10K aktif hedefi | $5K/ay |
| **12** | Çok şehir backend | 500K çakmak hattı | Bölgesel elçiler | $15K/ay |
| **15** | NFT marketplace | NFT çakmak prov | DAO oylama | $30K/ay |
| **18** | Native app (NFC/GPS) | Smart lighter prototip | 50K aktif hedefi | $50K/ay |

# 17\. Sana Bir Daha Söyleyeceğim Acı Gerçekler

**1\. Doküman yazma dönemi bitti.**

Bu doküman, Tokenomics V5 ve Yazılım Yol Haritası birlikte projenin tüm yazılı çıktısıdır. Daha fazla doküman yazmak iş yapmak değildir — iş yapmaktan kaçmaktır. Her "bir doküman daha hazırlayalım" düşüncesi geldiğinde: "Bu doküman yerine 30 satır kod yazabilir miydim?" diye sor.

**2\. Mükemmeliyeti unutmalısın.**

Minimal TMA çirkin olacak. Landing page basit olacak. QR taranabilirliği %100 olmayacak. Bunların hepsi NORMAL. 77 holderlı bir tokene milyon dolarlık UX gerekmiyor. Çalışan çirkin > çalışmayan güzel. Her zaman.

**3\. Solo kurucu sınırını bilesin.**

Günde 4 saat kod + 2 saat fiziksel dağıtım + topluluk yönetimi = 7-8 saatlik bir gün. Bu tempoda Faz 1-2’yi yaparsın. Faz 3’te yardıma ihtiyacın olacak — bunu şimdiden kabul et ve hazırlan.

**4\. Fiyata değil kullanıcıya bak.**

$LIGHTER $0.000012 veya $0.12 olması şu an önemsiz. Önemli olan: kaç kişi QR taradı, kaç kişi wallet bağladı, kaç kişi ertesi gün geri geldi. Fiyata bakmayı bırak, metriklere bak.

**5\. Başlama tarihi: YARIN.**

Bu dokümanı okuduğun günden sonraki ilk sabah saat 09:00’da bilgisayarı aç, terminal’e "pnpm init" yaz. 30 gün sayım başlasın.

**_Bir çakmak kaybetmek, bir ateş başlatmaktır._**

**Ama önce o çakmağı bir dakkika eline alman lazım.**

**pnpm init**