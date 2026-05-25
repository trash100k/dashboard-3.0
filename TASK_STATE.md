# TASK_STATE.md — Flynn Dashboard

## Current Task: Phase 2 Implementation

### What's Happening
- We are implementing Phase 2 of the Flynn Dashboard
- Model: we will use the Free Claude Code proxy (NVIDIA Nemotron 30B) via delegate_task
- Toolsets: terminal, file
- Deliver: back to this chat

### Phase 2 Scope
- Install deps: motion, recharts, date-fns, @dnd-kit/core (already installed)
- Fix broken store (pages import it but it doesn't exist) -> we have src/store/index.tsx
- Build Magic UI components: MagicCard, NumberTicker, Marquee, BentoGrid, Particles (we have stubs, need to implement)
- Upgrade Layout: expandable sidebar + command palette
- Upgrade all 7 existing pages per spec
- Create Intel/Search page + Factories page
- Build floating voice chat button with SSE pipeline to NVIDIA proxy
- Build, fix errors, push to master

### Repo Info
- Path: `/root/dashboard-3.0/`
- Remote: `trash100k/dashboard-3.0` (GitHub)
- Deploy: Render auto-builds on push to master
- Stack: Vite + React + Tailwind + Supabase

### Voice Stack (for reference)
- STT: local Whisper
- TTS: Edge TTS (default), gTTS, Chatterbox available
- LLM: NVIDIA Nemotron 30B via Free Claude Code proxy
- Proxy: `/tmp/free-claude-code/` on port 8082

### Post-Build: Warm Mode (Queued)
- Iritis-friendly color palette toggle
- Reduce violet (#8b5cf6 → warm gray)
- Warm white text (#f0ece2 instead of #FFF)
- CSS filter: sepia(0.08) saturate(0.85)
- DO NOT implement until Phase 2 build is confirmed working

### Key Constraints
- CUTTY-OS is OFF LIMITS — never touch it
- Confirm before building anything new
- Delegate coding to subagents/coder models
- Push existing code first → deploy → then improve