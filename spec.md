# Specification Document

## Project Name
SkillShare Hub

## Overview
A Vercel-hosted web application featuring Google authentication, personal dashboard, skill sharing, and AI-powered content generation.

## Functionality Specification

### Authentication
- Google OAuth via NextAuth.js
- Session management
- Protected routes for authenticated users

### Dashboard
- User profile display
- Recent activity summary
- Quick access to all features

### Skill Sharing
- Create/edit skill entries
- Public skill portfolio page
- Category tags for skills

### AI Tools (Pollination.ai)
- Text generation with prompts
- Image generation interface
- Save generated content to gallery

### Journal
- Markdown editor
- Create, read, update, delete entries
- Local storage or Vercel KV persistence

### Gallery
- Grid view of generated images
- Lightbox viewer for full-size
- Delete functionality

## API Endpoints
- `/api/auth/[...nextauth]` - Authentication
- `/api/skills` - CRUD for skills
- `/api/journal` - CRUD for journal entries
- `/api/generate` - Pollination.ai integration
- `/api/gallery` - Image management

## Environment Variables
```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
POLLINATION_API_KEY=
```

## Acceptance Criteria
1. User can sign in with Google
2. Dashboard shows user info and stats
3. Skills can be created and viewed
4. AI text/image generation works
5. Journal entries persist and display
6. Gallery shows generated images
7. Responsive on mobile and desktop