# Checkpoint v1 — Solaris Glass Complete

**Data:** 2026-05-03  
**Commit:** 765df9e  
**Branch:** main  
**Deploy:** https://bounty-workflow.vercel.app

---

## O que está pronto neste checkpoint

### Design System — Solaris Glass
- Paleta completa: laranja `#ff5c00` / `#ffb59a`, dourado `#e9c349`, superfícies escuras `#131313`
- Grid texture de fundo em todas as páginas
- Glassmorphism com `backdrop-blur-xl` + gradiente dourado nas bordas
- Material Symbols Outlined (Google Fonts) para todos os ícones
- Tipografia Space Grotesk (display) + Inter (body)

### Páginas públicas
- `/` — Landing page Solaris Glass com hero, features bento, stats bento, PT/EN toggle com detecção automática via `Accept-Language`
- `/como-funciona` — Tour de 3 minutos redesenhado com tema atual
- Header fixo com logo oficial em ambas as páginas

### App (autenticado)
- **Sidebar** — Protocols primeiro no menu, logo oficial, botão "Nova Campanha" laranja
- **Dashboard** — Bento grid: Drive card, Subscription, métricas circulares, timeline recente
- **Campaigns** — Stats row, timeline por deadline com glass cards
- **Protocols** — Catálogo dos 4 protocolos: Clasho, Kreators, MagVerse, Rally
- **Campaign Detail** — 3 colunas: header metrics + Fluxo de Protocolo (nós cascata) + painel direito (detalhes, tarefas, dropzone)

### Auth
- Login e Signup com layout glass centralizado + glow laranja

### Assets
- Logo oficial em `/public/logo.png`
- Favicon automático via `src/app/icon.png` (Next.js App Router)

### Infraestrutura
- Next.js 16 App Router + Supabase + Tailwind v4
- Deploy automático na Vercel via push no `main`
- SQL migration: `supabase/migrations/20260502000001_reset_protocols.sql` (aplicar manualmente no Supabase SQL Editor se os protocolos antigos ainda aparecerem)

---

## Pendente (próximas sessões)
- [ ] Aplicar migration SQL dos protocolos no Supabase (se ainda não foi feito)
- [ ] Páginas de Settings, Archive, Reminders — ainda no tema antigo
- [ ] Páginas legais (`/legal/termos`, `/legal/privacidade`) — ainda no tema antigo
- [ ] Testes de fluxo completo: criar campanha → adicionar tarefas → upload de arquivo
