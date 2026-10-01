"use client";

import { useMemo, useState } from "react";
import { ShoppingCart, Clock3, Plus, Minus, CalendarDays, ArrowLeft, CheckCircle2, UserRound, MapPin, MessageCircle } from "lucide-react";
import BottomNav, { AppView } from "../components/BottomNav";
import { businessConfig, menu, weekDays } from "../lib/config";

type Category = "Todos" | "Descenso" | "Proteína+" | "Saludable";

export default function Home() {
  const [view, setView] = useState<AppView>("inicio");
  const [category, setCategory] = useState<Category>("Todos");
  const [cart, setCart] = useState(0);
  const [weeklyDays, setWeeklyDays] = useState<string[]>([]);
  const [checkout, setCheckout] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "" });

  const now = new Date();
  const cutoffPassed = now.getHours() >= businessConfig.orderCutoffHour;
  const tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1);
  const tomorrowName = tomorrow.toLocaleDateString("es-AR", { weekday: "long" });
  const weeklyTotal = useMemo(() => weeklyDays.length * businessConfig.weeklyPackPrice, [weeklyDays]);
  const unitTotal = cart * businessConfig.unitPrice;
  const totalWithDelivery = unitTotal + (cart > 0 ? businessConfig.deliveryFee : 0);

  function addUnit() { setCart(v => v + 1); setView("carrito"); }
  function removeUnit() { setCart(v => Math.max(0, v - 1)); }
  function toggleDay(day: string) { setWeeklyDays(days => days.includes(day) ? days.filter(d => d !== day) : [...days, day]); }
  function go(viewName: AppView) { setView(viewName); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function startUnitOrder() { setCart(v => v + 1); go("carrito"); }
  function finishOrder() { if (!customer.name.trim() || !customer.phone.trim()) return; setOrderDone(true); }

  if (orderDone) return <main className="app-shell"><section className="hero" style={{marginTop:20}}><CheckCircle2 size={54}/><h1>¡Pedido recibido!</h1><p>Gracias, {customer.name}. Te contactaremos para confirmar el pedido y la entrega.</p><button className="btn btn-primary" onClick={() => {setOrderDone(false); setCheckout(false); go("inicio")}}>VOLVER AL INICIO</button></section><BottomNav cartCount={cart} active="inicio" onNavigate={go}/></main>;

  return <main className="app-shell">
    <header className="header">
      <div className="logo">EL BODEGONCITO<span>Comida casera, abundante y nutritiva</span></div>
      <button className="icon-btn" onClick={() => go("carrito")} aria-label="Carrito"><ShoppingCart size={20}/>{cart > 0 && <b className="cart-badge">{cart}</b>}</button>
    </header>

    {view === "inicio" && <>
      <section className="hero"><h1>¿Qué vas a comer?</h1><p>Pedí para mañana o armá tu semana y disfrutá comida casera sin cocinar.</p><div className="hero-actions">
        <button className="btn btn-primary" onClick={startUnitOrder}>⚡ PEDIR {cutoffPassed ? "PASADO MAÑANA" : "PARA MAÑANA"}</button>
        <button className="btn btn-light" onClick={() => go("semana")}>📅 MI SEMANA</button>
      </div></section>
      <Notice cutoffPassed={cutoffPassed} tomorrowName={tomorrowName}/>
      <MenuSection category={category} setCategory={setCategory} addUnit={addUnit}/>
      <WeekSection weeklyDays={weeklyDays} toggleDay={toggleDay} weeklyTotal={weeklyTotal} go={go}/>
    </>}

    {view === "menu" && <><PageTitle title="Nuestro menú" subtitle="Elegí tu vianda y agregala al pedido." onBack={() => go("inicio")}/><Notice cutoffPassed={cutoffPassed} tomorrowName={tomorrowName}/><MenuSection category={category} setCategory={setCategory} addUnit={addUnit}/></>}

    {view === "semana" && <><PageTitle title="Armá tu semana" subtitle={`Desde ${businessConfig.weeklyPackMinimum} viandas.`} onBack={() => go("inicio")}/><WeekSection weeklyDays={weeklyDays} toggleDay={toggleDay} weeklyTotal={weeklyTotal} go={go}/></>}

    {view === "carrito" && <><PageTitle title="Tu pedido" subtitle="Revisá las viandas antes de confirmar." onBack={() => go("inicio")}/>
      <section className="section"><article className="card"><div className="food-image">{menu.emoji}</div><div className="card-body"><h3>{menu.title}</h3><p>{menu.description}</p><div className="card-row"><strong>${businessConfig.unitPrice.toLocaleString("es-AR")} c/u</strong><div className="qty"><button onClick={removeUnit}><Minus size={16}/></button><strong>{cart}</strong><button onClick={() => setCart(v => v + 1)}><Plus size={16}/></button></div></div></div></article>
        <div className="order-summary"><div><span>Viandas</span><strong>${unitTotal.toLocaleString("es-AR")}</strong></div><div><span>Envío</span><strong>${(cart > 0 ? businessConfig.deliveryFee : 0).toLocaleString("es-AR")}</strong></div><div className="total"><span>Total</span><strong>${totalWithDelivery.toLocaleString("es-AR")}</strong></div></div>
        {cart > 0 ? <button className="btn btn-primary" style={{width:"100%"}} onClick={() => setCheckout(true)}>CONTINUAR PEDIDO</button> : <div className="empty"><ShoppingCart size={36}/><p>Tu carrito está vacío.</p><button className="btn btn-light" onClick={() => go("menu")}>VER MENÚ</button></div>}
      </section></>}

    {view === "cuenta" && <><PageTitle title="Mi cuenta" subtitle="Tus datos para realizar pedidos más rápido." onBack={() => go("inicio")}/><section className="section"><div className="form-card"><UserRound size={30}/><label>Nombre<input value={customer.name} onChange={e => setCustomer({...customer,name:e.target.value})} placeholder="Tu nombre"/></label><label>WhatsApp<input value={customer.phone} onChange={e => setCustomer({...customer,phone:e.target.value})} placeholder="11 1234 5678"/></label><label>Dirección de entrega<input value={customer.address} onChange={e => setCustomer({...customer,address:e.target.value})} placeholder="Calle y número"/></label><button className="btn btn-primary" onClick={() => go("inicio")}>GUARDAR DATOS</button></div></section></>}

    {checkout && <div className="overlay" onClick={() => setCheckout(false)}><div className="modal" onClick={e => e.stopPropagation()}><h2>Confirmar pedido</h2><p>Completá tus datos y te contactamos para coordinar la entrega.</p><label>Nombre<input value={customer.name} onChange={e => setCustomer({...customer,name:e.target.value})} placeholder="Tu nombre"/></label><label>WhatsApp<input value={customer.phone} onChange={e => setCustomer({...customer,phone:e.target.value})} placeholder="Tu WhatsApp"/></label><label>Dirección<input value={customer.address} onChange={e => setCustomer({...customer,address:e.target.value})} placeholder="Dirección de entrega"/></label><button className="btn btn-primary" style={{width:"100%"}} onClick={finishOrder} disabled={!customer.name.trim() || !customer.phone.trim()}><MessageCircle size={17}/> CONFIRMAR PEDIDO</button><button className="btn btn-light" style={{width:"100%",marginTop:8}} onClick={() => setCheckout(false)}>CANCELAR</button></div></div>}

    <BottomNav cartCount={cart} active={view} onNavigate={go}/>
  </main>;
}

function PageTitle({title,subtitle,onBack}:{title:string;subtitle:string;onBack:()=>void}) { return <section className="page-title"><button className="back" onClick={onBack}><ArrowLeft size={18}/> Volver</button><h1>{title}</h1><p>{subtitle}</p></section>; }
function Notice({cutoffPassed,tomorrowName}:{cutoffPassed:boolean;tomorrowName:string}) { return <div className="notice"><Clock3 size={15}/><span>Pedidos unitarios hasta las <strong>{businessConfig.orderCutoffHour}:00 hs</strong>. {cutoffPassed ? "La próxima fecha disponible se muestra al pedir." : `Todavía estás a tiempo para ${tomorrowName}.`}</span></div>; }
function MenuSection({category,setCategory,addUnit}:{category:Category;setCategory:(c:Category)=>void;addUnit:()=>void}) { const cats:Category[]=["Todos","Descenso","Proteína+","Saludable"]; return <section className="section"><div className="section-title"><h2>Menú</h2><small>Disponible para reserva</small></div><div className="chips">{cats.map(c=><button key={c} className={`chip ${category===c?"active":""}`} onClick={()=>setCategory(c)}>{c}</button>)}</div><article className="card"><div className="food-image">{menu.emoji}</div><div className="card-body"><div className="card-row"><div><h3>{menu.title}</h3><p>{menu.description}</p></div><div className="price">{businessConfig.currency}{businessConfig.unitPrice.toLocaleString("es-AR")}</div></div><button className="add" onClick={addUnit}><Plus size={17}/> AGREGAR AL PEDIDO</button></div></article></section>; }
function WeekSection({weeklyDays,toggleDay,weeklyTotal,go}:{weeklyDays:string[];toggleDay:(d:string)=>void;weeklyTotal:number;go:(v:AppView)=>void}) { return <section className="section" id="semana"><div className="section-title"><h2>📅 Armá tu semana</h2><small>${businessConfig.weeklyPackPrice.toLocaleString("es-AR")}/vianda</small></div><p style={{color:"#68716b",fontSize:13}}>Elegí desde {businessConfig.weeklyPackMinimum} días y obtené el precio del pack semanal.</p><div className="week">{weekDays.map(day=>{const selected=weeklyDays.includes(day);return <button key={day} className="day" onClick={()=>toggleDay(day)} style={{background:selected?"#f1f6e7":"#fff"}}><span><strong>{day}</strong><small>{selected?"Seleccionado":"Elegir menú"}</small></span>{selected?<Minus size={18}/>:<Plus size={18}/>}</button>})}</div><div style={{marginTop:14,padding:"15px 16px",background:"#1e2a23",color:"#fff",borderRadius:17}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span>{weeklyDays.length} viandas</span><strong>${weeklyTotal.toLocaleString("es-AR")}</strong></div><button className="btn btn-primary" style={{width:"100%",marginTop:11}} disabled={weeklyDays.length < businessConfig.weeklyPackMinimum} onClick={()=>go("carrito")}><CalendarDays size={16}/> RESERVAR MI SEMANA</button></div></section>; }
