# El Bodegoncito Viandas

Primera versión de la app.

## 1. Instalar

```bash
npm install
```

## 2. Ejecutar

```bash
npm run dev
```

Abrir http://localhost:3000

## Precios

Los precios iniciales están en:

`lib/config.ts`

Actualmente:
- Vianda unitaria: $9.500
- Pack semanal: $9.000 por vianda
- Mínimo pack: 3 viandas
- Cierre de pedidos: 16:00
- Envío: $1.700

## Próximo paso

Conectar Supabase y crear el panel `/admin` para modificar precios, menú, pedidos, zonas y promociones sin tocar código.
