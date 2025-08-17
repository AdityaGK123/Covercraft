# 🎵 CoverCraft - AI Cover Creation App

**Create professional music covers with AI-powered backing tracks for Indian amateur singers**

A mobile-first Progressive Web App that enables users to create high-quality covers without instruments or professional studios, targeting Indian social media users aged 13-35.

## 🎯 Features

- **Voice Range Detection**: Real-time vocal analysis using Web Audio API to find your perfect key
- **AI Backing Tracks**: Cost-optimized generation with Indian music styles (Bollywood, Classical, Indie)
- **Professional Audio**: Client-side recording, mixing, and enhancement (noise reduction, EQ, compression)
- **Social Media Ready**: Direct sharing to Instagram, YouTube, Facebook with branded watermarks
- **Mobile-First PWA**: Installable app with offline support and background sync
- **Freemium Model**: 3 free tracks, premium subscription for unlimited access
- **Indian Music Focus**: Tabla, sitar, tanpura, harmonium samples and authentic styles

## 🚀 Getting Started

### Prerequisites
- Modern web browser
- Node.js (optional, for development server)

### Running the App

1. Clone the repository:
```bash
git clone https://github.com/your-username/CoverCraft.git
cd CoverCraft
```

2. Open `covercraft.html` in your browser, or run a local server:
```bash
npx http-server -p 8888
```

3. Navigate to `http://localhost:8888/covercraft.html`

## 📁 Project Structure

```
CoverCraft/
├── covercraft.html     # Main application
├── covercraft-styles.css  # Mobile-first CSS
├── manifest.json       # PWA manifest
├── sw.js              # Service worker
├── js/
│   ├── covercraft-app.js        # Main app controller
│   ├── voice-detection.js       # Voice analysis engine
│   ├── audio-engine.js          # Recording & mixing
│   └── backing-track-generator.js # AI track generation
├── netlify.toml        # Deployment config
└── README.md          # This file
```

## 🎮 How It Works

1. **Voice Calibration**: Sing "La la la" for 10 seconds to detect vocal range and preferred key
2. **Song Upload**: Upload audio file or paste YouTube/Spotify URL with non-commercial disclaimer
3. **Style Selection**: Choose mood (chill/emotional/energetic) and genre (Bollywood/Classical/Indie/Pop)
4. **Track Generation**: AI creates 4-track backing (drums, melody, strings, bass) optimized for your voice
5. **Customization**: Toggle tracks on/off, adjust tempo (50%-150%), preview before recording
6. **Recording**: Audio/video recording with real-time backing track playback
7. **Enhancement**: Apply noise reduction, EQ, compression, autotune, reverb, echo
8. **Share & Export**: Direct social media upload or download with branded watermark

## 🎵 Technical Architecture

**Cost-Optimized Design:**
- **Client-Side Processing**: Web Audio API for all audio operations (no server costs)
- **Cached Samples**: Pre-generated instrument samples to minimize AI usage
- **Progressive Enhancement**: Works offline with service worker caching
- **Freemium Strategy**: 3 free tracks to validate users before premium conversion

**Audio Technologies:**
- **Voice Detection**: Frequency analysis and note detection without AI
- **Backing Track Generation**: Synthetic samples with mood-based mixing templates
- **Real-time Recording**: MediaRecorder API with live backing track synchronization
- **Audio Enhancement**: Client-side DSP (compression, EQ, reverb, noise reduction)

## 🎨 Design System

- **Colors**: Indigo Primary (#6366f1), Dark Background (#1a1a2e)
- **Mobile-First**: Responsive design optimized for phones
- **PWA Ready**: Installable with offline support and push notifications
- **Indian Aesthetic**: Colors and typography appealing to Indian users

## 🚀 Deployment

**Cloudflare Pages (Recommended):**
1. Connect GitHub repository to Cloudflare Pages
2. Set build command: `echo 'Static site'`
3. Set output directory: `.`
4. Deploy automatically on push

**Netlify Alternative:**
- Uses existing `netlify.toml` configuration
- Automatic deployments from GitHub

## 📊 Business Model

- **Freemium**: 3 free tracks per user
- **Premium**: ₹99-199/month for unlimited tracks
- **Viral Growth**: Branded watermarks on shared content
- **Target Market**: 50M+ Indian social media users

## ⚖️ Legal Compliance

- **Non-Commercial Use**: Clear disclaimers for cover songs
- **User Agreement**: Terms covering copyright and liability
- **Privacy**: Client-side processing, minimal data collection

## 🤝 Contributing

Contributions welcome! Focus areas:
- Additional Indian music styles and instruments
- Enhanced audio processing algorithms
- Social media platform integrations

## 📄 License

MIT License - see LICENSE file for details.
