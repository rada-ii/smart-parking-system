# AccessKey - Smart Access Control System

🔐 **AccessKey** is a modern smart lock access management system built with Next.js and TypeScript.

[![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.4-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.18-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Private-red)](LICENSE)

---

## ✨ Features / Funkcionalnosti

### 🌟 Core Features

- **🔐 Secure Authentication** - Login and user registration system
- **🏠 Device Management** - Add and configure smart locks, gates, and garage doors
- **🔗 Access Sharing** - Create time-limited access links for guests
- **📊 Activity Logs** - Track all access events and openings
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### 🎨 UI/UX Features

- **🌙 Dark Mode Support** - Toggle between light and dark themes
- **🎭 Beautiful Animations** - Smooth transitions and micro-interactions
- **🎯 Intuitive Dashboard** - Easy-to-use interface for all users
- **📱 Mobile-First Design** - Optimized for mobile experience

---

## 🛠️ Technology Stack / Tehnologije

| Technology              | Version | Description                     |
| ----------------------- | ------- | ------------------------------- |
| **Next.js**             | 14.2.5  | React framework with App Router |
| **TypeScript**          | 5.5.4   | Type-safe JavaScript            |
| **Tailwind CSS**        | 3.4.18  | Utility-first CSS framework     |
| **React**               | 18.3.1  | UI library                      |
| **Lucide Icons**        | 0.441.0 | Beautiful icon set              |
| **tailwind-merge**      | 2.5.2   | Utility class merging           |
| **tailwindcss-animate** | 1.0.7   | Animation utilities             |

---

## 🚀 Quick Start / Brzo Pokretanje

### Prerequisites / Preduslovi

- Node.js 18.0+
- npm, yarn, or pnpm

### Installation / Instalacija

```bash
# Clone the repository
git clone https://github.com/your-username/smart-parking.git
cd smart-parking

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

---

## 🎨 Branding & Theming / Brending

**Inova Tech** Color Palette:

```css
/* Primary Colors */
--primary: #e95b0f    /* Orange */
--primary-hover: #d14e0a
--primary-light: #fff7ed

/* Gray Scale */
--gray: #818487
--background: #f9fafb
--foreground: #111827
```

### Available Utility Classes

- `bg-primary-500` - Main orange background
- `text-primary-600` - Darker orange for text
- `hover:bg-primary-600` - Hover state
- `text-gradient` - Gradient text effect
- `glass` - Glass morphism effect
- `shadow-soft` - Soft shadow effect
- `shadow-glow` - Orange glow effect

---

## 📁 Project Structure / Struktura Projekta

```
smart-parking/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Authentication pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/              # Dashboard pages
│   │   │   ├── dashboard/
│   │   │   ├── devices/
│   │   │   ├── access/
│   │   │   ├── logs/
│   │   │   └── settings/
│   │   ├── guest/[token]/           # Guest access page
│   │   ├── globals.css              # Global styles
│   │   ├── layout.tsx               # Root layout
│   │   └── page.tsx                 # Home page
│   ├── components/                  # React components
│   │   ├── ui/                      # Base UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── modal.tsx
│   │   └── layout/                  # Layout components
│   │       ├── sidebar.tsx
│   │       ├── header.tsx
│   │       └── logo.tsx
│   ├── contexts/                    # React contexts
│   │   ├── auth-context.tsx
│   │   └── toast-context.tsx
│   └── lib/                         # Utilities and types
│       ├── types.ts
│       ├── utils.ts
│       └── api.ts
├── public/                          # Static assets
├── tailwind.config.ts              # Tailwind configuration
├── postcss.config.js               # PostCSS configuration
├── next.config.js                  # Next.js configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Dependencies and scripts
└── README.md                       # This file
```

---

## 🎯 Available Scripts / Dostupne Skripte

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types

# Debugging
npm run debug        # Debug Next.js app
```

---

## 🌐 Environment Variables / Promenljive Okruženja

Create a `.env.local` file in the root directory:

```env
# Application
NEXT_PUBLIC_APP_NAME="AccessKey"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# API (if applicable)
# NEXT_PUBLIC_API_URL="https://api.accesskey.rs"
# API_SECRET_KEY="your-secret-key"

# Database (if applicable)
# DATABASE_URL="postgresql://user:password@localhost:5432/accesskey"
```

---

## 📱 Browser Support / Podrška Pretraživača

This project supports all modern browsers:

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## 🔧 Development Guidelines / Smernice za Razvoj

### Code Style

- Use TypeScript for all new files
- Follow Tailwind CSS utility-first approach
- Use semantic HTML elements
- Implement proper error boundaries
- Write responsive-first designs

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Commit changes
git commit -m "feat: add new feature description"

# Push branch
git push origin feature/your-feature-name
```

### Component Structure

```tsx
// Example component structure
export default function ComponentName() {
  return <div className="component-styles">{/* Component content */}</div>;
}
```

---

## 🤝 Contributing / Doprinos

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 Demo Account / Demo Pristup

For testing purposes, you can use the demo credentials:

- **Email:** demo@accesskey.rs
- **Password:** demo123

---

## 🔒 Security / Sigurnost

- Input validation and sanitization
- JWT token-based authentication
- CORS configuration
- Rate limiting implementation
- Secure password hashing

---

## 📄 License / Licenca

© 2025 Inova Tech IT. All rights reserved.

**Proprietary Software** - This project is proprietary software and may not be redistributed without permission from Inova Tech IT.

---

## 📞 Support / Podrška

For support and inquiries:

- **Email:** support@inova-tech.rs
- **Website:** [inova-tech.rs](https://inova-tech.rs)

---

## 🗺️ Roadmap / Razvojni Plan

### Version 1.1.0 (Planned)

- [ ] Real-time notifications
- [ ] Mobile app companion
- [ ] Advanced analytics dashboard
- [ ] Multi-language support

### Version 1.2.0 (Future)

- [ ] IoT device integration
- [ ] AI-powered access patterns
- [ ] Advanced reporting
- [ ] API for third-party integrations
