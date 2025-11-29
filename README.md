# AccessKey - Smart Access Control System

🔐 **AccessKey** je moderan sistem za upravljanje pristupom pametnim bravama i uređajima.

## ✨ Funkcionalnosti

- **Autentikacija** - Siguran login i registracija korisnika
- **Upravljanje uređajima** - Dodavanje i konfiguracija pametnih brava, kapija, garaža
- **Deljenje pristupa** - Kreiranje vremenski ograničenih linkova za goste
- **Istorija aktivnosti** - Praćenje svih otvaranja i događaja
- **Responzivan dizajn** - Radi na svim uređajima

## 🎨 Brending

Aplikacija koristi **Inova Tech** boje:
- Primary: `#e95b0f` (narandžasta)
- Gray: `#818487`
- White: `#ffffff`
- Black: `#000000`

## 🚀 Pokretanje

### Lokalno

```bash
# Instaliraj dependencies
npm install

# Pokreni development server
npm run dev
```

Otvori [http://localhost:3000](http://localhost:3000)

### Demo Pristup

- **Email:** demo@accesskey.rs
- **Lozinka:** demo123

## 📁 Struktura Projekta

```
src/
├── app/                    # Next.js stranice
│   ├── (auth)/            # Login, Register
│   ├── (dashboard)/       # Dashboard, Devices, Access, Logs, Settings
│   └── guest/[token]/     # Guest unlock stranica
├── components/            # React komponente
│   ├── ui/               # Button, Input, Card, Modal...
│   └── layout/           # Sidebar, Header, Logo
├── contexts/             # Auth i Toast context
└── lib/                  # Types, Utils, Mock API
```

## 🔧 Tehnologije

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide Icons** - Ikonice

## 📱 Mock API

Aplikacija koristi simulirani API (`src/lib/mock-api.ts`) koji čuva podatke u localStorage. 
Kada se poveže sa pravim uređajem, samo ćemo zameniti mock funkcije sa TCP pozivima.

## 🌐 Deploy na Vercel

1. Push kod na GitHub
2. Poveži repo sa Vercel
3. Vercel će automatski deployovati

Ili koristi Vercel CLI:

```bash
npm i -g vercel
vercel
```

## 📄 Licenca

© 2024 Inova Tech IT. Sva prava zadržana.
