# Chat Room

Live demo at https://chat-room-ten-gules.vercel.app/

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/Sameer3079/chat-room/actions/workflows/main.yml/badge.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://github.com/Sameer3079/chat-room/actions/workflows/main.yml/badge.svg">
  <img  src="https://github.com/Sameer3079/chat-room/actions/workflows/main.yml/badge.svg">
</picture>

## Technologies

- 🧙‍♂️ [tRPC](https://trpc.io)
- ⚡ React with Next.js
- ⚡ Prisma
- 🎨 ESLint + Prettier
- 🧪 Jest for testing
- 💚 CI setup using GitHub Actions:
  - ✅ E2E testing with [Playwright](https://playwright.dev/)
  - ✅ Linting

### Requirements

- Node >= 14
- MongoDB

## Development

### Start project

```bash
pnpm install
pnpm prisma generate
pnpm prisma db push
pnpm dx:next
```

### Commands

```bash
pnpm build      # runs `next build`
pnpm db-reset   # resets local db
pnpm dev        # starts next.js
pnpm test-dev   # runs e2e tests on dev
pnpm test-start # runs e2e tests on `next start` - build required before
pnpm test:unit  # runs normal Vitest unit tests
pnpm test:e2e   # runs e2e tests
```
