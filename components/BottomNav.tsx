"use client";

import { Home, Utensils, CalendarDays, ShoppingCart, User } from "lucide-react";

export type AppView = "inicio" | "menu" | "semana" | "carrito" | "cuenta";

export default function BottomNav({ cartCount = 0, active, onNavigate }: { cartCount?: number; active: AppView; onNavigate: (view: AppView) => void }) {
  const items: { view: AppView; label: string; icon: React.ReactNode }[] = [
    { view: "inicio", label: "Inicio", icon: <Home size={19}/> },
    { view: "menu", label: "Menú", icon: <Utensils size={19}/> },
    { view: "semana", label: "Mi semana", icon: <CalendarDays size={19}/> },
    { view: "carrito", label: "Carrito", icon: <ShoppingCart size={19}/> },
    { view: "cuenta", label: "Cuenta", icon: <User size={19}/> },
  ];
  return <nav className="bottom-nav">
    {items.map(item => <button key={item.view} className={`nav-item ${active === item.view ? "active" : ""}`} onClick={() => onNavigate(item.view)}>
      {item.icon}<span>{item.label} {item.view === "carrito" && cartCount > 0 && <b className="cart-badge">{cartCount}</b>}</span>
    </button>)}
  </nav>;
}
