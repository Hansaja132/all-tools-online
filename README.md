# MultiTools - Scaleable Monorepo Web Starter

This is a production-ready, enterprise-level monorepo starter designed to host hundreds of online tools under a single SEO-optimized site wrapper. It divides shared UI elements, configurations, schemas, and logic into individual workspace packages, and handles core client-side and server-side operations in distinct applications.

## Repository Structure

```text
tools-website/
├── apps/
│   ├── web/                     # Next.js 13 (App Router) Frontend
│   └── api/                     # Express + TypeScript API Server
├── packages/
│   ├── ui/                      # Shared Tailwind UI components library
│   ├── utils/                   # Reusable validation, date, and SEO helpers
│   ├── config/                  # Routing configurations and constants
│   └── shared-types/            # Shared interfaces and Zod models
└── database/
    └── prisma/                  # Database migration structures
```

---

## Technical Architecture

The codebase leverages a clean separation of concerns:
- **Clean Architecture:** Domain layers (in `packages/shared-types` and `apps/api/src/domain`) are independent of infrastructure adapters (e.g. database client, routing).
- **Silent JWT Refresh:** An Axios interceptor queues failed requests during token renewal, ensuring seamless authentication.
- **Dynamic SEO Injections:** Fully compliant JSON-LD schemas (Breadcrumbs, How-Tos, FAQs) are injected on dynamic paths.

---

## Local Setup

### 1. Configure Environments
Copy the template environmental values file:
```bash
cp .env.example .env
```
Update SMTP server creds and Google API secrets inside `.env`.

### 2. Run Database and Services
Start postgres database and dependencies using Docker:
```bash
docker-compose up -d postgres
```

### 3. Install Workspace Dependencies
Execute install at the root level of the monorepo:
```bash
npm install
```

### 4. Push Database Schema
```bash
npm run db:migrate
```

### 5. Launch Development Servers
```bash
npm run dev
```
- Next.js Web: `http://localhost:3000`
- Express API: `http://localhost:5000`

---

## How to Add a New Tool (Extending the Registry)

The architecture is built to support new tools instantly with zero modification to core layouts. Follow these steps:

### 1. Define Tool Meta Configuration
Add the tool's SEO keywords, description, category, and name to `packages/config/src/site.config.ts`:
```typescript
{
  name: 'My New Tool',
  slug: 'my-new-tool',
  category: 'developer-tools',
  description: 'Instantly computes code metrics.',
  keywords: ['code', 'metrics', 'analyzer'],
}
```

### 2. Create the Interactive Component
Create a new directory inside `apps/web/src/features/[category-slug]/[tool-slug]/`:
Create `tool-component.tsx` containing your custom interactive react logic:
```typescript
import React from 'react';
export const MyNewTool: React.FC = () => {
  return <div>Interactive tool content</div>;
};
```

### 3. Add to Features Registry
Open `apps/web/src/features/registry.tsx`. Import your new component and add its FAQs and guides to the `toolsRegistry` mapping:
```typescript
import { MyNewTool } from './developer-tools/my-new-tool/tool-component';

export const toolsRegistry = {
  // ...
  'my-new-tool': {
    component: <MyNewTool />,
    faqs: [
      { question: 'What does this tool do?', answer: 'It computes parameters.' }
    ],
    guide: {
      title: 'How to use My New Tool',
      steps: [
        { name: 'Step 1', text: 'Press evaluate button.' }
      ]
    }
  }
};
```

That's it! The Next.js dynamic routing path `/[category]/[tool]` will now automatically render your tool, generate related tools, and inject structural SEO schemas.
