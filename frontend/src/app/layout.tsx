import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ayolin Chatbot App",
  description: "Create your own AI chatbot with Ayolin. No coding required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={``}
      >
        {children}
      </body>
    </html>
  );
}
