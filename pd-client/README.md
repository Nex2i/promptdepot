# PromptDepot Frontend (`pd-client`)

**Modern React Frontend for LLM Prompt Management**

The frontend of PromptDepot is a modern, responsive React application built with TypeScript and Tailwind CSS. It provides an intuitive interface for managing LLM prompts, organizing projects, and collaborating with team members.

## 🚀 Features

- **🎨 Modern UI/UX**: Clean, responsive design with Tailwind CSS v4
- **📝 Rich Text Editor**: Advanced prompt editing with markdown support
- **🔄 Real-time Updates**: Live collaboration with TanStack Query
- **🗂️ Project Organization**: Hierarchical prompt organization
- **🔐 Secure Authentication**: Supabase-powered authentication
- **📱 Responsive Design**: Works seamlessly across all devices
- **⚡ Fast Performance**: Optimized with Vite and React 19

## 🏗️ Architecture

```
pd-client/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, icons, and static resources
│   ├── components/        # Reusable React components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries and configurations
│   ├── store/            # Redux store and slices
│   │   └── slices/       # Redux Toolkit slices
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   ├── router.tsx        # TanStack Router configuration
│   └── index.css         # Global styles and Tailwind imports
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md            # This file
```

## 🛠️ Tech Stack

### Core Framework
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server

### Styling & UI
- **Tailwind CSS v4**: Modern utility-first CSS framework
- **Heroicons**: Beautiful SVG icons
- **PostCSS**: CSS processing and optimization

### Routing & State Management
- **TanStack Router**: Type-safe routing with file-based routing
- **Redux Toolkit**: Predictable state management
- **TanStack Query**: Server state management and caching
- **React Redux**: React bindings for Redux

### Development Tools
- **ESLint**: Code linting and formatting
- **TypeScript ESLint**: TypeScript-specific linting
- **Vite DevTools**: Development debugging tools

### Authentication & Backend Integration
- **Supabase**: Authentication and backend services
- **TanStack Query Persist**: Offline-first data persistence

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd pd-client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment configuration:**
   Create a `.env.local` file in the `pd-client` directory:
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Visit `http://localhost:5173`

## 📁 Component Structure

### Core Components

#### `App.tsx`
Main application component that renders the landing page and handles the overall app structure.

#### `TextEditor`
Rich text editor component for creating and editing prompts with markdown support.

### Component Organization

```
src/components/
├── ui/                   # Basic UI components (buttons, inputs, etc.)
├── forms/               # Form components
├── layout/              # Layout components (header, sidebar, etc.)
├── prompt/              # Prompt-related components
├── project/             # Project management components
└── shared/              # Shared/common components
```

## 🎨 Styling

The application uses **Tailwind CSS v4** with a custom configuration:

### Design System
- **Primary Colors**: Gradient-based primary colors
- **Typography**: Modern font hierarchy
- **Spacing**: Consistent spacing scale
- **Responsive**: Mobile-first responsive design

### Custom Tailwind Configuration
```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-light': 'var(--color-primary-light)',
      },
    },
  },
}
```

## 🔄 State Management

### Redux Store Structure
```
store/
├── index.ts              # Store configuration
└── slices/
    ├── authSlice.ts      # Authentication state
    ├── promptSlice.ts    # Prompt management
    ├── projectSlice.ts   # Project management
    └── uiSlice.ts        # UI state (modals, loading, etc.)
```

### TanStack Query Integration
- **Server State**: API data caching and synchronization
- **Optimistic Updates**: Immediate UI updates with background sync
- **Offline Support**: Works offline with cached data
- **Real-time Sync**: Automatic refetching and updates

## 🛡️ Authentication

Authentication is handled through Supabase with the following features:

- **Email/Password Authentication**
- **OAuth Providers** (Google, GitHub, etc.)
- **Protected Routes**: Route-level authentication guards
- **Token Management**: Automatic token refresh
- **User Profile Management**

### Auth Flow
1. User signs in through Supabase Auth
2. JWT token is stored and managed automatically
3. Protected routes check authentication status
4. API requests include authentication headers

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1280px

## 🧪 Development Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint for code quality
npm run lint

# Fix ESLint issues automatically
npm run lint --fix
```

## 🏗️ Build & Deployment

### Production Build
```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Deployment Options

#### Static Hosting (Recommended)
- **Vercel**: Zero-config deployment with Git integration
- **Netlify**: Easy deployment with form handling
- **GitHub Pages**: Free hosting for public repositories
- **AWS S3 + CloudFront**: Scalable cloud hosting

#### Traditional Hosting
1. Build the application: `npm run build`
2. Upload the `dist/` directory to your web server
3. Configure your server to serve `index.html` for all routes (SPA routing)

### Environment Variables for Production
```env
VITE_SUPABASE_URL=your-production-supabase-url
VITE_SUPABASE_ANON_KEY=your-production-supabase-anon-key
VITE_API_BASE_URL=https://your-api-domain.com/api
```

## 🧪 Testing (Coming Soon)

The testing setup will include:

- **Unit Tests**: Component testing with React Testing Library
- **Integration Tests**: Feature testing
- **E2E Tests**: End-to-end testing with Cypress/Playwright

## 🔧 Customization

### Adding New Components
```typescript
// src/components/example/ExampleComponent.tsx
import { FC } from 'react';

interface ExampleComponentProps {
  title: string;
  onClick: () => void;
}

export const ExampleComponent: FC<ExampleComponentProps> = ({
  title,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light transition-colors"
    >
      {title}
    </button>
  );
};
```

### Adding New Routes
```typescript
// src/router.tsx
import { createRouter, createRoute } from '@tanstack/react-router'

const newRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/new-page',
  component: NewPageComponent,
})
```

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (18+)
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`

2. **Supabase Connection Issues**
   - Verify environment variables
   - Check Supabase project settings
   - Ensure CORS is configured in Supabase

3. **Hot Reload Not Working**
   - Restart the development server
   - Check for conflicting ports

## 🤝 Contributing

### Development Workflow
1. Create a feature branch
2. Make your changes following the coding standards
3. Test your changes locally
4. Submit a pull request

### Coding Standards
- Use TypeScript for all new components
- Follow React hooks best practices
- Use Tailwind CSS for styling
- Add proper TypeScript types
- Write meaningful component and prop names

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [Supabase Documentation](https://supabase.com/docs)

---

[← Back to Main Documentation](../README.md) | [Backend Documentation →](../pd-server/README.md)
