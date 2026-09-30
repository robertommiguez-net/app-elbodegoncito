import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "El Bodegoncito Viandas",
  description: "Comida casera, abundante y nutritiva.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="es"><body>{children}</body></html>;
}