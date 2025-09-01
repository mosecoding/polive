# Polive

Real-time polling application with Next.js and Convex.

## Installation

```bash
# Clone repository
git clone <repository-url>
cd polive

# Install dependencies
bun install

# Initialize Convex
bunx convex dev

# Setup Convex auth
bunx @convex-dev/auth

# Start development
bun dev
```

## Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_CONVEX_URL=your_convex_url
CONVEX_AUTH_SECRET=your_auth_secret
```

## Technologies

- Next.js 15
- Convex (DB + Auth)
- TypeScript
- Tailwind CSS
