# Álbum Copa do Mundo FIFA 2026 🏆

Aplicação web para gerenciar a coleção de figurinhas Panini da Copa do Mundo FIFA 2026. Permite marcar figurinhas possuídas, controlar repetidas para troca e compartilhar listas via WhatsApp — tudo em tempo real entre múltiplos dispositivos.

**Demo:** [album-copadomundo-2026.netlify.app](https://album-copadomundo-2026.netlify.app)

---

## Funcionalidades

- **980 figurinhas** organizadas pelos 12 grupos da Copa (A–L) + seção FWC Introdução + bônus Coca-Cola
- **3 estados por figurinha:** faltando → tenho → repetida (×2)
- **Filtros:** Todas · Tenho · Faltam · Repetidas
- **Lista de trocas interativa** — toque na figurinha para marcar como trocada
- **Compartilhamento via WhatsApp** das listas de faltando e repetidas
- **Sync em tempo real** entre dispositivos via Supabase (coleção compartilhada por URL)
- **Modo local** sem necessidade de conta (dados no localStorage)
- **PWA instalável** — funciona offline, adiciona à tela inicial no iOS e Android
- **Onboarding** na primeira visita explicando o ciclo de clique

---

## Stack

| Camada | Tecnologia |
|--------|------------|
| Framework | React 18 + Vite |
| Estilo | Tailwind CSS v4 |
| Backend / Sync | Supabase (PostgreSQL + Realtime) |
| Deploy | Netlify |

---

## Estrutura do projeto

```
src/
├── App.jsx                  # Roteamento por filtro, estado global
├── context/
│   └── SnackbarContext.jsx  # Toast global (Web Share API)
├── components/
│   ├── Header.jsx           # Título, progresso, botão compartilhar
│   ├── StatsBar.jsx         # Chips: Todas / Tenho / Faltam / Repetidas
│   ├── SectionGroup.jsx     # Acordeão por time com progress bar
│   ├── StickerGrid.jsx      # Grid responsivo de figurinhas
│   ├── StickerCard.jsx      # Card com 3 estados + ripple + faixa ×2
│   ├── MissingList.jsx      # Lista plana de figurinhas faltando
│   ├── TradingList.jsx      # Lista de repetidas com marcar como trocada
│   ├── RoomSetup.jsx        # Tela inicial: criar / entrar em coleção
│   ├── Onboarding.jsx       # Tutorial de 3 cards na primeira visita
│   ├── SettingsSheet.jsx    # Bottom sheet com opção de reset
│   └── Footer.jsx           # Rodapé com acesso às configurações
├── hooks/
│   └── useAlbum.js          # Estado local + debounce + sync Supabase
├── lib/
│   ├── supabase.js          # Cliente Supabase + helpers de sala
│   └── share.js             # Web Share API com fallback wa.me
└── data/
    └── albumData.js         # 980 figurinhas: grupos A–L, FWC, Coca-Cola
```

---

## Começando

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie `.env.example` para `.env` e preencha com suas credenciais do Supabase:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
```

> Sem essas variáveis o app roda em **modo local** (dados apenas no dispositivo).

### 3. Criar tabela no Supabase

Execute no SQL Editor do seu projeto Supabase:

```sql
CREATE TABLE collections (
  id TEXT PRIMARY KEY,
  name TEXT,
  data JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER PUBLICATION supabase_realtime ADD TABLE collections;
```

### 4. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:5173`

---

## Deploy

```bash
npm run build
npx netlify-cli deploy --prod --dir=dist
```

Configure as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no painel do Netlify em **Site settings → Environment variables**.

---

## Compartilhamento

Cada coleção tem um nome único que vira a URL:

```
https://album-copadomundo-2026.netlify.app/?sala=familia-silva
```

Qualquer pessoa com o link acessa e edita a mesma coleção em tempo real.

---

## PWA — Instalar no celular

**iOS (Safari):** Compartilhar → Adicionar à Tela de Início

**Android (Chrome):** Banner automático de instalação, ou Menu → Adicionar à tela inicial

O app funciona offline após a primeira visita.
