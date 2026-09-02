import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "PannonGuard Komplex – Igazgatói Tanács Bemutató",
  description: "PannonGuard Komplex vállalatirányítási rendszer bemutató az igazgatói tanács számára",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu" className={montserrat.variable}>
      <body style={{ margin: 0, padding: 0, overflow: "hidden", height: "100vh", width: "100vw", background: "#0d1628" }}>
        {children}
      </body>
    </html>
  );
}
