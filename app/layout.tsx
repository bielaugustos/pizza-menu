import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pizzaria Choupana | Delivery de pizza",
  description:
    "Pizza quente na sua porta. Monte o pedido no site, envie pelo WhatsApp e pague em dinheiro, cartão ou Pix.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#b3261e",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bowlby+One&family=DM+Sans:opsz,wght@9..40,400..700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
