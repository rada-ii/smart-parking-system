import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ToastContainer } from "@/components/ui/Toast";

/**
 * ROOT LAYOUT
 * ============
 *
 * Ovo je glavni layout cele aplikacije.
 * Svaka stranica se renderuje unutar ovog layouta.
 *
 * ŠTA RADI:
 * 1. Učitava Inter font (preko CSS)
 * 2. Postavlja meta tagove (SEO)
 * 3. Wrappuje aplikaciju sa Providerima
 * 4. Prikazuje Toast notifikacije
 * 5. Upravlja Dark/Light temom
 * 6. Upravlja Push notifikacijama
 */

// Meta podaci za SEO
export const metadata: Metadata = {
  title: {
    default: "Parking System | Inova Tech",
    template: "%s | Parking System",
  },
  description:
    "Sistem za upravljanje parkingom i kontrolu pristupa. Pametne rampe, registracija vozila, pristup gostima.",
  keywords: [
    "parking",
    "rampa",
    "pristup",
    "kontrola",
    "vozila",
    "smart parking",
  ],
  authors: [{ name: "Inova Tech" }],
  creator: "Inova Tech",
  icons: {
    icon: "/car-parking.png",
    apple: "/car-parking.png",
  },
  openGraph: {
    type: "website",
    locale: "sr_RS",
    url: "https://parking.inovatech.rs",
    siteName: "Parking System",
    title: "Parking System | Inova Tech",
    description: "Sistem za upravljanje parkingom i kontrolu pristupa",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sr" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {/* 
          PROVIDERI
          ---------
          ThemeProvider: Upravlja Dark/Light temom
          AuthProvider: Čuva stanje ulogovanog korisnika
          ToastProvider: Upravlja notifikacijama
          NotificationProvider: Push notifikacije
        */}
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <NotificationProvider>
                {/* Glavni sadržaj */}
                {children}

                {/* Toast notifikacije (prikazuje se preko svega) */}
                <ToastContainer />
              </NotificationProvider>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
