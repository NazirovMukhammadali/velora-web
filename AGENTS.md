# Velora Web — Agent yo‘riqnomasi

Bu fayl keyingi agentlar uchun **dizayn g‘oyasi**, **qilingan ishlar** va **qoidalarni** bir joyda saqlaydi. Kod yozishdan oldin o‘qing.

## Loyiha qisqacha

- **Nom:** velora-web (travel booking frontend)
- **Stack:** Next.js 14, React 18, MUI, Apollo GraphQL, SCSS
- **Backend:** Nestar GraphQL — odatda `http://127.0.0.1:3007/graphql` (`.env.example`)
- **Ishga tushirish:** `yarn dev` (development). `yarn start` production build uchun.

---

## Dizayn manbalari (aralash, bittasini to‘liq ko‘chirmang)

| Manba | Nimalarni olish | Nimalarni olmaslik |
|--------|-----------------|-------------------|
| [nestar.uz](http://nestar.uz/) | Navbar tuzilishi: logo chap, linklar markazda, Login/Register + til o‘ngda; sticky navbar | Property hero (3 ta uy rasmi), property qidiruv maydonlari |
| Kayak | Rang palitrasi, travel his, accent Search tugmasi | “Ask AI” chatbot UI |
| Tourex (namuna) | To‘liq fon hero, pastda oq qidiruv kartasi (overlap), tablar | 6 ta tab (Restaurant, Activity…); markazda katta CTA “Take a tour” |

### Velora ranglari (`scss/variables.scss`)

- `$velora-primary` — #5b3df5
- `$velora-accent` — #ff6b2c (Search, active accent)
- `$velora-primary-dark`, `$velora-text-main`, `$velora-background-soft`

---

## Navbar (amalga oshirilgan)

**Komponent:** `libs/components/layout/VeloraNavbar.tsx`  
**Stillar:** `scss/pc/layout/navbar.scss`

### Tuzilish (Nestar)

- Chap: dumaloq logo mark + **VELORA**
- Markaz: **Home** `/` · **Tours** `/tours` · **Agents** `/agent` · **Community** `/community?articleCategory=FREE` · **CS** `/cs`
- O‘ng: **Login / Register** pill (`/login`) yoki avatar + My Page / Logout; til menyusi (en / kr / ru)

### Navbar da bo‘lmasin

Flights, Hotels, RentCar, Bookings — faqat bosh sahifa hero qidiruvida (tablar).

### Rejimlar

- **Bosh sahifa:** `<VeloraNavbar overlay />` — `LayoutHome.tsx`, fon ustida qorong‘u shaffaf bar, scroll da biroz qotadi
- **Boshqa sahifalar:** `<VeloraNavbar contrast />` — `LayoutBasic` / `LayoutFull`
- **Sticky:** `position: fixed`, `#top` spacer (overlay da height: 0, contrast da 80px)

### Auth sahifalar

`/login`, `/register`, `/account/join` — **navbar yo‘q**, **footer yo‘q**, Chat yo‘q.  
Fon: travel rasm + gradient overlay (`scss/pc/account/join.scss`).  
Layout: `id="pc-wrap"` + `className="pc-wrap--auth"` (ikkalasini `id` ga qo‘shmang — CSS buziladi).

### Til menyusi (muhim)

Bayroq PNG lar katta (`langen.png` ~1235px). Menyu MUI **portal**da — stillar `.velora-navbar` ichida emas, **global** `.velora-lang-menu` va `.img-flag` (24×17px) ishlatiladi.

---

## Bosh sahifa Hero (amalga oshirilgan)

**Komponent:** `libs/components/homepage/HeaderFilter.tsx`  
**Fonlar:** `libs/data/heroBackgrounds.ts`  
**Stillar:** `scss/pc/homepage/hero.scss`

### Xulq-atvor

- Tab tartibi: **Hotel** (default) → **Flights** → **RentCar**
- Tab almashtirilsa → fon to‘plami almashadi, slider 0 dan boshlanadi
- Har tabda 3 ta fon, **5 soniya** autoplay (`prefers-reduced-motion` da o‘chadi)
- Oq **qidiruv kartasi** hero pastida, ~50% overlap (`main-after-hero` padding bilan)
- Katta sarlavha / yon gallery / TAKE A TOUR **yo‘q**

### Layout

```text
#top → VeloraNavbar overlay
header-main--immersive → HeaderFilter (velora-hero)
#main.main-after-hero → TourPackages, TravelExperts, ...
```

`header-main--immersive` fon **transparent** (qora zola `#0f1118` ishlatilmaydi).

---

## Pastki sectionlar (o‘zgartirilmagan mantiq)

- `TourPackages`, `TravelExperts`, `PopularDestinations` — saqlanadi, faqat hero overlap uchun `padding-top` moslashtirilgan (`homepage.scss` / `hero.scss`).

---

## Ish jarayoni (majburiy)

Workspace qoidasi (`travel-booking-workflow`):

1. **Bir bosqich = bitta mantiqiy o‘zgarish**
2. Tugagach: *"Bosqich tugadi. Commit qiling va keyingi bosqichga ruxsat bering"*
3. Keyingi bosqich — foydalanuvchi commit + ruxsat bergandan keyin
4. Commit faqat foydalanuvchi so‘rasa

---

## Keyingi bosqichlar (reja)

Quyidagilarni **tartib bilan**, yuqoridagi qoidalarga rioya qilib bajaring:

1. **Chatbot Assistant UI** — Kayak “Ask AI” emas; dizayn foydalanuvchi yuborgan rasmga qarab (`libs/components/Chat.tsx` almashtirish yoki yangi widget)
2. **Tours API** — `/tours` hozir statik `libs/data/tours.ts`; `getTours` GraphQL ga ulash
3. **Flights / Hotels / RentCar** sahifalari — chiroyli katalog + `HeaderFilter` query parametrlarini uzatish
4. **README / i18n** — `Tours` va boshqa matnlar `common.json` ga
5. **Bayroq assetlar** — `public/img/flag/*.png` ni 24×17 atrofida optimallashtirish
6. **Mobile** — asosan `@media`, alohida “coming soon” placeholder qo‘shmang

---

## Muhim fayllar xaritasi

| Vazifa | Fayl |
|--------|------|
| Navbar | `libs/components/layout/VeloraNavbar.tsx`, `scss/pc/layout/navbar.scss` |
| Bosh layout | `libs/components/layout/LayoutHome.tsx` |
| Ichki layout | `libs/components/layout/LayoutBasic.tsx`, `LayoutFull.tsx` |
| Hero qidiruv | `libs/components/homepage/HeaderFilter.tsx`, `scss/pc/homepage/hero.scss` |
| Eski Top (re-export) | `libs/components/Top.tsx` → `VeloraNavbar` |
| Global SCSS import | `scss/pc/main.scss` (navbar.scss, hero.scss import qilingan) |
| Auth stillar | `scss/pc/account/join.scss` |

---

## Tez-tez xatolar (takrorlanmasin)

- `id="pc-wrap pc-wrap--auth"` — **noto‘g‘ri**; `id="pc-wrap"` `className="pc-wrap--auth"`
- Til menyusidagi `<img>` bez `width/height` — katta PNG butun ekranni egallaydi
- `velora-navbar--overlay` + `background: transparent` + oq matn — oq fonda linklar ko‘rinmaydi; overlay da doim qorong‘u shaffaf fon ishlating
- Bir vaqtda navbar + hero + chatbot + tours API — bosqichma-bosqich

---

## Foydalanuvchiga prompt berish (qisqa shablon)

```text
Vazifa: [bitta aniq bosqich]
Maqsad: [1–2 jumlada natija]
Cheklov: boshqa fayllarga tegmang; commit qilmang
Tekshirish: yarn dev, desktop + 768px
```

Batafsil dizayn: [docs/DESIGN.md](./docs/DESIGN.md)
