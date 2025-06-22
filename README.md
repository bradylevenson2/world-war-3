# World War 3 Intelligence Hub

A real-time intelligence briefing application that delivers hourly updates on global military tensions and World War 3 developments. Built with React, TypeScript, and Firebase.

## 🚨 Features

- **Real-time Intelligence Updates**: Hourly briefings on global military tensions
- **Countdown Timer**: Shows time until next intelligence update
- **Subscription-based Access**: Secure payment processing with Stripe
- **Mobile-Responsive Design**: Optimized for all devices
- **Dark Military Theme**: Professional intelligence briefing interface
- **Firebase Integration**: Secure authentication and real-time data
- **AI-Generated Content**: OpenAI GPT for engaging news summaries

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Functions)
- **Payments**: Stripe
- **APIs**: OpenAI GPT-3.5, NewsAPI
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase account
- Stripe account
- OpenAI API key
- NewsAPI key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd worldwar3-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your API keys in the `.env` file:
   - Firebase configuration
   - Stripe publishable key
   - OpenAI API key
   - NewsAPI key

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Add your Firebase config to `.env`

### Stripe Setup
1. Create a Stripe account
2. Get your publishable key
3. Set up webhook endpoints for subscription management
4. Add products for subscription plans

### API Keys
- **OpenAI**: For generating engaging news summaries
- **NewsAPI**: For fetching latest war-related news

## 📱 App Structure

- **Authentication**: Secure login/signup with Firebase
- **Payment**: Subscription management with Stripe
- **Dashboard**: Main intelligence briefing interface
- **Countdown Timer**: Real-time countdown to next update
- **News Display**: Formatted intelligence briefings

## 🎨 Design Theme

The app uses a military intelligence theme with:
- Dark background (`#111827`)
- Red accent color (`#DC2626`)
- Military-style typography (Orbitron font)
- Professional, urgent interface design

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔒 Security Features

- Secure Firebase authentication
- Environment variable protection
- Stripe secure payment processing
- Data encryption and protection

## 📄 License

This project is proprietary and confidential.

## 🤝 Contributing

This is a private project. Contact the development team for contribution guidelines.

---

**⚠️ Disclaimer**: This application is for entertainment and educational purposes. It does not provide real military intelligence or classified information.
