import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Playfair_Display, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DBS — Transformação Tecnológica | Assurant Brasil",
  description:
    "De um monolito Java EE com 42 dívidas técnicas e 9 CVEs críticos para arquitetura cloud-native .NET 9 / Azure Container Apps com 163 testes e zero vulnerabilidades críticas.",
  keywords: [
    "Assurant DBS",
    "transformação digital",
    "Azure Container Apps",
    ".NET 9",
    "Clean Architecture",
    "Sistran",
    "Lumina AI",
  ],
  openGraph: {
    title: "DBS — Transformação Tecnológica | Assurant Brasil",
    description: "Dois caminhos analisados, uma decisão implementada.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${playfair.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
