# SkyCast Pro — Modern Weather Dashboard

SkyCast Pro is a high-performance, sleek weather intelligence web application built with **React**, **TypeScript**, **Tailwind CSS**, and **Recharts**, powered by the **Open-Meteo Weather API**.

It delivers real-time weather metrics, hourly temperature & precipitation trends, a 7-day forecast breakdown, atmospheric condition metrics, and smart activity recommendations — all wrapped in a responsive, modern dark slate interface.

---

## ✨ Features

- 🔍 **Instant City Search & Geocoding**: Search millions of global cities with real-time autocompletion powered by Open-Meteo Geocoding.
- 📍 **GPS Geolocation Support**: Detect your current location with one click to view hyper-local weather.
- 🌡️ **Interactive Hourly Forecast & Charts**: Visually examine hourly temperature shifts, precipitation probability, and wind metrics via interactive Recharts data visualization.
- 📅 **7-Day Weather Forecast**: Detailed multi-day projections including daily high/low temperatures, UV index, and weather condition badges.
- 🧠 **Smart Recommendation Engine**: Contextual suggestions for clothing, outdoor activities, UV defense, and wind warnings based on real-time weather rules.
- 📊 **Atmospheric Metrics Grid**: Comprehensive readings for Humidity, Pressure, Dew Point, Visibility, Cloud Cover, UV Index, Wind Direction & Speed, and Sunrise/Sunset timing.
- 🔄 **Metric & Imperial Unit Switching**: Toggle seamlessly between Metric (°C, km/h, mm) and Imperial (°F, mph, in) units across all metrics.
- 💾 **Local Persistence**: Automatically remembers your unit preferences, recent city searches, and last visited location.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **API**: [Open-Meteo Weather API](https://open-meteo.com/) *(Free, high-accuracy, open-source weather forecasting)*

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. Clone or download the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser at `http://localhost:3000`.

---

## 📡 API Reference

This application communicates directly with Open-Meteo open APIs:
- **Geocoding API**: `https://geocoding-api.open-meteo.com/v1/search`
- **Forecast API**: `https://api.open-meteo.com/v1/forecast`

No external API keys or secrets are required to run this app.

---

## 📄 License

MIT License — free to use, modify, and distribute.
