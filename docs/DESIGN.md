# Velora — Dizayn spetsifikatsiyasi

Hujjat loyiha egasi bilan kelishilgan UI yo‘nalishini qayd etadi. Kod va dizayn shu hujjatga mos bo‘lishi kerak.

## 1. Umumiy yo‘nalish

Velora — **sayohat booking** platformasi (Nestar kurs loyihasidan property yo‘nalishiga travel ga o‘tgan).

UI uchta manbaning **eng yaxshi qismlarini** birlashtiradi:

1. **Nestar** — navigatsiya tuzilishi va sahifa “skeleti”
2. **Kayak** — ranglar va travel qidiruv hissi
3. **Tourex** — bosh sahifa hero (to‘liq fon + pastda qidiruv kartasi)

## 2. Navbar

### Maqsad

Foydalanuvchi har sahifada bir xil, tushunarli navigatsiya ko‘radi; scroll qilganda bar yo‘qolmaydi.

### Vizual

```
[Logo VELORA]     Home  Tours  Agents  Community  CS     [Login/Register] [🇺🇸 ▼]
```

- Balandlik ~80px (mobil ~72px)
- Bosh sahifada: qorong‘u shaffaf fon, oq matn, active link — `$velora-accent`
- Scroll: fon biroz qotadi (`velora-navbar--scrolled`)
- Ichki sahifalarda: `velora-navbar--contrast` (qorong‘u bar)

### Linklar

| Label | URL |
|-------|-----|
| Home | `/` |
| Tours | `/tours` |
| Agents | `/agent` |
| Community | `/community?articleCategory=FREE` |
| CS | `/cs` |

### Auth

`/login`, `/register`, `/account/join` — **navbar ko‘rsatilmaydi** (faqat markaziy auth karta + footer).

## 3. Bosh sahifa Hero

### Maqsad

Birinchi ekranda “qayerga boramiz?” savoliga javob — Hotel / Flights / RentCar qidiruv.

### Tuzilish (Tourex uslubi)

```
┌─────────────────────────────────────────────┐
│  [Navbar — fixed, overlay]                  │
│                                             │
│         TO‘LIQ EKRAN FON (slider)           │
│                                             │
│              ┌─────────────────┐            │
│              │ Hotel│Flights│… │            │
│              │ [qidiruv forma] │            │
│              └────────┬────────┘            │
└───────────────────────┼─────────────────────┘
                        │ overlap
              ┌─────────▼─────────┐
              │ TourPackages...   │
              └───────────────────┘
```

### Tablar

| Tab | Default | Fon to‘plami | Route (Search) |
|-----|---------|--------------|----------------|
| Hotel | Ha | mehmonxona / resort | `/hotels` |
| Flights | | samolyot / osmon | `/flights` |
| RentCar | | avtomobil / yo‘l | `/rentcar` |

- Autoplay: 5 soniya (har tab ichida 3 rasm)
- `libs/data/heroBackgrounds.ts` — URL lar shu yerda

### Qidiruv kartasi

- Oq fon, yumaloq burchak, shadow
- Maydonlar: location, start date, end date, guests/drivers
- Tugma: `$velora-accent` “Search”

## 4. Bosh sahifa — pastki bloklar

O‘zgartirish talab qilinmagan (faqat spacing):

- `TourPackages` — Popular Tours / Hotels / Cars tablari (statik showcase)
- `TravelExperts`
- `PopularDestinations`

## 5. Ranglar va tipografiya

| Token | Qiymat | Qo‘llanish |
|-------|--------|------------|
| primary | #5b3df5 | CTA, active tab underline (ba’zi joylar) |
| accent | #ff6b2c | Search, logo gradient, active nav (home) |
| text-main | #181a20 | Asosiy matn |
| background-soft | #f5f7fb | Section fonlar |

Font: **Poppins** (`scss/variables.scss`)

## 6. Mobile

- Navbar: markaziy linklar → hamburger drawer
- Hero forma: 1 ustun
- `@media` ustuvor; `useDeviceDetect` faqat zarur joyda

## 7. Keyingi dizayn ishlar (reja)

### Chatbot (yuqori prioritet — hali qilinmadi)

- Kayak “Ask AI” **emas**
- Alohida **Assistant UI**
- Layout: foydalanuvchi **rasm** yuboradi — shu rasmga qarab UI

### Sahifalar

- Tours — API bilan to‘ldirish
- Flights / Hotels / RentCar — katalog dizayni
- Mypage / member — “coming soon” placeholderlarni haqiqiy layout bilan almashtirish

## 8. Amalga oshirish tarixi (qisqa)

| Bosqich | Holat | Asosiy fayllar |
|---------|-------|----------------|
| Navbar birlashtirish | Qilingan | `VeloraNavbar.tsx`, `navbar.scss` |
| Hero immersive | Qilingan | `HeaderFilter.tsx`, `hero.scss`, `heroBackgrounds.ts` |
| Overlap spacing | Qilingan | `hero.scss`, `LayoutHome.tsx` |
| Login bez navbar | Qilingan | `LayoutBasic.tsx`, `join.scss` |
| Til menyusi fix | Qilingan | `VeloraNavbar.tsx`, `.velora-lang-menu` |

---

Oxirgi yangilanish: loyiha suhbati va amalga oshirilgan UI o‘zgarishlariga asoslangan.
