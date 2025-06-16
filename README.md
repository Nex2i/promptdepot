# PromptDepot

**Your Central Hub for LLM Prompt Management**

PromptDepot is a comprehensive full-stack application designed to streamline the management, organization, and deployment of Large Language Model (LLM) prompts. It provides a centralized platform for teams to collaborate on prompt development, maintain version control, and integrate with various LLM providers.

## 🚀 Features

- **📝 Prompt Management**: Organize and version control your prompts for consistent LLM interactions
- **🔄 Proxy Integration**: Seamlessly integrate with various LLM providers through a unified interface
- **📋 Use Case Templates**: Access pre-built templates for common LLM use cases and scenarios
- **👥 Multi-tenant Architecture**: Support for multiple organizations with user and project management
- **📁 Directory Structure**: Hierarchical organization of prompts within projects
- **🔐 Authentication & Authorization**: Secure user management with role-based permissions
- **⚡ Real-time Collaboration**: Live updates and collaboration features

## 🏗️ Architecture

PromptDepot follows a modern full-stack architecture:

```
promptdepot/
├── pd-client/          # Frontend React Application
├── pd-server/          # Backend API Server
└── README.md          # This file
```

### Frontend (`pd-client`)
- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4
- **Routing**: TanStack Router
- **State Management**: Redux Toolkit + TanStack Query
- **Build Tool**: Vite
- **Authentication**: Supabase Auth

[📖 Frontend Documentation →](./pd-client/README.md)

### Backend (`pd-server`)
- **Framework**: Fastify with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + Supabase
- **API Documentation**: Swagger/OpenAPI
- **Real-time**: Socket.IO integration
- **Architecture**: Modular plugin-based structure

[📖 Backend Documentation →](./pd-server/README.md)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Supabase account (for authentication)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd promptdepot
```

### 2. Setup Backend

```bash
cd pd-server
npm install
```

Create a `.env` file in `pd-server/` with your configuration:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/promptdepot"
SUPABASE_URL="your-supabase-url"
SUPABASE_ANON_KEY="your-supabase-anon-key"
JWT_SECRET="your-jwt-secret"
```

Run database migrations and start the server:

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd ../pd-client
npm install
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/documentation

## 📊 Database Schema

The application uses a multi-tenant architecture with the following core entities:

- **Users**: Application users with Supabase authentication
- **Tenants**: Organizations or teams
- **Projects**: Containers for prompt collections within tenants
- **Directories**: Hierarchical organization of prompts
- **Prompts**: The actual LLM prompts with metadata

## 🔧 Development

### Available Scripts

**Root Level:**
```bash
# Install dependencies for both frontend and backend
npm run install:all

# Start both development servers
npm run dev
```

**Backend (`pd-server`):**
```bash
npm run dev          # Development server with hot reload
npm run build        # Build for production
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
npm run test         # Run tests
npm run lint         # Run ESLint
```

**Frontend (`pd-client`):**
```bash
npm run dev          # Development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🛠️ Tech Stack

### Frontend
- React 19
- TypeScript
- Tailwind CSS v4
- TanStack Router
- TanStack Query
- Redux Toolkit
- Vite
- Heroicons

### Backend
- Fastify
- TypeScript
- Prisma ORM
- PostgreSQL
- Supabase
- JWT Authentication
- Socket.IO
- Swagger/OpenAPI

## 📝 API Documentation

The backend provides comprehensive API documentation through Swagger UI. Once the server is running, visit:

- **Swagger UI**: http://localhost:3000/documentation
- **OpenAPI Spec**: http://localhost:3000/documentation/json

## 🧪 Testing

```bash
# Run backend tests
cd pd-server && npm test

# Run frontend tests (when available)
cd pd-client && npm test
```

## 🚀 Deployment

### Backend Deployment

1. Set production environment variables
2. Build the application: `npm run build`
3. Run migrations: `npm run db:migrate`
4. Start the server: `npm start`

### Frontend Deployment

1. Set production environment variables
2. Build the application: `npm run build`
3. Deploy the `dist/` directory to your hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🔗 Links

- [Frontend Documentation](./pd-client/README.md)
- [Backend Documentation](./pd-server/README.md)
- [API Documentation](http://localhost:3000/documentation) (when running locally)

---

**Built with ❤️ for the LLM development community**