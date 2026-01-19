# AdCraft AI

An intelligent ad copy generation platform for marketing agencies and brands.

## Features

- **AI-Powered Ad Generation** - Generate platform-optimized ad copy using advanced AI models
- **Brand Management** - Organize multiple brand accounts with custom templates and guidelines
- **Template Library** - Create, search, and tag reusable ad templates per brand
- **Agency Portal** - Multi-brand management for marketing agencies
- **Audit Logging** - Compliance reporting for uploads, generations, and exports
- **Export Options** - Export generated ads as JSON or Markdown

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Supabase (Auth, Database, Storage, Edge Functions)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or bun

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd adcraft-ai

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts (Brand, Auth)
├── hooks/          # Custom hooks
├── pages/          # Route pages
├── integrations/   # Backend integrations
└── lib/            # Utilities
```

## License

MIT
