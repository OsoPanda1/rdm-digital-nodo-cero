import type { Metadata } from "next"
import { Inter, Cormorant_Garamond, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
})

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
})

export const metadata: Metadata = {
  title: "RDM Digital — Kernel Heptafederado TAMV MD-X4 · Soberanía Tecnológica desde Real del Monte",
  description:
    "Compendio de Soberanía Tecnológica y Arquitectura Civilizatoria. Sistema Operativo Urbano de Real del Monte, Hidalgo. Autor: Edwin Oswaldo Castillo Trejo (Anubis Villaseñor). ORCID 0009-0008-5050-1539.",
  generator: "RDM Digital · TAMV Online Network",
  keywords: [
    "TAMV",
    "RDM Digital",
    "Real del Monte",
    "Soberanía Tecnológica",
    "Kernel MD-X4",
    "Heptafederado",
    "Anubis Villaseñor",
    "Edwin Oswaldo Castillo Trejo",
    "CITEMESH",
    "Isabella IA",
    "Edge Supremacy",
    "Sur Global",
  ],
  authors: [
    {
      name: "Edwin Oswaldo Castillo Trejo (Anubis Villaseñor)",
      url: "https://orcid.org/0009-0008-5050-1539",
    },
  ],
  openGraph: {
    title: "RDM Digital · Kernel Heptafederado TAMV MD-X4",
    description:
      "Sistema operativo urbano soberano. Real del Monte, Hidalgo. Una arquitectura civilizatoria desde el Sur Global.",
    type: "website",
    locale: "es_MX",
  },
}

export const viewport = {
  themeColor: "#1a1614",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es-MX" className={`${inter.variable} ${cormorant.variable} ${jetbrains.variable} bg-background dark`}>
      <body className="font-sans antialiased min-h-screen">
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
