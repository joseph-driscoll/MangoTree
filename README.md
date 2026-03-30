This intention of building this web app was for experimentation and to get hands on experience with cutting edge agentic workflows and AI automation tools.
This app serves as a content genereation engine by layering in different LLM flavors for the user to experiment with, mix and match, and ultiamtely provides a custom and catered content generation experience.

# Demo

https://v0-mango-tree-clone-fqfcsytdp.vercel.app/

# Mango Tree

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/driscollrecording-gmailcoms-projects/v0-mango-tree-clone)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/4sBrYyKPKMC)

AI-powered content generation platform for small businesses. Mango Tree takes a business idea and automatically generates a full suite of marketing copy across every channel — website, email, social media, product listings, blog posts, customer messages, and review responses — all in a single generation pass.

<img width="1901" height="912" alt="mangotree" src="https://github.com/user-attachments/assets/248cf5d9-dfc3-4619-b8fe-f26561a7f98d" />

---

## What It Does

Users go through a guided onboarding wizard where they describe their business idea, set a tone, define their target audience, choose a brand voice, and select which content categories they need. The platform calls an LLM to generate all requested content, saves everything to a Supabase database organized into "content suites," and presents the results in a masonry gallery where each piece can be edited, copied, favorited, or regenerated individually.

### Content Categories

- **Website** — Hero sections, about pages, features & benefits, testimonials, FAQs, CTAs, landing pages, navigation, footer
- **Email** — Welcome series, promotional, newsletter, abandoned cart, follow-up, announcements, educational, seasonal
- **Social Media** — Regular posts, stories, promotional, educational, engagement, behind-the-scenes, user-generated, trending
- **Customer Messages** — Welcome, support, sales outreach, follow-up, appointment, feedback requests, thank-you, referral
- **Listings** — Product, service, marketplace, classified ads, directory, real estate, job postings, events
- **Review Responses** — Positive, negative, neutral responses plus review request templates
- **Blog** — How-to guides, listicles, case studies, industry news, opinion pieces, seasonal content

---

## LLM Integration

Content generation is handled server-side via the **Vercel AI SDK** (`ai` v6). The platform uses **Groq** as the inference provider.

| Model | Use Case |
|---|---|
| `llama-3.3-70b-versatile` | Default — best quality, excellent reasoning |
| `llama-3.1-8b-instant` | Fallback — fastest generation |

Groq was chosen for its low latency and free-tier availability. If the primary model fails, the service automatically retries with the fallback model before surfacing an error to the user.

> **Observability / Evals:** No LLM evaluation or observability pipeline (e.g. LangSmith, Helicone, Braintrust) is integrated at this time. Generation is fire-and-forget with basic error handling and automatic model fallback.

---

## Architecture

```
User → Onboarding Wizard → POST /api/generate
                                ↓
                     AIContentGenerator (lib/ai-service.ts)
                     Groq via @ai-sdk/groq
                                ↓
                     DatabaseService (lib/database-service.ts)
                     Supabase PostgreSQL
                                ↓
                     Content Suite Gallery (/dashboard/suites)
```

Individual pieces can be regenerated at any time via `POST /api/regenerate`, which calls the same AI service with the original prompt and saves the updated content back to the database.

---

## Tech Stack

### Core Framework

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.2.1 | App Router, API routes, SSR |
| React | 19.2.4 | UI framework |
| TypeScript | 6.0.2 | Type safety throughout |

### AI / LLM

| Technology | Version | Purpose |
|---|---|---|
| Vercel AI SDK (`ai`) | ^6.0.0 | LLM abstraction layer |
| `@ai-sdk/groq` | ^1.1.0 | Groq provider for AI SDK v6 |
| Groq API | — | Inference (Llama 3.3 70B / 3.1 8B) |

### Database & Auth

| Technology | Version | Purpose |
|---|---|---|
| Supabase | 2.100.1 | PostgreSQL database + Auth |
| `@supabase/ssr` | 0.9.0 | Server-side Supabase client |
| `@supabase/auth-helpers-nextjs` | 0.15.0 | Auth middleware |

### UI

| Technology | Version | Purpose |
|---|---|---|
| Tailwind CSS | 4.2.2 | Utility-first styling |
| Radix UI | various | Accessible headless components |
| shadcn/ui | — | Component library built on Radix |
| Lucide React | 1.7.0 | Icons |
| Framer Motion | ^10.16.16 | Animations |
| Sonner | 2.0.7 | Toast notifications |

### Utilities

| Technology | Purpose |
|---|---|
| Zod | Schema validation |
| clsx + tailwind-merge | Conditional class utilities |
| class-variance-authority | Component variant management |

---

## Project Structure

```
app/
  api/
    generate/              # Bulk content suite generation
    generate-individual/   # Single content piece generation
    regenerate/            # Regenerate a specific piece
    content/               # CRUD for content pieces
  dashboard/               # Protected dashboard pages
  onboarding/              # Multi-step onboarding wizard
  results/                 # Content results viewer
  auth/                    # Sign in / sign up / reset password
components/
  onboarding/              # 6-step onboarding wizard
  content-gallery/         # Masonry gallery with edit/regen/copy
  dashboard/               # Dashboard layout and widgets
  ui/                      # shadcn/ui component library
lib/
  ai-service.ts            # LLM generation logic + content schemas
  database-service.ts      # All Supabase read/write operations
  supabase.ts              # Supabase client configuration
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role (server-only) |
| `GROQ_API_KEY` | Yes | Groq API key for LLM inference |

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000), create an account, and follow the onboarding wizard to generate your first content suite.
