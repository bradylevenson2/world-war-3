<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# World War 3 Intelligence App - Development Guidelines

This is a React TypeScript application for delivering real-time World War 3 intelligence updates with subscription-based access.

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom military theme
- **Backend**: Firebase (Auth, Firestore, Functions)
- **Payments**: Stripe
- **APIs**: OpenAI GPT, NewsAPI
- **Icons**: Lucide React

## Design Philosophy
- Military/intelligence theme with dark UI
- Red (#DC2626) as primary accent color
- Professional, urgent, and engaging tone
- Mobile-first responsive design
- Security-focused terminology

## Key Features
1. User authentication with Firebase
2. Subscription-based access with Stripe
3. Real-time news updates
4. Countdown timer to next update
5. Automated hourly content generation
6. Mobile-responsive design

## Code Standards
- Use TypeScript for all components
- Follow React functional components with hooks
- Use Tailwind CSS classes with custom utility classes
- Implement proper error handling and loading states
- Use proper TypeScript types and interfaces
- Follow military/intelligence naming conventions

## Firebase Structure
- Authentication for user management
- Firestore for storing news updates and user data
- Functions for automated news generation and scheduling

## Environment Variables
All API keys and sensitive data should use environment variables with VITE_ prefix for frontend access.

## Development Notes
- The app simulates classified intelligence briefings
- Use engaging, urgent language for news summaries
- Implement proper security measures for user data
- Ensure mobile compatibility for all features
