# 🛍️ Myntra Bharat: Next-Gen Logistics & E-Commerce Optimizer

![Myntra Bharat](https://img.shields.io/badge/Status-Active-success)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![AI Powered](https://img.shields.io/badge/AI-Google_Gemini-orange)

Myntra Bharat is a comprehensive, full-stack logistics and e-commerce optimization dashboard designed to streamline operations across the entire supply chain. It provides specialized interfaces for **Sellers**, **Customers**, **Admins**, and **Operations**, powered by advanced GenAI (Google Gemini) and real-time data visualizations.

---

## ✨ Key Features

### 👤 Customer Experience
*   **Smart Delivery Estimates:** AI-driven predictions for accurate delivery timelines.
*   **Delivery Priority System:** Dynamic clustering algorithms to optimize delivery routes based on location and priority.
*   **Order Tracking:** Real-time visibility into order status.

### 🏪 Seller Dashboard
*   **Inventory AI:** Intelligent demand forecasting and inventory management using GenAI.
*   **Analytics & Sales Insights:** Visualize performance with interactive Recharts.
*   **Demand Prediction:** Proactive restock alerts and market trend analysis.

### ⚙️ Operations & Admin
*   **Fleet & Warehouse Optimization:** Geospatial visualization (Leaflet/React Simple Maps) to manage fleets, microhubs, and warehouses efficiently.
*   **Returns Management:** Streamlined reverse logistics and processing.
*   **Simulation & Scenario Planning:** Tools to simulate load, route efficiency, and optimize resource allocation.
*   **System Health & Revenue Reports:** Comprehensive executive dashboards.

---

## 🛠️ Tech Stack

*   **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Framer Motion
*   **UI Components:** Radix UI, Lucide React
*   **Backend & API:** Next.js API Routes (REST/Serverless)
*   **Database:** Prisma ORM with Better-SQLite3 / LibSQL
*   **AI Integration:** Google Generative AI (Gemini) `@google/generative-ai`
*   **Maps & Data Viz:** Leaflet, React Simple Maps, Recharts, D3-Geo

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v18 or higher)
*   npm, yarn, pnpm, or bun

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/Myntra_Bharat.git
    cd Myntra_Bharat
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    *   Rename `.env.local.example` or `.env` to `.env.local`.
    *   Add your Google Gemini API Key and Database connection strings.
    ```env
    # Example .env.local
    GOOGLE_GEMINI_API_KEY=your_api_key_here
    DATABASE_URL="file:./prisma/dev.db"
    ```

4.  **Database Migration & Seeding:**
    Generate the Prisma client and seed the database with initial logistics data (fleets, returns, etc.).
    ```bash
    npx prisma generate
    npm run seed
    ```

5.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

6.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

---

## 📂 Project Structure

```text
Myntra_Bharat/
├── src/
│   ├── app/
│   │   ├── api/          # Serverless endpoints (admin, customer, operations, seller)
│   │   ├── dashboard/    # Unified dashboard layouts
│   │   ├── login/        # Authentication pages
│   │   └── globals.css   # Global Tailwind styles
│   ├── components/       # Reusable React components (Radix UI, Maps, Charts)
│   └── lib/              # Utility functions, AI configurations (lib/ai.ts), Prisma client
├── prisma/               # Database schema and seed scripts
└── public/               # Static assets
```

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

