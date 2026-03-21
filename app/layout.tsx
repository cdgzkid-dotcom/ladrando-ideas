import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ladrando Ideas | Podcast",
  description:
    "Podcast sobre perros, mascotas y bienestar animal con Christian Dominguez y Kiko desde Guadalajara, Mexico.",
  openGraph: {
    title: "Ladrando Ideas",
    description:
      "Podcast sobre perros, mascotas y bienestar animal.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
