import { Home, Utensils, CalendarDays, ShoppingCart, User } from "lucide-react";

export default function BottomNav({ cartCount = 0 }: { cartCount?: number }) {
  return (
    <nav className="bottom-nav">
      <button className="nav-item active"><Home size={19}/><span>Inicio</span></button>
      <button className="nav-item"><Utensils size={19}/><span>Menú</span></button>
      <button className="nav-item"><CalendarDays size={19}/><span>Mi semana</span></button>
      <button className="nav-item"><ShoppingCart size={19}/><span>Carrito {cartCount > 0 && <b className="cart-badge">{cartCount}</b>}</span></button>
      <button className="nav-item"><User size={19}/><span>Cuenta</span></button>
    </nav>
  );
}