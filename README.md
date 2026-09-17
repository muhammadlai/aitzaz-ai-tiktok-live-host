# AITZAZ AI — TikTok LIVE Host

A single Super AI host for TikTok LIVE: conversational AI, memory, event reactions, gifts, battle/PK adapter hooks, moderation, realistic voice/avatar adapters, and a browser-test dashboard.

## Current phase

This repository starts with a browser-testable control room and a provider-agnostic Super Brain. TikTok LIVE access is isolated behind an adapter because official TikTok LIVE API access depends on product availability, scopes, and app approval.

## Run locally

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

## Environment

Copy `.env.example` to `.env.local` and add server-side AI keys when connecting a real backend. Never commit API keys.

## Architecture

- `src/brain.ts` — Super Brain orchestration
- `src/memory.ts` — short/long-term memory model
- `src/tiktok.ts` — TikTok event adapter contract + simulator
- `src/avatar.ts` — avatar/voice event model
- `src/App.tsx` — browser control room

The UI can be tested without TikTok credentials by using the event simulator.
