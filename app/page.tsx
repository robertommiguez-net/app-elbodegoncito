 "use client";

import { useMemo, useState } from "react";
import { ShoppingCart, Menu as MenuIcon, Clock3, Plus, Minus, CalendarDays } from "lucide-react";
import BottomNav from "../components/BottomNav";
import { businessConfig, menu, weekDays } from "../lib/config";

export default function Home() {
  const [cart, setCart] = useState(0);
  const [weeklyDays, setWeeklyDays] = useState<string[]>([]);
  const [showCart, setShowCart] = useState(false);

  const now = new Date();
  const cutoffPassed = now.getHours() >= businessConfig.orderCutoffHour;
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const tomorrowName = tomorrow.toLocaleDateString("es-AR", { weekday: "long" });

  const weeklyTotal = useMemo(
    () => weeklyDays.length * businessConfig.weeklyPackPrice,
    [weeklyDays]
  );

  function addUnit() { setCart(v => v + 1); }

  function toggleDay(day: string) {
    setWeeklyDays(days =>
      days.includes(day) ? days.filter(d => d !== day) : [...days, day]
    );
  }

  return (
    <main className="app-shell">
      <header className="header">
        <div className="logo">
          EL BODEGONCITO
          <span>Comida casera, abundante y nutritiva</span>
        </div>
        <button className="icon-btn" onClick={() => setShowCart(true)} aria-label="Carrito">
          <ShoppingCart size={20}/>
        </button>
      </header>

      <section className="hero">
        <h1>¿Qué vas a comer?</h1>
        <p>Pedí para mañana o armá tu semana y disfrutá comida casera sin cocinar.</p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={addUnit}>
            ⚡ PEDIR {cutoffPassed ? "PASADO MAÑANA" : "PARA MAÑANA"}
          </button>
          <button className="btn btn-light" onClick={() => document.getElementById("semana")?.scrollIntoView({behavior:"smooth"})}>
            📅 MI SEMANA
          </button>
        </div>
      </section>

      <div className="notice">
        <Clock3 size={15} style={{verticalAlign:"middle", marginRight:6}}/>
        Los pedidos unitarios cierran a las <strong>{businessConfig.orderCutoffHour}:00 hs</strong>.
        {cutoffPassed
          ? " Ya podés reservar para el día siguiente disponible."
          : ` Todavía estás a tiempo para ${tomorrowName}.`}
      </div>

      <section className="section">
        <div className="section-title">
          <h2>Menú de hoy</h2>
          <small>Disponible para reserva</small>
        </div>
        <div className="chips">
          <button className="chip active">Todos</button>
          <button className="chip">Descenso</button>
          <button className="chip">Proteína+</button>
          <button className="chip">Saludable</button>
        </div>
      </section>

      <section className="section">
        <article className="card">
          <div className="food-image">{menu.emoji}</div>
          <div className="card-body">
            <div className="card-row">
              <div>
                <h3>{menu.title}</h3>
                <p>{menu.description}</p>
              </div>
              <div className="price">{businessConfig.currency}{businessConfig.unitPrice.toLocaleString("es-AR")}</div>
            </div>
            <button className="add" onClick={addUnit}>
              <Plus size={17} style={{verticalAlign:"middle", marginRight:5}}/> AGREGAR AL PEDIDO
            </button>
          </div>
        </article>
      </section>

      <section className="section" id="semana">
        <div className="section-title">
          <h2>📅 Armá tu semana</h2>
          <small>${businessConfig.weeklyPackPrice.toLocaleString("es-AR")}/vianda</small>
        </div>
        <p style={{color:"#68716b",fontSize:13}}>
          Elegí desde {businessConfig.weeklyPackMinimum} días y obtené el precio del pack semanal.
        </p>

        <div className="week">
          {weekDays.map(day => {
            const selected = weeklyDays.includes(day);
            return (
              <button
                key={day}
                className="day"
                onClick={() => toggleDay(day)}
                style={{background:selected ? "#f1f6e7" : "#fff"}}
              >
                <span>
                  <strong>{day}</strong>
                  <small>{selected ? "Seleccionado" : "Elegir menú"}</small>
                </span>
                {selected ? <Minus size={18}/> : <Plus size={18}/>}
              </button>
            );
          })}
        </div>

        <div style={{marginTop:14, padding:"15px 16px", background:"#1e2a23", color:"#fff", borderRadius:17}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span>{weeklyDays.length} viandas</span>
            <strong>${weeklyTotal.toLocaleString("es-AR")}</strong>
          </div>
          <button
            className="btn btn-primary"
            style={{width:"100%", marginTop:11}}
            disabled={weeklyDays.length < businessConfig.weeklyPackMinimum}
          >
            <CalendarDays size={16} style={{verticalAlign:"middle",marginRight:5}}/>
            RESERVAR MI SEMANA
          </button>
        </div>
      </section>

      {showCart && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.35)",zIndex:30}} onClick={() => setShowCart(false)}>
          <div
            style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:"min(520px,100%)",background:"#fff",borderRadius:"24px 24px 0 0",padding:22}}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{marginTop:0}}>🛒 Tu pedido</h2>
            <p>{cart} vianda{cart !== 1 ? "s" : ""} × ${businessConfig.unitPrice.toLocaleString("es-AR")}</p>
            <strong style={{fontSize:22}}>${(cart * businessConfig.unitPrice).toLocaleString("es-AR")}</strong>
            <button className="add" style={{marginTop:18}}>CONTINUAR PEDIDO</button>
            <button className="btn" style={{width:"100%",marginTop:8}} onClick={() => setShowCart(false)}>Seguir mirando</button>
          </div>
        </div>
      )}

      <BottomNav cartCount={cart}/>
    </main>
  );
}